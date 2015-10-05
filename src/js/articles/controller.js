'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', 'Global', '$location', '$sce', '$modal', 'Articles', 'Page', 'ItemsCount',
	function($scope, Global, $location, $sce, $modal, Articles, Page, ItemsCount) {

		$scope.global = Global;
		$scope.articles = Articles;

		$scope.page = parseInt(Page);
		$scope.totalItems = ItemsCount.count;

		//Format html content from article content edit by wysiwyg
		$scope.getFormattedContent = function(html) {
			return $sce.trustAsHtml(html);
		};

		$scope.pageChanged = function(newPage) {
			if (newPage === 1) {
				$location.path("/articles");
			} else {
				$location.path("/articles/" + newPage);
			}
		};

		$scope.add = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			$scope.modalInstance = $modal.open({
				templateUrl: 'js/articles/views/modal/chooseArticleType.html',
				scope: $scope
			});
		};

		$scope.closeModal = function() {
			$scope.modalInstance.close();
		};
	}
]);

angular.module('mean.articles').controller('ArticleDetailController', ['$scope', '$location', '$sce', '$modal', 'Global', 'ArticlesCollection', 'Article',
	function($scope, $location, $sce, $modal, Global, ArticlesCollection, Article) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;
		$scope.article = Article;

		//Format html content from article content edit by wysiwyg
		$scope.getFormattedContent = function(html) {
			return $sce.trustAsHtml(html);
		};

		$scope.addComment = function() {

			$scope.article.comments.push({
				user: $scope.global.user._id,
				content: $scope.comment,
				created: moment(new Date()).toISOString()
			});

			$scope.ArticlesCollection.update($scope.article).then(function() {
				$scope.comment = "";
			});
		};

		$scope.edit = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			$location.path("/articles/edit/" + $scope.article._id);
		};

		$scope.remove = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: 'js/articles/views/modal/deleteArticleModal.html',
				controller: 'deleteArticleModalCtrl',
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
	}
]);

angular.module('mean.articles').controller('deleteArticleModalCtrl', ['$scope', '$modalInstance', 'article',

	function($scope, $modalInstance, article) {

		$scope.article = article;

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

]);

angular.module('mean.articles').controller('CreateArticleStandardController', ['$scope', '$location', 'Global', 'ArticlesCollection', 'FileUploader', 'Article',
	function($scope, $location, Global, ArticlesCollection, FileUploader, Article) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;
		$scope.article = Article || {
			title: "",
			categories: [],
			content: "",
			image: ""
		};

		/***
		CATEGORIES
		***/
		$scope.categories = [{
			id: "1",
			value: "Voluptate"
		}, {
			id: "2",
			value: "Deserani"
		}, {
			id: "3",
			value: "Quo eram"
		}, {
			id: "4",
			value: "Mentitum amet sit"
		}, {
			id: "5",
			value: "Cillum"
		}, {
			id: "6",
			value: "Incurreret"
		}, {
			id: "7",
			value: "Eram amet aliqua"
		}];

		$scope.toggleCategory = function(category, evt) {

			evt.preventDefault();
			evt.stopPropagation();

			if ($scope.article.categories.indexOf(category) === -1) {
				$scope.article.categories.push(category);
			} else {
				$scope.article.categories.splice($scope.article.categories.indexOf(category), 1);
			}

		};

		/***
		FILE UPLOAD CONFIG
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
			$scope.article.image = response.path;
		};

		/***
		WYSIWYG CONFIG
		***/
		$scope.customMenu = [
			['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
			['font'],
			['font-size'],
			['font-color', 'hilite-color'],
			['remove-format'],
			['ordered-list', 'unordered-list', 'outdent', 'indent'],
			['left-justify', 'center-justify', 'right-justify'],
			['code', 'quote', 'paragragh'],
			['link', 'image']
		];

		$scope.create = function() {

			var editors = textboxio.get('#mytextarea');
			var editor = editors[0];

			$scope.article.content = editor.content.get();

			if (!$scope.article._id) {
				$scope.ArticlesCollection.add($scope.article).then(function() {
					$location.path("/articles");
				});
			} else {
				$scope.ArticlesCollection.update($scope.article).then(function() {
					$location.path("/articles");
				});
			}
		};

	}
]);

angular.module('mean.articles').controller('CreateArticleOtherController', ['$scope', '$location', 'Global', 'ArticlesCollection', 'FileUploader', 'Article',
	function($scope, $location, Global, ArticlesCollection, FileUploader, Article) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;
		$scope.article = Article;

		switch($scope.article.type){
			case "link":
				$scope.title = "Nouveau lien";
				break;
			case "video":
				$scope.title = "Nouvelle vidéo";
				break;
			case "audio":
				$scope.title = "Nouveau son";
				break;
		}

		/***
		CATEGORIES
		***/
		$scope.categories = [{
			id: "1",
			value: "Voluptate"
		}, {
			id: "2",
			value: "Deserani"
		}, {
			id: "3",
			value: "Quo eram"
		}, {
			id: "4",
			value: "Mentitum amet sit"
		}, {
			id: "5",
			value: "Cillum"
		}, {
			id: "6",
			value: "Incurreret"
		}, {
			id: "7",
			value: "Eram amet aliqua"
		}];

		$scope.toggleCategory = function(category, evt) {

			evt.preventDefault();
			evt.stopPropagation();

			if ($scope.article.categories.indexOf(category) === -1) {
				$scope.article.categories.push(category);
			} else {
				$scope.article.categories.splice($scope.article.categories.indexOf(category), 1);
			}

		};

		/***
		FILE UPLOAD CONFIG
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
			$scope.article.image = response.path;
		};

		$scope.create = function() {

			if($scope.article.type==="link"){
				$scope.article.linkAdress = [];
				$scope.article.linkAdress.push({
					value:"Nouveau lien",
					adress: $scope.linkAdress
				})
			}

			if (!$scope.article._id) {
				$scope.ArticlesCollection.add($scope.article).then(function() {
					$location.path("/articles");
				});
			} else {
				$scope.ArticlesCollection.update($scope.article).then(function() {
					$location.path("/articles");
				});
			}
		};

	}
]);

var ArticleDetailData = {

	Article: function(ArticlesCollection, $route, $location) {
		return ($route.current.params.id) ? ArticlesCollection.findOne($route.current.params.id) : {
			title: "TITRE",
			type: $location.path().split("/").pop(),
			linkAdress: "ADRESSE (http://)",
			description: "DESCRIPTION"
		};
	}

};