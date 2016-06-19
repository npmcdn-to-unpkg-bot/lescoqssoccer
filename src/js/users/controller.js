"use strict";

angular.module("mean.users").controller("TeamController", ["$scope", "Global", "Team", "$modal", "Users", "AlbumService", "ArticlesCollection",
	function($scope, Global, Team, $modal, Users, AlbumService, ArticlesCollection) {

		$scope.global = Global;
		$scope.team = Team;

		$scope.showUserDetail = function(evt, user) {

			evt.preventDefault();
			evt.stopPropagation();

			$modal.open({
				templateUrl: "js/users/views/modal/userDetail.html",
				controller: "UserDetailController",
				windowClass: "userDetailPopup",
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
					}
				}
			});
		};

		$scope.$parent.menu = {
			title: "Le classement de l'euro",
			items: [{
				link: "#!",
				info: "Retour",
				icon: "fa-arrow-left",
				callback: $scope.global.back
			}]
		};
	}
]);

angular.module("mean.users").controller("UserDetailController", ["$scope", "$sce", "$modalInstance", "User", "Albums", "UserArticles",

	function($scope, $sce, $modalInstance, User, Albums, UserArticles) {

		$scope.user = User;
		$scope.albums = Albums;
		$scope.articles = UserArticles;

		$scope.getFormattedContent = function(html) {
			return angular.element(html).text();
		};

		$scope.getImage = function(html) {
			var img = angular.element(html).find("img").first();
			return (img.length) ? img.attr("src") : "";
		};

		//Format video and audio url
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

		$scope.isSpotify = function(link) {
			return link.indexOf("spotify") !== -1;
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	}
]);

angular.module("mean.users").controller("ProfileController", ["$scope", "Global", "$sce", "$modal", "User", "UserService", "$translate", "FileUploader", "UserContents", "AgendaCollection", "ArticlesCollection", "AlbumService",

	function($scope, Global, $sce, $modal, User, UserService, $translate, FileUploader, UserContents, AgendaCollection, ArticlesCollection, AlbumService) {

		$scope.global = Global;
		$scope.user = User;
		$scope.userContents = UserContents.content;

		/***
			AVATAR
		***/
		$scope.uploader = new FileUploader({
			scope: $scope,
			url: "/upload/photo",
			autoUpload: true,
			formData: [{
				key: "value"
			}]
		});

		$scope.uploader.onCompleteItem = function(item, response, status, headers) {
			console.info("Complete", item, response);
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

		//Format html content from article content edit by wysiwyg
		$scope.getFormattedContent = function(html) {
			return angular.element(html).text();
		};

		//Format video and audio url
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

		$scope.deleteEvent = function(evt, userEvent) {
			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: "js/agenda/views/modal/deleteAgendaModal.html",
				controller: "deleteAgendaModalCtrl",
				resolve: {
					userEvent: function() {
						return userEvent;
					}
				}
			});

			modalInstance.result.then(function() {
				AgendaCollection.remove(userEvent._id).then(function(){
					$scope.removeItem(userEvent);
				});
			});
		};

		$scope.deleteArticle = function(evt, article) {
			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: "js/articles/views/modal/deleteArticleModal.html",
				controller: "deleteArticleModalCtrl",
				resolve: {
					article: function() {
						return article;
					}
				}
			});

			modalInstance.result.then(function() {
				ArticlesCollection.remove(article._id).then(function(){
					$scope.removeItem(article);
				});
			});
		};

		$scope.deleteAlbum = function(evt, album) {
			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: "js/gallery/views/modal/deleteAlbumModal.html",
				controller: "deleteAlbumModalCtrl",
				resolve: {
					album: function() {
						return album;
					}
				}
			});

			modalInstance.result.then(function() {
				AlbumService.deleteAlbum(album._id).then(function(){
					$scope.removeItem(album);
				});
			});
		};

		$scope.removeItem = function(item){
			$scope.userContents.splice($scope.userContents.indexOf(item), 1);
		};

		$scope.$parent.menu = {
			title: "Profil",
			items: [{
				link: "#!",
				info: "Retour",
				icon: "fa-arrow-left",
				callback: $scope.global.back
			}, {
				link: "#!",
				info: "Sauvegarder",
				icon: "fa-save",
				callback: $scope.update
			}]
		};

		$scope.initSkill();
	}
]);

angular.module("mean.albums").controller("deleteAlbumModalCtrl", ["$scope", "$modalInstance", "album",

	function($scope, $modalInstance, album) {

		$scope.album = album;

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	}
]);


angular.module("mean.articles").controller("deleteAgendaModalCtrl", ["$scope", "$modalInstance", "userEvent",

	function($scope, $modalInstance, userEvent) {

		$scope.userEvent = userEvent;

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	}

]);

angular.module("mean.articles").controller("deleteArticleModalCtrl", ["$scope", "$modalInstance", "article",

	function($scope, $modalInstance, article) {

		$scope.article = article;

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
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
	}
};

var ProfileData = {
	User: function(UserService, Global) {
		return UserService.findOne(Global.user._id);
	},

	UserContents: function(HomeCollection) {
		return HomeCollection.getUserDatasFromId();
	}
};