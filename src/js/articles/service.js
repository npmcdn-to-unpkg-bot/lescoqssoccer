'use strict';

//Articles service used for Articles REST endpoint
angular.module('mean.articles').factory('Articles', ['$resource', function($resource) {
    return $resource('articles/:articleId', {
        articleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

/**
* ArticleModel service
**/
angular.module('mean.articles').service('ArticlesCollection', ['Global', 'Articles', function(Global, Articles) {

	var global = Global;
	var ArticlesCollection = {
		 
		all: [],
		filtered: [],
		selected: null,
		selectedIdx: null,
		readCount: 0,
		starredCount: 0,

		load: function() { 

		   	Articles.query(function(articles) {      

		     	ArticlesCollection.all = [];
		     	angular.forEach(articles, function(article) {

			       	ArticlesCollection.all.push(article);
			       	ArticlesCollection.all.sort(function(articleA, articleB) {
			       	  return new Date(articleB.created).getTime() - new Date(articleA.created).getTime();
			       	});

			       	ArticlesCollection.filtered = ArticlesCollection.all;
			       	ArticlesCollection.readCount = ArticlesCollection.all.reduce(function(count, article) { return article.read ? count : count; }, 0);
			       	ArticlesCollection.starredCount = ArticlesCollection.all.reduce(function(count, article) { return article.starred ? count : count; }, 0);
			       	ArticlesCollection.selected = ArticlesCollection.selected ? ArticlesCollection.all.filter(function(article) { 
			       		return article.id == ArticlesCollection.selected.id; 
			       	})[0] : null;
		    	});	
			});
		},

		add: function(article, callback){
			
			var articleModel = new Articles(article);
		    
		    articleModel.$save(function(response) {
		        ArticlesCollection.load();
		        callback.call();
		    });
		},

		update: function(index, callback){
			
			if (index) {
		        ArticlesCollection.filtered[index].$update(function(response) {
		            ArticlesCollection.filtered[index] = response;

		            if(callback)
		            	callback.call();
		        });
		    } else {
		        if(callback)
		            callback.call();
		    }
		},

		remove: function(index, callback){
			if (index) {
	          	$scope.filtered[index].$remove(function(response){
	              	if(callback)
		            	callback.call();
	          	});
	        } else {
	          	if(callback)
		            callback.call();
	        }
		},

		prev: function() {
		    if (ArticlesCollection.hasPrev()) {
		     	ArticlesCollection.selectArticle(ArticlesCollection.selected ? ArticlesCollection.selectedIdx - 1 : 0);
		    }
		},

		next: function() {
		    if (ArticlesCollection.hasNext()) {
		     	ArticlesCollection.selectArticle(ArticlesCollection.selected ? ArticlesCollection.selectedIdx + 1 : 0);
		    }
		},

		hasPrev: function() {
		   	if (!ArticlesCollection.selected) {
		     	return true;
		    }
		    return ArticlesCollection.selectedIdx > 0;
		},

		hasNext: function() {
		    if (!ArticlesCollection.selected) {
		     	return true;
		    }
		    return ArticlesCollection.selectedIdx < ArticlesCollection.filtered.length - 1;
		},

		selectArticle: function(idx) {

		    // Unselect previous selection.
		    if (ArticlesCollection.selected) {
		     	ArticlesCollection.selected.selected = false;
		    }

		    ArticlesCollection.selected = ArticlesCollection.filtered[idx];
		    ArticlesCollection.selectedIdx = idx;
		    ArticlesCollection.selected.selected = true;
		    ArticlesCollection.onCreation = ArticlesCollection.onEdition = false;
		},

		filterBy: function(key, value) {
		    ArticlesCollection.filtered = ArticlesCollection.all.filter(function(article) {
		     	return article[key] === value;
		    });
		    ArticlesCollection.reindexSelectedItem();
		},

		clearFilter: function() {
		    ArticlesCollection.filtered = ArticlesCollection.all;
		    ArticlesCollection.reindexSelectedItem();
		},
	}

	return ArticlesCollection;
}]);