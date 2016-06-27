"use strict";

angular.module("mean.home").controller("HomeController", ["$scope", "$sce", "Global", "$modal", "UserDatas", "UserService",
	function($scope, $sce, Global, $modal, UserDatas, UserService) {

		$scope.global = Global;
		$scope.team = UserDatas.users;
		$scope.timelineContent = UserDatas.content;

		$scope.$parent.menu = {
			title: "Accueil",
			items: []
		};

		$scope.initialize = function() {
			setTimeout(function() {
				var consoleTextArray = "";
				// consoleTextArray.push("Salut les suceurs, voici la nouvelle version du site, ici défilera les petits messages de chacun, pour changer ton message, va dans ton profil. A+")
				_.each($scope.team, function(user) {
					if (user.presentation && user.presentation !== "") {
						var username = user.username;
						consoleTextArray += username.charAt(0).toUpperCase() + username.slice(1) + ": " + user.presentation + "   ...   ";
					}
				});
				$("#consoleMarquee").html(consoleTextArray);
			}, 500);
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
					},

				}
			});
		};

		$scope.showPointsRulesPopUp = function(evt) {
			evt.preventDefault();
			evt.stopPropagation();

			$modal.open({
				templateUrl: "js/home/views/modal/pointRules.html",
				controller: "PointRulesController",
				windowClass: "userDetailPopup"
			});
		};

		$scope.getLinkFromComment = function(comment) {
			switch (comment.contentType) {
				case "standard":
					return "#!/articles/view/standard/" + comment.contentId;
				case "audio":
					return "#!/articles/view/audio/" + comment.contentId;
				case "video":
					return "#!/articles/view/video/" + comment.contentId;
				case "quote":
					return "#!/articles/view/quote/" + comment.contentId;
				case "match":
					return "#!/euro/view/" + comment.contentId;
				case "userEvent":
					return "#!/agenda/view/" + comment.contentId;
				case "album":
					return "#!/albums/view/" + comment.contentId;
				default:
					break;
			}
		};

		$scope.getTypeFromComment = function(comment) {
			switch (comment.contentType) {
				case "standard":
					return "un article";
				case "audio":
					return "un son";
				case "video":
					return "une vidéo";
				case "quote":
					return "un résultat de vote";
				case "match":
					return "un match";
				case "userEvent":
					return "un évènement";
				case "album":
					return "un album";
				default:
					break;
			};
		};
	}
]);

angular.module("mean.home").controller("UserDetailController", ["$scope", "$sce", "$modalInstance", "User", "Albums", "UserArticles",

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

angular.module("mean.home").controller("PointRulesController", ["$scope", "$modalInstance",
	function($scope, $modalInstance) {
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	}
]);

var HomeData = {
	UserDatas: function(HomeCollection) {
		return HomeCollection.getUserDatas();
	}
};