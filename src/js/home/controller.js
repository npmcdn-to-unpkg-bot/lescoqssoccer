'use strict';

angular.module('mean.home').controller('HomeController', ['$scope', 'Global', 'Team', 'Agenda', 'ConversationService',
	function($scope, Global, Team, Agenda, ConversationService) {

		$scope.global = Global;
		$scope.team = Team;
		$scope.agenda = Agenda;

		$scope.conversationService = ConversationService;
		$scope.conversations = {};
		$scope.conversation = null;

		$scope.message = {
			content: ""
		};

		$scope.initView = function(){
			
			//Initaliaze or clear input value
			$scope.message.content = "";

			//Scroll down to bottom of conversation
			setTimeout(function(){	
				var conversationList = $("#conversationList");
				if(conversationList.push()){
					conversationList.scrollTop(conversationList[0].scrollHeight);
				}
			});
			
		};

		//Index all conversations in the object $scope.conversations 
		$scope.initializeConversations = function(){
			$scope.conversations["all"] = {
				conversation: $scope.conversationService.getConversation("all"),
				username: "Tout le monde",
				avatar: "img/coq.png"
			};

			_.each(Team, function(user){
				if($scope.global.user._id !== user._id){
					$scope.conversations[user._id] = {
						conversation: $scope.conversationService.getConversation($scope.global.user._id, user._id),
						username: user.username,
						avatar: user.avatar
					}
				}
			});
		};

		$scope.selectUser = function(evt, userId) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			$scope.conversation = $scope.conversations[userId].conversation;
			$scope.initView();

			//TODO
			//Update user conversation
		};

		$scope.sendMessage = function() {

			if ($scope.message.content !== "") {

				$scope.conversation.messages.push({
					user: $scope.global.user._id,
					content: $scope.message.content
				});

				$scope.conversationService.addOrUpdate($scope.conversation).then(function(conversation) {
					if(!$scope.conversation._id){
						$scope.conversation._id = conversation._id;
					}
					$scope.initView();
				});

			}
		};

		$scope.getUnreadMessageCount = function(userId){
			var conversation = $scope.conversations[userId].conversation;
			if(conversation.messages.length > 0 && conversation.messages.slice(-1).pop().user._id !== $scope.global.user._id){
				var lastUpdatedDate = _.findWhere($scope.global.user.conversations, {conversationId: conversation._id}).lastUpdate; 
				return _.filter($scope.conversations[userId].conversation.messages, function(message){
					return message.user._id === userId && moment(message.created).isAfter(lastUpdatedDate);
				}).length;
			} else {
				return 0;
			}	
		};

		//Close the view dialog and go back to the view list
		$scope.closeDialog = function(){
			$scope.conversation = null;
		};

	}
]);

var HomeData = {

	Team: function(Users) {
		return Users.query({}, function(users) {
			return users;
		}).$promise;
	},

	Agenda: function(AgendaCollection) {
		return AgendaCollection.load();
	},

	Conversations: function(Global, ConversationService, $route) {
		return ConversationService.load();
	}

};