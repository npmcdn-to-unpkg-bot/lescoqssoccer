'use strict';

//Articles service used for articles REST endpoint
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
	var articles = {
		 
		all: [],
		filtered: [],
		selected: null,
		selectedIdx: null,
		readCount: 0,
		starredCount: 0,

		load: function() { 

		   	Articles.query(function(articles) {      

		     	articles.all = [];
		     	angular.forEach(articles, function(article) {

			       	articles.all.push(article);
			       	articles.all.sort(function(articleA, articlesB) {
			       	  return new Date(articlesB.created).getTime() - new Date(articleA.created).getTime();
			       	});

			       	articles.filtered = articles.all;
			       	articles.readCount = articles.all.reduce(function(count, article) { return article.read ? count : count; }, 0);
			       	articles.starredCount = articles.all.reduce(function(count, article) { return article.starred ? count : count; }, 0);
			       	articles.selected = articles.selected ? articles.all.filter(function(article) { 
			       		return article.id == articles.selected.id; 
			       	})[0] : null;
		    	});
			});
		},

		add: function(article){
			
			var articleModel = new Articles({
		        title: article.title,
		        content: article.content,
		        link: article.link,
		        user: global.user
		    });
		    
		    articleModel.$save(function(response) {
		        $scope.find();
		    });
		},

		update: function(index, callback){
			
			if (index) {
		        articles.filtered[index].$update(function(response) {
		            articles.filtered[index] = response;

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
		    if (articles.hasPrev()) {
		     	articles.selectArticle(articles.selected ? articles.selectedIdx - 1 : 0);
		    }
		},

		next: function() {
		    if (articles.hasNext()) {
		     	articles.selectArticle(articles.selected ? articles.selectedIdx + 1 : 0);
		    }
		},

		hasPrev: function() {
		   	if (!articles.selected) {
		     	return true;
		    }
		    return articles.selectedIdx > 0;
		},

		hasNext: function() {
		    if (!articles.selected) {
		     	return true;
		    }
		    return articles.selectedIdx < articles.filtered.length - 1;
		},

		selectArticle: function(idx) {

		    // Unselect previous selection.
		    if (articles.selected) {
		     	articles.selected.selected = false;
		    }

		    articles.selected = articles.filtered[idx];
		    articles.selectedIdx = idx;
		    articles.selected.selected = true;
		    articles.onCreation = articles.onEdition = false;
		},

		filterBy: function(key, value) {
		    articles.filtered = articles.all.filter(function(article) {
		     	return article[key] === value;
		    });
		    articles.reindexSelectedItem();
		},

		clearFilter: function() {
		    articles.filtered = articles.all;
		    articles.reindexSelectedItem();
		},
	}

	return articles;
}]);