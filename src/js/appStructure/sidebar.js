"use strict";

angular.module("mean.system").controller("SidebarController", ["$scope", "Global", "$location", "Suggestions", "ArticlesCollection", "AlbumService", "AgendaCollection",

	function($scope, Global, $location, Suggestions, ArticlesCollection, AlbumService, AgendaCollection) {

		$scope.global = Global;
		$scope.articleCount = 0;
		$scope.albumCount = 0;

		$scope.loadBadges = function() {
			$scope.unreadArticleCount = ArticlesCollection.getItemsCount().then(function(data) {
				$scope.articleCount = data.count;
				$scope.unreadArticleCount = data.count - $scope.global.user.readArticles.length;
			}).then(function() {

				AlbumService.getItemsCount().then(function(data) {
					$scope.albumCount = data.count;
					$scope.unreadAlbumCount = data.count - $scope.global.user.readAlbums.length;
					$scope.unreadVoteCount = _.difference(_.pluck(Suggestions.all, "_id"), $scope.global.user.readVotes).length;
					$scope.unreadAgendaCount = _.filter(AgendaCollection.all, function(userEvent) {
						return !_.contains(_.pluck(userEvent.guest, "_id"), $scope.global.user._id) && !userEvent.subType === "euroMatch";
					}).length;

					$scope.setMenu();
				})
			})
		};

		$scope.updateBadges = function() {
			$scope.unreadArticleCount = $scope.articleCount - $scope.global.user.readArticles.length;
			$scope.unreadAlbumCount = $scope.albumCount - $scope.global.user.readAlbums.length;
			$scope.unreadVoteCount = _.difference(_.pluck(Suggestions.all, "_id"), $scope.global.user.readVotes).length;
			$scope.unreadAgendaCount = _.filter(AgendaCollection.all, function(userEvent) {
				return !_.contains(_.pluck(userEvent.guest, "_id"), $scope.global.user._id) && !userEvent.subType === "euroMatch";
			}).length;

			$scope.setMenu();
		};

		$scope.setMenu = function() {
			$scope.menu1 = [{
				name: "Accueil",
				id: "home",
				link: "#!/home",
				icon: "fa-home",
				notificationNumber: 0
			}, {
				name: "Euro",
				id: "euro",
				link: "#!/euro",
				icon: "fa-futbol-o",
				notificationNumber: 0
			}, {
				// 	name: "Copaings",
				// 	link: "#!/users",
				// 	id: "users",
				// 	icon: "fa-users",
				// 	notificationNumber: 0
				// }, {
				name: "Articles",
				id: "articles",
				link: "#!/articles",
				icon: "fa-list-alt",
				notificationNumber: $scope.unreadArticleCount
			}, {
				name: "Rencards",
				link: "#!/agenda",
				id: "agenda",
				icon: "fa-calendar-o",
				notificationNumber: $scope.unreadAgendaCount
			}, {
				name: "Photos",
				link: "#!/albums",
				id: "albums",
				icon: "fa-file-image-o",
				notificationNumber: $scope.unreadAlbumCount
			}, {
				name: "Votes",
				id: "suggestions",
				link: "#!/suggestions",
				icon: "fa-hand-paper-o",
				notificationNumber: $scope.unreadVoteCount
			}, {
				name: "Bugs",
				id: "issues",
				link: "#!/issues",
				icon: "fa-bug",
				notificationNumber: 0
			}];
		};

		$scope.loadBadges();

		$scope.$watch("global.user", function(newValue, oldValue) {
			$scope.updateBadges();
		});

		$scope.isCurrentPath = function(item) {
			var cur_path = "#!" + $location.path().substr(0, item.id.length + 1);
			return (cur_path.indexOf(item.id) !== -1) || (item.id.indexOf("albums") !== -1 && cur_path.indexOf("gallery") !== -1);
		};
	}
]);