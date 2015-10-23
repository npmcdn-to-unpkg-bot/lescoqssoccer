'use strict';

angular.module('mean.users').controller('TeamController', ['$scope', 'Global', 'Team', '$modal',
	function($scope, Global, Team, $modal) {

		$scope.global = Global;
		$scope.team = Team;

		$scope.showUserDetail = function(evt, user) {

			evt.preventDefault();
			evt.stopPropagation();

			$modal.open({
				templateUrl: 'js/users/views/modal/userDetail.html',
				controller: 'userDetailController',
				windowClass: 'userDetailPopup',
				resolve: {
					User: function() {
						return user;
					}
				}
			});
		};

	}
]);

angular.module('mean.users').controller('UserDetailController', ['$scope', 'User',

	function($scope, User) {

		$scope.user = User;
	}
]);

angular.module('mean.users').controller('ProfileController', ['$scope', 'Global', 'User', '$translate', 'FileUploader',

	function($scope, Global, User, $translate, FileUploader) {

		$scope.global = Global;
		$scope.user = User;

		/***
			AVATAR
		***/
		$scope.uploader = new FileUploader({
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [{
				key: 'value'
			}]
		});

		$scope.uploader.onCompleteItem = function(item, response, status, headers) {
			console.info('Complete', item, response);
			$scope.user.avatar = response.path;
		};

		/***
			SKILLS
		***/
		$scope.initSkill = function() {
			$scope.skill = {
				name: "",
				value: 50
			};
		};

		$scope.addSkill = function() {

			if (!$scope.user.skills) {
				$scope.user.skills = [];
			}

			var currentSkill = angular.extend({}, $scope.skill);
			$scope.user.skills.push(currentSkill);
			$scope.initSkill();

			$scope.triggerResize();
		};

		$scope.removeSkill = function(skill) {
			$scope.user.skills.splice($scope.user.skills.indexOf(skill), 1);
		};

		/***
			SETTINGS
		***/
		$scope.changeLanguage = function(key) {
			$translate.use(key);
		};

		/***
			MODEL
		***/
		$scope.update = function() {
			$scope.user.$update(function(response) {
				Global.user = response;
			});
		};

		$scope.triggerResize = function() {
			$(window).trigger('resize');
		};

		$scope.initSkill();
	}
]);

angular.module('mean.users').controller('ChatController', ['$scope', 'Global', 'Team', 'ConversationService',

	function($scope, Global, Team, ConversationService, Conversation) {

		$scope.global = Global;
		$scope.team = Team;
		$scope.conversationService = ConversationService;
		$scope.conversation = Conversation;
		$scope.message = {
			content: ""
		};

		$scope.selectUser = function(evt, user) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			$scope.conversation = $scope.conversationService.getConversation($scope.global.user._id, user._id);
		};

		$scope.sendMessage = function() {

			if ($scope.message.content !== "") {

				$scope.conversation.messages.push({
					user: $scope.global.user._id,
					content: $scope.message.content
				});

				if (!$scope.conversation._id) {
					$scope.conversationService.add($scope.conversation).then(function(conversation) {
						$scope.conversation = conversation;
						$scope.message.content = "";
					});
				} else {
					$scope.conversationService.update($scope.conversation).then(function(conversation) {
						$scope.conversation = conversation;
						$scope.message.content = "";
					});
				}
			}
		};
	}
]);

var TeamData = {

	Team: function(Users) {
		return Users.query({}, function(users) {
			return users;
		}).$promise;;
	}

};

var ChatData = {

	Team: function(Users) {
		return Users.query({}, function(users) {
			return users;
		}).$promise;;
	},

	Conversations: function(ConversationService) {
		return ConversationService.load();
	},

	Conversation: function(ConversationService, $route) {
		return ConversationService.getConversationById($route.current.params.id);
	}

};

var UserDetailData = {

	User: function(Users, $route) {
		return Users.get({
			userId: $route.current.params.id
		}, function(user) {
			return user;
		}).$promise;;
	}

};

var ProfileData = {

	User: function(Users, Global) {
		return Users.get({
			userId: Global.user._id
		}, function(user) {
			return user;
		}).$promise;;
	}

};