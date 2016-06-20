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