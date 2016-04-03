'use strict';

angular.module('mean.home').controller('HomeController', ['$scope', 'Global', 'Team', 'Agenda', 'ConversationService', 'Suggestions', 'ArticleItemsCount', 'AlbumItemsCount', 'UserService',
	function($scope, Global, Team, Agenda, ConversationService, Suggestions, ArticleItemsCount, AlbumItemsCount, UserService) {

		$scope.global = Global;
		$scope.team = Team;
		$scope.agenda = Agenda;

		$scope.conversationService = ConversationService;
		$scope.conversations = {};
		$scope.conversation = null;

		$scope.message = {
			content: ""
		};

		$scope.initialize = function(){
			$scope.initializeConversations();
			$scope.updateCounters();
		};

		//Index all conversations in the object $scope.conversations 
		$scope.initializeConversations = function(){
			$scope.conversations["all"] = {
				conversation: $scope.conversationService.getConversation("all"),
				username: "Tout le monde",
				avatar: "img/coq.png",
				userId: 'all'
			};

			_.each(Team, function(user){
				if($scope.global.user._id !== user._id){
					$scope.conversations[user._id] = {
						conversation: $scope.conversationService.getConversation($scope.global.user._id, user._id),
						username: user.username,
						avatar: user.avatar,
						userId: user._id
					}
				}
			});
		};

		$scope.initChatView = function(){
			
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

		$scope.selectUser = function(evt, userId) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			$scope.conversation = $scope.conversations[userId].conversation;
			$scope.initChatView();

			UserService.updateConversation($scope.conversation._id);
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
					$scope.initChatView();
				});

			}
		};

		$scope.getUnreadMessageCount = function(userId){
			var conversation = $scope.conversations[userId].conversation;
			if(conversation.messages.length > 0 && conversation.messages.slice(-1).pop().user._id !== $scope.global.user._id){
				var conversation = _.findWhere($scope.global.user.conversations, {conversationId: conversation._id});
				if(conversation){
					return _.filter($scope.conversations[userId].conversation.messages, function(message){
						return (message.user._id !== $scope.global.user._id) && moment(message.created).isAfter(conversation.lastUpdate);
					}).length;
				} else {
					return 0;
				}
			} else {
				return 0;
			}	
		};

		//Close the view dialog and go back to the view list
		$scope.closeDialog = function(){
			$scope.conversation = null;
		};

		$scope.updateCounters = function(){
			$scope.getUnreadArticleCount();
			$scope.getUnreadVoteCount();
			$scope.getUnreadAlbumCount();
		};

		$scope.getUnreadArticleCount = function(){
			$scope.unreadArticleCount = ArticleItemsCount.count - Global.user.readArticles.length;
		};

		$scope.getUnreadVoteCount = function(){
			$scope.unreadVoteCount = _.difference(_.pluck(Suggestions.all, '_id'), $scope.global.user.readVotes).length;
		};

		$scope.getUnreadAlbumCount = function(){
			$scope.unreadAlbumCount = AlbumItemsCount.count - Global.user.readAlbums.length;
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
	},

	Suggestions: function(SuggestionsCollection) {
		return SuggestionsCollection.load();
	},

	ArticleItemsCount: function(ArticlesCollection) {
		return ArticlesCollection.getItemsCount();
	},

	AlbumItemsCount: function(AlbumService) {
		return AlbumService.getItemsCount();
	}

};