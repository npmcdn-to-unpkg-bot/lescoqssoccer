'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$routeParams', '$location', 'Global', 'ArticlesCollection', 'FileUploader',
	function ($scope, $routeParams, $location, Global, ArticlesCollection, FileUploader) {

		$scope.global = Global;
		$scope.onCreation = false;
		$scope.uploaderItem;
		$scope.image;
		$scope.ArticlesCollection = ArticlesCollection;

		$scope.dateFormat = "dd/MM/yyyy 'à' H'h'mm";
		$scope.uploader = new FileUploader({
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [{
				key: 'value'
			}]
		});

		$scope.uploader.onAfterAddingFile = function (item) {
			console.info('After adding a file', item);
			$scope.uploaderItem = item;
		};

		$scope.uploader.onCompleteItem = function (item, response, status, headers) {
			console.info('Complete', item, response);
			$scope.image = response.path;
		};

		$scope.showCreationForm = function () {
			if ($scope.selected) $scope.selected.selected = false;
			$scope.onCreation = true;
			$scope.onEdition = false;
		};

		$scope.showEditionForm = function () {
			$scope.editingArticle = _.clone($scope.selected);
			$scope.onEdition = true;
			$scope.onCreation = false;
		};

		$scope.totalItems = 64;
		$scope.currentPage = 4;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.pageChanged = function () {
			console.log('Page changed to: ' + $scope.currentPage);
		};

		$scope.maxSize = 5;
		$scope.bigTotalItems = 175;
		$scope.bigCurrentPage = 1;

		$scope.ArticlesCollection.load();

		$scope.create = function () {

			var article = {
				title: this.title,
				content: this.content,
				link: this.link,
				image: this.image
			}

			$scope.ArticlesCollection.add(article, function () {
				$scope.onCreation = false;
			});
		}
	}
]);