'use strict';

angular.module('mean.home').controller('HomeController', ['$scope', 'Global', 'Team', 'Agenda', 'ConversationService', 'Conversations',
	function($scope, Global, Team, Agenda, ConversationService, Conversations) {

		$scope.global = Global;
		$scope.team = Team;
		$scope.agenda = Agenda;

		$scope.conversationService = ConversationService;
		$scope.conversations = Conversations;

		$scope.counters = {};

		$scope.message = {
			content: ""
		};

		$scope.closeDialog = function(){
			$scope.currentUserId = null;
			$scope.conversation = null;
		};

		$scope.selectUser = function(evt, user) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			$scope.currentUserId = user._id;
			$scope.conversation = $scope.conversationService.getConversation($scope.global.user._id, user._id);
		};

		$scope.missingMessageCount = function(user){
			var missingMessageCounter = 0;
			if(!$scope.counters[user._id]){
				var conversation = $scope.conversationService.getConversation($scope.global.user._id, user._id);
				if(conversation.messages.length > 0 && moment(conversation.updated).isAfter($scope.global.user.lastConnectionDate)){
					missingMessageCounter = _.filter(conversation.messages, function(message){
						return message.user._id === user._id && moment(message.created).isAfter($scope.global.user.lastConnectionDate);
					}).length;
					$scope.counters[user._id] = missingMessageCounter;
				}
			}
			return  $scope.counters[user._id];
		};

		$scope.sendMessage = function() {

			if ($scope.message.content !== "") {

				$scope.conversation.messages.push({
					user: $scope.global.user._id,
					content: $scope.message.content
				});

				$scope.conversationService.addOrUpdate($scope.conversation).then(function(conversation) {
					$scope.message.content = "";
				});

			}
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