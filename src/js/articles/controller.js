'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$routeParams', '$location', '$sce', '$modal','Global', 'ArticlesCollection', 'Articles',
	function($scope, $routeParams, $location, $sce, $modal, Global, ArticlesCollection, Articles) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;
		$scope.articles = Articles;

		$scope.view = 'articles';
		$scope.dateFormat = "dd MMM yyyy 'à' H'h'mm";

		// Manage search input
		$scope.obj = { searchTitle: "" };
		$scope.nameFilter = function(article) {
			return (article.title.toLowerCase().indexOf($scope.obj.searchTitle) !== -1) ? article.title : null;
		};

		//Format html content from article content edit by wysiwyg
		$scope.getFormattedContent  = function(html){
			return $sce.trustAsHtml(html);
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

                // Delete the article and either update article list or redirect to it
                $scope.ArticlesCollection.remove(article).then(function(response) {
					$scope.articles.splice(window._.indexOf($scope.articles, article), 1);
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

angular.module('mean.articles').controller('CreateArticleController', ['$scope', '$location', 'Global', 'ArticlesCollection', 'FileUploader', 'article', 'view',
	function($scope, $location, Global, ArticlesCollection, FileUploader, Article, view) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;
		$scope.article = Article;
		$scope.view = view;

		$scope.create = function() {
			$scope.ArticlesCollection.add($scope.article).then(function() {
				$location.path("/articles");
			});
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

    article: function(ArticlesCollection, $route) {
        return ($route.current.params.articleId) ? ArticlesCollection.findOne($route.current.params.articleId) : null;
    },

    view: function($route) {
        return $route.current.params.view;
    }
};