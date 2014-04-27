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

function Item(entry, feedTitle, feedUrl) {
  this.id = entry._id;
  this.read = false;
  this.starred = false;
  this.selected = false;
  this.feedTitle = feedTitle;
  this.feedUrl = feedUrl;
  this.article = entry;

  angular.extend(this, entry);
}

Item.prototype.$$hashKey = function() {
  return this.id;
}


/**
 * ViewModel service representing all feed entries the state of the UI.
 */
angular.module('mean.articles').service('items', ['Articles', function(Articles) {

  var items = {
    all: [],
    filtered: [],
    selected: null,
    selectedIdx: null,
    readCount: 0,
    starredCount: 0,
    onCreation: false,

    getItemsFromDataStore: function(selectNextElement) { 
 
      Articles.query(function(articles) {      

        items.all = [];

        angular.forEach(articles, function(article) {

          var item = new Item(article, article.title, article.comment);
          items.all.push(item);

          // items.all.sort(function(articleA, articlesB) {
          //   return new Date(articlesB.created).getTime() - new Date(articleA.created).getTime();
          // });

          items.filtered = items.all;
          items.readCount = items.all.reduce(function(count, item) { return item.read ? ++count : count; }, 0);
          items.starredCount = items.all.reduce(function(count, item) { return item.starred ? ++count : count; }, 0);
          items.selected = items.selected
              ? items.all.filter(function(item) { return item.id == items.selected.id; })[0]
              : null;
          items.reindexSelectedItem();
        });

        if(selectNextElement){
          if(items.all.length > 0)
            items.prev();
          else
            items.selected = undefined;
        }
      });
    },

    prev: function() {
      if (items.hasPrev()) {
        items.selectItem(items.selected ? items.selectedIdx - 1 : 0);
      }
    },

    next: function() {
      if (items.hasNext()) {
        items.selectItem(items.selected ? items.selectedIdx + 1 : 0);
      }
    },

    hasPrev: function() {
      if (!items.selected) {
        return true;
      }
      return items.selectedIdx > 0;
    },

    hasNext: function() {
      if (!items.selected) {
        return true;
      }
      return items.selectedIdx < items.filtered.length - 1;
    },

    selectItem: function(idx) {

      // Unselect previous selection.
      if (items.selected) {
        items.selected.selected = false;
      }

      items.selected = items.filtered[idx];
      items.selectedIdx = idx;
      items.selected.selected = true;
      items.onCreation = items.onEdition = false;
    },

    showCreationForm: function() {
      if(items.selected) items.selected = undefined;
      items.onCreation = true;
      items.onEdition = false;
    },

    showEditionForm: function() {
      items.onEdition = true;
      items.onCreation = false;
    },

    filterBy: function(key, value) {
      items.filtered = items.all.filter(function(item) {
        return item[key] === value;
      });
      items.reindexSelectedItem();
    },

    clearFilter: function() {
      items.filtered = items.all;
      items.reindexSelectedItem();
    },

    reindexSelectedItem: function() {
      if (items.selected) {
        var idx = items.filtered.indexOf(items.selected);

        if (idx === -1) {
          if (items.selected) items.selected.selected = false;

          items.selected = null;
          items.selectedIdx = null;
        } else {
          items.selectedIdx = idx;
          items.selected.selected = true;
        }
      }
    }
  };

  items.getItemsFromDataStore();

  return items;
}]);


/**
 * Service that is in charge of scrolling in the app.
 */
angular.module('mean.articles').factory('scroll', function($timeout) {
  return {
    pageDown: function() {
      var itemHeight = $('.entry.active').height() + 60;
      var winHeight = $(window).height();
      var curScroll = $('.entries').scrollTop();
      var scroll = curScroll + winHeight;

      if (scroll < itemHeight) {
        $('.entries').scrollTop(scroll);
        return true;
      }

      // already at the bottom
      return false;
    },

    toCurrent: function() {

      // Need the setTimeout to prevent race condition with item being selected.
      $timeout(function() {
        var curScrollPos = $('.summaries').scrollTop();
        var itemTop = $('.summary.active').offset().top - 60;
        $('.summaries').animate({'scrollTop': curScrollPos + itemTop}, 200);
        $('.entries article.active')[0].scrollIntoView();
      }, 0, false);
    }
  };
});

