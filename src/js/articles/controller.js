"use strict";

angular.module("mean.articles").controller("ArticlesController", ["$scope", "Global", "$location", "$sce", "$modal", "ArticlesCollection", "Articles", "Page", "ItemsCount",
	function($scope, Global, $location, $sce, $modal, ArticlesCollection, Articles, Page, ItemsCount) {

		$scope.global = Global;
		$scope.articles = Articles;

		$scope.page = parseInt(Page);
		$scope.totalItems = ItemsCount.count;
		$scope.itemsPerPage = ArticlesCollection.itemsPerPage;

		//Format html content from article content edit by wysiwyg
		$scope.getFormattedContent = function(html) {
			return angular.element("<div>" + html + "</div>").text();
		};

		$scope.getImage = function(html) {
			var img = angular.element("<div>" + html + "</div>").find("img").first();
			return (img.length) ? img.attr("src") : "";
		};

		//Format video and audio url
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

		$scope.getDateFrom = function(article) {
			return moment(article.created).fromNow();
		};

		//Manage pagination
		$scope.pageChanged = function(newPage) {
			$location.path((newPage === 1) ? "/articles" : "/articles/" + newPage);
		};

		$scope.closeModal = function() {
			$scope.modalInstance.close();
		};

		$scope.isSpotify = function(link) {
			return link.indexOf("spotify") !== -1;
		};

		$scope.getSuggestionAnswerLength = function(suggestion, option) {
			if (suggestion.yes.length + suggestion.no.length + suggestion.blank.length === 0) {
				return 0;
			} else {
				return Math.round(suggestion[option].length / (suggestion.yes.length + suggestion.no.length + suggestion.blank.length) * 100);
			}
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

		$scope.$parent.menu = {
			title: "Articles",
			items: [{
				link: "#!/articles/create/standard",
				info: "Nouvel article",
				icon: "fa-list-alt"
			}, {
				link: "#!/articles/create/video",
				info: "Nouvelle vidéo",
				icon: "fa-video-camera"
			}, {
				link: "#!/articles/create/audio",
				info: "Nouveau son",
				icon: "fa-volume-up"
			}]
		};
	}
]);

angular.module("mean.articles").controller("ArticleDetailController", ["$scope", "$location", "$sce", "$modal", "Global", "ArticlesCollection", "Article", "UserService",
	function($scope, $location, $sce, $modal, Global, ArticlesCollection, Article, UserService) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;
		$scope.article = Article;
		$scope.dateFormat = "dd MMMM yyyy";

		//set article like read
		UserService.addReadArticle($scope.article._id);

		//Format html content from article content edit by wysiwyg
		$scope.getFormattedContent = function(html) {
			return $sce.trustAsHtml(html);
		};

		//Format video and audio url
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

		$scope.getSuggestionAnswerLength = function(suggestion, option) {
			if (suggestion.yes.length + suggestion.no.length + suggestion.blank.length === 0) {
				return 0;
			} else {
				return Math.round(suggestion[option].length / (suggestion.yes.length + suggestion.no.length + suggestion.blank.length) * 100);
			}
		};

		$scope.updateMethod = function() {
			return $scope.ArticlesCollection.update($scope.article);
		};

		$scope.edit = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			$location.path("/articles/edit/" + $scope.article.type + "/" + $scope.article._id);
		};

		$scope.remove = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: "js/articles/views/modal/deleteArticleModal.html",
				controller: "deleteArticleModalCtrl",
				resolve: {
					article: function() {
						return $scope.article;
					}
				}
			});

			modalInstance.result.then(function() {

				// Delete the article and redirect to article list
				$scope.ArticlesCollection.remove($scope.article).then(function(response) {
					$location.path("/articles");
				});

			});
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

		$scope.backToList = function(evt) {
			evt.preventDefault();
			evt.stopPropagation();

			$location.path("/articles").replace();
		};

		$scope.showPrevious = function(evt) {
			evt.preventDefault();
			evt.stopPropagation();

			var previous = $scope.ArticlesCollection.getPrevious($scope.article);
			$location.path("/articles/view/" + previous.type + "/" + previous._id).replace();
		};

		$scope.showNext = function(evt) {
			evt.preventDefault();
			evt.stopPropagation();

			var next = $scope.ArticlesCollection.getNext($scope.article);
			$location.path("/articles/view/" + next.type + "/" + next._id).replace();
		};

		$scope.$parent.menu = {
			title: "Articles > " + $scope.article.title,
			items: [{
				link: "#!",
				info: "Précédent",
				icon: "fa-arrow-left",
				callback: $scope.showPrevious
			}, {
				link: "#!",
				info: "Retour à la liste",
				icon: "fa-list",
				callback: $scope.backToList
			}, {
				link: "#!",
				info: "Suivant",
				icon: "fa-arrow-right",
				callback: $scope.showNext
			}]
		};

		if ($scope.article.type !== "quote") {
			$scope.$parent.menu.items.unshift({
				link: "#!",
				info: "Supprimer",
				icon: "fa-times",
				callback: $scope.remove
			});
			$scope.$parent.menu.items.unshift({
				link: "#!",
				info: "Editer",
				icon: "fa-edit",
				callback: $scope.edit
			});
		}
	}
]);

