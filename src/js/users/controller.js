'use strict';

angular.module('mean.users').controller('TeamController', ['$scope', 'Global', 'Team', '$modal',
	function($scope, Global, Team, $modal) {

		$scope.global = Global;
		$scope.team = Team;
		$scope.colors = {
			0: "Red",
			1: "Pink",
			2: "Purple",
			3: "Deep-Purple",
			4: "Indigo",
			5: "Blue",
			6: "Light-Blue",
			7: "Cyan",
			8: "Teal",
			9: "Green",
			10: "Light-Green",
			11: "Lime",
			12: "Yellow",
			13: "Amber",
			14: "Orange",
			15: "Deep-Orange",
			16: "Brown",
			17: "Grey",
			18: "Blue-Grey"
		};

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

		$scope.getColorClass = function(index){
			return $scope.colors[index];
		};

	}
]);

angular.module('mean.users').controller('UserDetailController', ['$scope','$sce', 'User', 'Albums', 'UserArticles',

	function($scope, $sce, User, Albums, UserArticles) {

		$scope.user = User;
		$scope.albums = Albums;
		$scope.articles = UserArticles;

		$scope.getFormattedContent = function(html) {
			return angular.element(html).text();
		};

		$scope.getImage = function(html){
			var img = angular.element(html).find('img').first();
			return (img.length) ? img.attr('src') : '';
		};

		//Format video and audio url
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

		$scope.isSpotify = function(link){
			return link.indexOf('spotify') !== -1;
		};
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
				value: ""
			};
		};

		$scope.addSkill = function() {

			if (!$scope.user.skills) {
				$scope.user.skills = [];
			}

			var currentSkill = angular.extend({}, $scope.skill);
			$scope.user.skills.push(currentSkill);
			$scope.initSkill();
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

		$scope.initSkill();
	}
]);

angular.module('mean.users').controller('ChatController', ['$scope', 'Global', 'Team', 'ConversationService', 'Conversations', 'UserId',

	function($scope, Global, Team, ConversationService, Conversations, UserId) {

		$scope.global = Global;
		$scope.team = Team;
		$scope.conversationService = ConversationService;
		$scope.conversations = Conversations;
		$scope.conversation = (UserId) ? ConversationService.getConversation(Global.user._id, UserId) : null
		$scope.currentUserId = UserId;

		$scope.message = {
			content: ""
		};

		$scope.selectUser = function(evt, user) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			$scope.currentUserId = user._id;
			$scope.conversation = $scope.conversationService.getConversation($scope.global.user._id, user._id);
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

var TeamData = {

	Team: function(Users) {
		return Users.query({}, function(users) {
			return users;
		}).$promise;
	}

};

var ChatData = {

	Team: function(Users) {
		return Users.query({}, function(users) {
			return users;
		}).$promise;
	},

	Conversations: function(Global, ConversationService, $route) {
		return ConversationService.load();
	},

	UserId: function($route) {
		return $route.current.params.id;
	}

};

var UserDetailData = {

	User: function(Users, $route) {
		return Users.get({
			userId: $route.current.params.id
		}, function(user) {
			return user;
		}).$promise;
	},

	Albums: function(AlbumService, $route) {
		return AlbumService.getAlbumsByUser($route.current.params.id).then(function(albums) {
			return albums;
		});
	},

	UserArticles: function(ArticlesCollection, $route) {
		return ArticlesCollection.getArticlesByUser($route.current.params.id).then(function(articles) {
			return articles;
		});
	},

};

var ProfileData = {

	User: function(Users, Global) {
		return Users.get({
			userId: Global.user._id
		}, function(user) {
			return user;
		}).$promise;
	}

};