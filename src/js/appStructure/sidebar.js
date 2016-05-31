'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location', 'Suggestions', 'ArticlesCollection', 'AlbumService',

	function($scope, Global, $location, Suggestions, ArticlesCollection, AlbumService) {

		$scope.global = Global;

		$scope.updateBadges = function() {
			$scope.unreadArticleCount = ArticlesCollection.getItemsCount().then(function(data) {
				$scope.unreadArticleCount = data.count - $scope.global.user.readArticles.length;
			}).then(function() {

				AlbumService.getItemsCount().then(function(data) {

					$scope.unreadAlbumCount = data.count - $scope.global.user.readAlbums.length;
					$scope.unreadVoteCount = _.difference(_.pluck(Suggestions.all, '_id'), $scope.global.user.readVotes).length;

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
						notificationNumber: 0
					}, {
						name: "Photos",
						link: "#!/albums",
						id: "albums",
						icon: "fa-file-image-o",
						notificationNumber: $scope.unreadAlbumCount
					}, {
						name: "Copaings",
						link: "#!/users",
						id: "users",
						icon: "fa-users",
						notificationNumber: 0
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
				})
			})
		};

		$scope.updateBadges();

		// $scope.$watch('global.user', function(newValue, oldValue) {
		// 	$scope.updateBadges();
		// });

		$scope.isCurrentPath = function(item) {
			var cur_path = "#!" + $location.path().substr(0, item.id.length + 1);
			return (cur_path.indexOf(item.id) !== -1) || (item.id.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);
		};

		$scope.closeSidebar = function(evt, item) {};
	}
]);

var SidebarData = {
	Suggestions: function(SuggestionsCollection) {
		return SuggestionsCollection.load();
	}
}