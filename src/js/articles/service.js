'use strict';

//Articles service used for Articles REST endpoint
angular.module( 'mean.articles' ).factory( 'Articles', [ '$resource',
	function ( $resource ) {
		return $resource( 'articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			query: {
				method: 'GET',
				isArray: true
			},
		} );
	}
] );

/**
 * ArticleModel service
 **/
angular.module( 'mean.articles' ).service( 'ArticlesCollection', [ 'Global', 'Articles',
	function ( Global, Articles ) {

		var global = Global;
		var ArticlesCollection = {

			load: function () {
				return Articles.query( {}, function ( articles ) {
					return articles;
				} ).$promise;
			},

			findOne: function ( articleId ) {

				return Articles.get( {
					articleId: articleId
				}, function ( article ) {
					return article;
				} ).$promise;
			},

			add: function ( article ) {

				return Articles.save({}, article, function (data) {
					return data;
				}).$promise;
			},

			update: function ( article ) {

				return Articles.update( {}, article, function ( data ) {
					return data;
				} ).$promise;
			},

			remove: function ( article ) {

				return Articles.delete( {}, article, function ( data ) {
					return data;
				} ).$promise;
			}
		}

		return ArticlesCollection;
	}
] );