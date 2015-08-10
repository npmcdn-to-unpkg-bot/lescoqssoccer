'use strict';

//Articles service used for Articles REST endpoint
angular.module( 'mean.articles' ).factory( 'Articles', [ '$resource',
	function ( $resource ) {
		return $resource( 'articles/:param', {
			param: '@param'
		}, {
			'save': {
				method: 'POST'
			},
			'update': {
				method: 'PUT',
				params: {
					param: '@articleId'
				},
			},
			'query': {
				method: 'GET',
				isArray: true
			},
		} );
	}
] );

/**
 * ArticleModel service
 **/
angular.module( 'mean.articles' ).service( 'ArticlesCollection', [ 'Articles',
	function ( Articles ) {

		var ArticlesCollection = {

			load: function (page) {
				return Articles.query( {}, {param:page}, function ( articles ) {
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
				return Articles.update( {
					articleId: article._id
				}, article, function ( data ) {
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