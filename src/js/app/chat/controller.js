"use strict";

angular.module("mean.system").controller("ChatController", ["$scope", "Global", "ConversationService", "UserService",
	function($scope, Global, ConversationService, UserService) {

		$scope.global = Global;

		//Chat
		$scope.conversationService = ConversationService;
		$scope.conversations = {};
		$scope.conversation = null;
		$scope.message = {
			content: ""
		};

		//Index all conversations in the object $scope.conversations
		$scope.initializeConversations = function() {
			ConversationService.load().then(function() {

				//Add conversation of all users
				$scope.conversations["all"] = {
					conversation: $scope.conversationService.getConversation("all"),
					username: "Tout le monde",
					avatar: "img/coq.png",
					userId: "all"
				};

				$scope.conversations["all"].unReadMessageCount = $scope.getUnreadMessageCount("all");

				_.each($scope.team, function(user) {
					if ($scope.global.user._id !== user._id) {
						$scope.conversations[user._id] = {
							conversation: $scope.conversationService.getConversation($scope.global.user._id, user._id),
							username: user.username,
							avatar: user.avatar,
							userId: user._id
						};

						if (user.exclude) {
							$scope.conversations[user._id].exclude = user.exclude
						}

						$scope.conversations[user._id].unReadMessageCount = $scope.getUnreadMessageCount(user._id);
					}
				});
			});
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

		$scope.selectUser = function(evt, userId) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			// Init chat view
			$scope.conversation = $scope.conversations[userId].conversation;
			$scope.initChatView();

			// Update counters
			$scope.conversations[userId].unReadMessageCount = 0;
			UserService.updateConversation($scope.conversation._id);
		};

		//Close the view dialog and go back to the view list
		$scope.closeDialog = function() {
			$scope.conversation = null;
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

		$scope.initializeConversations();
	}
]);