angular.module("mean.articles").controller("CreateArticleController", ["$scope", "$location", "Global", "ArticlesCollection", "FileUploader", "Article", "$modal", "Parameters",
	function($scope, $location, Global, ArticlesCollection, FileUploader, Article, $modal, Parameters) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;
		$scope.article = Article;
		$scope.categories = Parameters[0].articleCategories;

		switch ($scope.article.type) {
			case "link":
				$scope.title = $scope.article.title || "Nouveau lien";
				break;
			case "video":
				$scope.title = $scope.article.title || "Nouvelle vidéo";
				$scope.linkAdress = $scope.article.videoLink;
				break;
			case "audio":
				$scope.title = $scope.article.title || "Nouveau son";
				$scope.linkAdress = $scope.article.audioLink;
				break;
		};

		$scope.toggleCategory = function(category, evt) {

			evt.preventDefault();
			evt.stopPropagation();

			if ($scope.article.categories.indexOf(category) === -1) {
				$scope.article.categories.push(category);
			} else {
				$scope.article.categories.splice($scope.article.categories.indexOf(category), 1);
			}

		};

		$scope.isActive = function(category) {
			var categoryId = category.id;
			return _.filter($scope.article.categories, function(_category) {
				return _category.id === categoryId;
			}).length > 0;
		};

		/***
		FILE UPLOAD CONFIG
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
			$scope.article.image = response.path;
		};

		$scope.create = function() {
			switch ($scope.article.type) {
				case "link":
					$scope.article.linkAdress = [{
						value: "Nouveau lien",
						adress: $scope.linkAdress
					}];
					break;
				case "video":
					if ($scope.linkAdress.indexOf("iframe") !== -1) {
						var src = angular.element($scope.linkAdress);
						$scope.article.videoLink = src.attr("src");
					} else {
						$scope.article.videoLink = $scope.linkAdress;
					}
					break;
				case "audio":
					if ($scope.linkAdress.indexOf("iframe") !== -1) {
						var src = angular.element($scope.linkAdress);
						$scope.article.audioLink = src.attr("src");
					} else {
						$scope.article.audioLink = $scope.linkAdress;
					}
					break;
				case "standard":
					$scope.article.content = textboxio.get("#mytextarea")[0].content.get();
					break;
			}

			if ($scope.article.title) {
				if (!$scope.article._id) {

					$scope.ArticlesCollection.add($scope.article).then(function(response) {
						$location.path("/articles");
					});

				} else {

					$scope.ArticlesCollection.update($scope.article).then(function() {
						$location.path("/articles");
					});

				}
			} else {
				var modalInstance = $modal.open({
					templateUrl: "js/articles/views/modal/noTitleArticleModalCtrl.html",
					controller: "noTitleArticleModalCtrl",
					resolve: {
						article: function() {
							return $scope.article;
						}
					}
				});
			}
		};

		$scope.$parent.menu = {
			title: "Nouvel article",
			items: [{
				link: "#!",
				info: "Retour",
				icon: "fa-arrow-left",
				callback: $scope.global.back
			}, {
				link: "#!",
				info: "Sauvegarder",
				icon: "fa-save",
				callback: $scope.create
			}]
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

angular.module("mean.articles").controller("noTitleArticleModalCtrl", ["$scope", "$modalInstance", "article",

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

var ArticlesData = {
	Articles: function(ArticlesCollection, $route) {
		var page = $route.current.params.page || 1;
		return ArticlesCollection.load(page);
	},
	Page: function($route) {
		return $route.current.params.page || 1;
	},
	ItemsCount: function(ArticlesCollection) {
		return ArticlesCollection.getItemsCount();
	}
};

var ArticleDetailData = {
	Article: function(ArticlesCollection, $route, $location) {
		return ($route.current.params.id) ? ArticlesCollection.findOne($route.current.params.id) : {
			type: $location.path().split("/").pop(),
			categories: [],
			content: ""
		};
	},
	Parameters: function(ParametersService) {
		return ParametersService.load();
	}
};