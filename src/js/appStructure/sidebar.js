'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location', 'Suggestions',

	function($scope, Global, $location, Suggestions) {

		$scope.global = Global;

		$scope.getUnreadArticleCount = function(){
			$scope.unreadArticleCount = ArticleItemsCount.count - Global.user.readArticles.length;
		};

		$scope.getUnreadVoteCount = function(){
			$scope.unreadVoteCount = _.difference(_.pluck(Suggestions.all, '_id'), $scope.global.user.readVotes).length;
		};

		$scope.getUnreadAlbumCount = function(){
			$scope.unreadAlbumCount = AlbumItemsCount.count - Global.user.readAlbums.length;
		};

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
			notificationNumber: $scope.getUnreadAlbumCount
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
			notificationNumber: $scope.getUnreadVoteCount
		}, {
			name: "Bugs",
			id: "issues",
			link: "#!/issues",
			icon: "fa-bug",
			notificationNumber: 0
		},
		// {
		// 	name: "Paramètres",
		// 	id: "parameters",
		// 	link: "#!/parameters",
		// 	icon: "fa-gears",
		// 	notificationNumber: 0
		// }
		];

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
	},

	ArticleItemsCount: function(ArticlesCollection) {
		return ArticlesCollection.getItemsCount();
	},

	AlbumItemsCount: function(AlbumService) {
		return AlbumService.getItemsCount();
	}
}