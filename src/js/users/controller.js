'use strict';

angular.module('mean.users').controller('TeamController', ['$scope', 'Global', 'Team', '$modal', 'Users', 'AlbumService', 'ArticlesCollection',
	function($scope, Global, Team, $modal, Users, AlbumService, ArticlesCollection) {

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
				controller: 'UserDetailController',
				windowClass: 'userDetailPopup',
				resolve: {

					User: function(UserService) {
						return UserService.findOne(user._id);
					},

					Albums: function(AlbumService) {
						return AlbumService.getAlbumsByUser(user._id).then(function(albums) {
							return albums;
						});
					},

					UserArticles: function(ArticlesCollection) {
						return ArticlesCollection.getArticlesByUser(user._id).then(function(articles) {
							return articles;
						});
					},

				}
			});
		};

		$scope.getColorClass = function(index) {
			return $scope.colors[index];
		};

		setTimeout(function() {
			setUserDisplay();
		});
	}
]);

angular.module('mean.users').controller('UserDetailController', ['$scope', '$sce', '$modalInstance', 'User', 'Albums', 'UserArticles',

	function($scope, $sce, $modalInstance, User, Albums, UserArticles) {

		$scope.user = User;
		$scope.albums = Albums;
		$scope.articles = UserArticles;

		$scope.getFormattedContent = function(html) {
			return angular.element(html).text();
		};

		$scope.getImage = function(html) {
			var img = angular.element(html).find('img').first();
			return (img.length) ? img.attr('src') : '';
		};

		//Format video and audio url
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

		$scope.isSpotify = function(link) {
			return link.indexOf('spotify') !== -1;
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);

angular.module('mean.users').controller('ProfileController', ['$scope', 'Global', 'User', 'UserService', '$translate', 'FileUploader',

	function($scope, Global, User, UserService, $translate, FileUploader) {

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
			UserService.update($scope.user).then(function(user) {
				$scope.global.user = user;
			});
		};

		$scope.$parent.menu = {
			title: "Profile",
			items: [{
				link: '#!',
				info: 'Retour',
				icon: 'fa-arrow-left',
				callback: $scope.global.back
			},
			{
				link: '#!',
				info: 'Sauvegarder',
				icon: 'fa-save',
				callback: $scope.update
			}]
		};

		$scope.initSkill();
	}
]);

var TeamData = {

	Team: function(UserService) {
		return UserService.load();
	}

};

var UserDetailData = {

	User: function(UserService, $route) {
		return UserService.findOne($route.current.params.id);
	},

	Albums: function(AlbumService, $route) {
		return AlbumService.getAlbumsByUser($route.current.params.id);
	},

	UserArticles: function(ArticlesCollection, $route) {
		return ArticlesCollection.getArticlesByUser($route.current.params.id);
	},

};

var ProfileData = {

	User: function(UserService, Global) {
		return UserService.findOne(Global.user._id);
	}

};