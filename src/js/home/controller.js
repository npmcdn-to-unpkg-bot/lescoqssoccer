'use strict';

angular.module('mean.home').controller('HomeController', ['$scope', '$sce', 'Global', 'Team', 'UserDatas', 'ConversationService', 'Suggestions', 'ArticleItemsCount', 'AlbumItemsCount', 'UserService',
	function($scope, $sce, Global, Team, UserDatas, ConversationService, Suggestions, ArticleItemsCount, AlbumItemsCount, UserService) {

		$scope.global = Global;
		$scope.team = Team;
		$scope.userDatas = UserDatas;

		console.warn($scope.userDatas.content);

		//Chat
		$scope.conversationService = ConversationService;
		$scope.conversations = {};
		$scope.conversation = null;
		$scope.message = {
			content: ""
		};

		$scope.$parent.menu = null;

		$scope.initialize = function() {
			$scope.initializeConversations();
			$scope.updateCounters();

			consoleText(['Hello World.', 'Console Text', 'Made with Love.'], 'text');
		};

		//Index all conversations in the object $scope.conversations
		$scope.initializeConversations = function() {

			//Add conversation of all users
			$scope.conversations["all"] = {
				conversation: $scope.conversationService.getConversation("all"),
				username: "Tout le monde",
				avatar: "img/coq.png",
				userId: 'all'
			};

			_.each(Team, function(user) {
				if ($scope.global.user._id !== user._id) {
					$scope.conversations[user._id] = {
						conversation: $scope.conversationService.getConversation($scope.global.user._id, user._id),
						username: user.username,
						avatar: user.avatar,
						userId: user._id
					}
				}
			});
		};

		$scope.initChatView = function() {

			//Initaliaze or clear input value
			$scope.message.content = "";

			//Scroll down to bottom of conversation
			setTimeout(function() {
				var conversationList = $("#conversationList");
				if (conversationList.push()) {
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
					if (!$scope.conversation._id) {
						$scope.conversation._id = conversation._id;
					}
					$scope.initChatView();
				});
			}
		};

		$scope.getUnreadMessageCount = function(userId) {
			var currentConversation = $scope.conversations[userId].conversation;
			if (currentConversation.messages.length > 0 && currentConversation.messages.slice(-1).pop().user._id !== $scope.global.user._id && currentConversation.messages.slice(-1).pop().user !== $scope.global.user._id) {
				var conversation = _.findWhere($scope.global.user.conversations, {
					conversationId: currentConversation._id
				});
				if (conversation) {
					return _.filter($scope.conversations[userId].conversation.messages, function(message) {
						return (message.user._id !== $scope.global.user._id) && moment(message.created).isAfter(conversation.lastUpdate);
					}).length;
				}
			}

			return 0;
		};

		//Close the view dialog and go back to the view list
		$scope.closeDialog = function() {
			$scope.conversation = null;
		};

		$scope.updateCounters = function() {
			$scope.getUnreadArticleCount();
			$scope.getUnreadVoteCount();
			$scope.getUnreadAlbumCount();
		};

		$scope.getUnreadArticleCount = function() {
			$scope.unreadArticleCount = ArticleItemsCount.count - Global.user.readArticles.length;
		};

		$scope.getUnreadVoteCount = function() {
			$scope.unreadVoteCount = _.difference(_.pluck(Suggestions.all, '_id'), $scope.global.user.readVotes).length;
		};

		$scope.getUnreadAlbumCount = function() {
			$scope.unreadAlbumCount = AlbumItemsCount.count - Global.user.readAlbums.length;
		};

		$scope.getDateFrom = function(item) {
			var string = moment(item.created).fromNow();
			return string.charAt(0).toUpperCase() + string.slice(1);
		};

		//Format html content from article content edit by wysiwyg
		$scope.getFormattedContent = function(html) {
			return angular.element(html).text();
		};

		//Format video and audio url
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};
	}
]);

var HomeData = {

	Team: function(Users) {
		return Users.query({}, function(users) {
			return users;
		}).$promise;
	},

	UserDatas: function(HomeCollection) {
		return HomeCollection.getUserDatas();
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