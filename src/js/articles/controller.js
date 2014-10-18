'use strict';

angular.module( 'mean.articles' ).controller( 'ArticlesController', [ '$scope', '$routeParams', '$location', 'Global', 'ArticlesCollection', 'FileUploader',
	function ( $scope, $routeParams, $location, Global, ArticlesCollection, FileUploader ) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;

		$scope.image;
		$scope.article;
		$scope.dateFormat = "dd/MM/yyyy 'à' H'h'mm";

		$scope.uploader = new FileUploader( {
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [ {
				key: 'value'
			} ]
		} );

		$scope.uploader.onCompleteItem = function ( item, response, status, headers ) {
			console.info( 'Upload complete for ', response.path );
			$scope.image = response.path;
		};

		$scope.ArticlesCollection.load();

		$scope.create = function () {

			var articlePromise = $scope.ArticlesCollection.add( {
				title: this.title,
				content: this.content,
				link: this.link,
				image: this.image
			} );

			articlePromise.then( function () {
				$location.path( "/articles" );
			} );
		};

		$scope.findOne = function () {

			var articlePromise = $scope.ArticlesCollection.findOne( $routeParams.articleId );
			articlePromise.then( function ( article ) {
				$scope.article = article;
			} );
		};

		$scope.remove = function () {

			var articlePromise = $scope.ArticlesCollection.remove( $scope.article )
			articlePromise.then( function ( response ) {
				$location.path( "/articles" );
			} );
		};
	}
] );