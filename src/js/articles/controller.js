'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$routeParams', '$location', '$sce', '$modal','Global', 'ArticlesCollection', 'FileUploader',
	function($scope, $routeParams, $location, $sce, $modal, Global, ArticlesCollection, FileUploader) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;
		$scope.view = ($location.path().substr(1, $location.path().length) === 'articles') ? 'articles' : 'create';
		$scope.articles;
		$scope.obj = {
			searchTitle: ""
		};

		$scope.image;
		$scope.article;
		$scope.dateFormat = "dd MMM yyyy 'à' H'h'mm";

		$scope.uploader = new FileUploader({
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [{
				key: 'value'
			}]
		});

		$scope.uploader.onCompleteItem = function(item, response, status, headers) {
			console.info('Upload complete for ', response.path);
			$scope.image = response.path;
		};

		$scope.load = function() {

			var articlePromise = $scope.ArticlesCollection.load();
			articlePromise.then(function(articles) {
				$scope.articles = articles;
			});
		};

		$scope.create = function() {

			var articlePromise = $scope.ArticlesCollection.add({
				image: this.image,
				title: this.title,
				category: this.category,
				content: this.content
			});

			articlePromise.then(function() {
				$location.path("/articles");
			});
		};

		$scope.findOne = function() {

			var articlePromise = $scope.ArticlesCollection.findOne($routeParams.articleId);
			articlePromise.then(function(article) {
				$scope.article = article;
			});
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

		$scope.edit = function(article, evt) {

			evt.preventDefault();
            evt.stopPropagation();

			$location.path("/articles/edit/" + article._id);
		};

		$scope.nameFilter = function(article) {
			if (article.title.toLowerCase().indexOf($scope.obj.searchTitle) !== -1) {
				return article.title;
			} else {
				return;
			}
		};

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

		$scope.getFormattedContent  = function(html){
			return $sce.trustAsHtml(html);
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