'use strict';

angular.module('mean.agenda').factory('UserEvent', ['$resource', function($resource) {
    return $resource('userEvent/:articleId', {
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
angular.module('mean.agenda').service('AgendaCollection', ['Global', 'UserEvent', function(Global, UserEvent) {

	var global = Global;
	var AgendaCollection = {
		 
		all: [],
		filtered: [],
		selected: null,
		selectedIdx: null,

		load: function(callback) { 

		   	UserEvent.query(function(userEvents) { 
		     	AgendaCollection.all = [];
		     	angular.forEach(userEvents, function(userEvent) {

			       	AgendaCollection.all.push(userEvent);
			       	AgendaCollection.filtered = AgendaCollection.all;
			       	AgendaCollection.selected = AgendaCollection.selected ? AgendaCollection.all.filter(function(userEvent) { 
			       		return userEvent.id == AgendaCollection.selected.id; 
			       	})[0] : null;
		    	});

		     	if (callback)
		    		callback(AgendaCollection.all);
			});
		},

		add: function(userEvent, callback){
			
			var userEventModel = new UserEvent(userEvent);
		    
		    userEventModel.$save(function(response) {
		        AgendaCollection.load();
		        callback(response);
		    });
		},

		remove : function(userEvent, callback){
		    if (userEvent) {
		        userEvent.$remove(function(response){
		            callback(response);
		        });
		    } else {
		       alert("Erreur dans la suppression de l'évènement");
		    }
		},

		prev: function() {
		    if (AgendaCollection.hasPrev()) {
		     	AgendaCollection.selectArticle(AgendaCollection.selected ? AgendaCollection.selectedIdx - 1 : 0);
		    }
		},

		next: function() {
		    if (AgendaCollection.hasNext()) {
		     	AgendaCollection.selectArticle(AgendaCollection.selected ? AgendaCollection.selectedIdx + 1 : 0);
		    }
		},

		hasPrev: function() {
		   	if (!AgendaCollection.selected) {
		     	return true;
		    }
		    return AgendaCollection.selectedIdx > 0;
		},

		hasNext: function() {
		    if (!AgendaCollection.selected) {
		     	return true;
		    }
		    return AgendaCollection.selectedIdx < AgendaCollection.filtered.length - 1;
		},

		selectArticle: function(idx) {

		    // Unselect previous selection.
		    if (AgendaCollection.selected) {
		     	AgendaCollection.selected.selected = false;
		    }

		    AgendaCollection.selected = AgendaCollection.filtered[idx];
		    AgendaCollection.selectedIdx = idx;
		    AgendaCollection.selected.selected = true;
		    AgendaCollection.onCreation = AgendaCollection.onEdition = false;
		},

		filterBy: function(key, value) {
		    AgendaCollection.filtered = AgendaCollection.all.filter(function(article) {
		     	return article[key] === value;
		    });
		    AgendaCollection.reindexSelectedItem();
		},

		clearFilter: function() {
		    AgendaCollection.filtered = AgendaCollection.all;
		    AgendaCollection.reindexSelectedItem();
		},
	}

	return AgendaCollection;
}]);