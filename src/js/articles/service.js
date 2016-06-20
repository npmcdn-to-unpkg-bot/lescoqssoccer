"use strict";

//Articles service used for Articles REST endpoint
angular.module("mean.articles").factory("Articles", ["$resource",
	function($resource) {
		return $resource("articles/:articleId", {
			articleId: "@_id"
		}, {
			"save": {
				method: "POST"
			},
			"update": {
				method: "PUT",
				params: {
					articleId: "@articleId"
				}
			},
			"query": {
				method: "GET",
				isArray: true
			}
		});
	}
]);

/**
 * ArticleModel service
 **/
angular.module("mean.articles").service("ArticlesCollection", ["Articles",
	function(Articles) {

		var ArticlesCollection = {

			all: [],
			itemsPerPage: 12,

			load: function(page) {
				return Articles.query({
					page: page - 1,
					perPage: ArticlesCollection.itemsPerPage
				}, function(articles) {
					return articles;
				}).$promise;
			},

			getAll: function() {
				return Articles.query({}, function(articles) {
					ArticlesCollection.all = articles;
					return articles.length;
				}).$promise;
			},

			getArticlesByUser: function(userId) {
				return Articles.query({
					userId: userId,
					page: 0,
					perPage: ArticlesCollection.itemsPerPage
				}, function(articles) {
					return articles;
				}).$promise;
			},

			getPrevious: function(article) {

				var index = 0;
				for (var i = 0; i < ArticlesCollection.all.length; i++) {
					if (article._id === ArticlesCollection.all[i]._id) index = i;
				}

				return (index - 1 > 0) ? ArticlesCollection.all[index - 1] : ArticlesCollection.all[0];
			},

			getNext: function(article) {

				var index = 0;
				for (var i = 0; i < ArticlesCollection.all.length; i++) {
					if (article._id === ArticlesCollection.all[i]._id) index = i;
				};

				return (index + 1 > ArticlesCollection.all.length - 1) ? ArticlesCollection.all[ArticlesCollection.all.length - 1] : ArticlesCollection.all[index + 1];
			},

			findOne: function(articleId) {
				return Articles.get({
					articleId: articleId
				}, function(article) {
					return article;
				}).$promise;
			},

			add: function(article) {
				return Articles.save({}, article, function(data) {
					return data;
				}).$promise;
			},

			update: function(article) {
				return Articles.update({
					articleId: article._id
				}, article, function(data) {
					return data;
				}).$promise;
			},

			remove: function(articleId) {
				return Articles.delete({
					articleId: articleId
				}, function(data) {
					return data;
				}).$promise;
			}
		}

		return ArticlesCollection;
	}
]);