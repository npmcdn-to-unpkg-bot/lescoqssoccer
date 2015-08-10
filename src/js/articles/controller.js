'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$sce', 'Global','Articles', 'Page',
	function($scope, $sce, Global, Articles, Page) {

		$scope.global = Global;
		$scope.articles = Articles;
		$scope.page = parseInt(Page);

		$scope.previous = ($scope.page === 0) ? 0 : $scope.page-1;
		$scope.next = $scope.page+1;

		// Manage search input
		$scope.obj = {
			searchTitle: ""
		};
		$scope.nameFilter = function(article) {
			return (article.title.toLowerCase().indexOf($scope.obj.searchTitle) !== -1) ? article.title : null;
		};

		//Format html content from article content edit by wysiwyg
		$scope.getFormattedContent = function(html) {
			return $sce.trustAsHtml(html);
		};

		$scope.totalItems = 64;
		$scope.pageChanged = function(newPage) {
			$location.path("/articles/" + (newPage + 1));
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
				$location.path("/articles");
				$scope.comment = "";
			});
		};

		$scope.edit = function(article, evt) {

			evt.preventDefault();
			evt.stopPropagation();

			$location.path("/articles/edit/" + article._id);
		};

		$scope.remove = function(article, evt) {

			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: 'js/articles/views/modal/deleteArticleModal.html',
				controller: 'deleteArticleModalCtrl',
				resolve: {
					article: function() {
						return article;
					}
				}
			});

			modalInstance.result.then(function() {

				// Delete the article and redirect to article list
				$scope.ArticlesCollection.remove(article).then(function(response) {
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

angular.module('mean.articles').controller('CreateArticleController', ['$scope', '$location', 'Global', 'ArticlesCollection', 'FileUploader', 'Article',
	function($scope, $location, Global, ArticlesCollection, FileUploader, Article) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;
		$scope.article = Article;

		$scope.create = function() {

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

		// Use by wysiwyg
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

	}
]);

var ArticleDetailData = {

	Article: function(ArticlesCollection, $route) {
		return ($route.current.params.id) ? ArticlesCollection.findOne($route.current.params.id) : null;
	}

};