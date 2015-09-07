'use strict';

//links service used for links REST endpoint
angular.module('mean.links').factory('Links', ['$resource',
	function ($resource) {
		return $resource('links/:linkId', {
			linkId: '@_id'
		}, {
			'save': {
				method: 'POST'
			},
			'update': {
				method: 'PUT',
				params: {
					linkId: '@linkId'
				}
			}
		});
	}
]);

/**
 * linkModel service
 **/
angular.module('mean.links').service('LinksCollection', ['Links',
	function (Links) {

		var LinksCollection = {

			load: function(page) {
				return Links.query({page:page-1, perPage: 10}, function(links) {
					return links;
				}).$promise;
			},

			getItemsCount: function() {
				// return LinksCount.get({}, function(result) {
				// 	return result.count;
				// }).$promise;
			},

			add: function(link) {
				return Links.save({}, link, function(data) {
					return data;
				}).$promise;
			},

			update: function(link) {
				return Links.update({
					linkId: link._id
				}, link, function(data) {
					return data;
				}).$promise;
			},

			remove: function(link) {
				return Links.delete({}, link, function(data) {
					return data;
				}).$promise;
			}
		};

		return LinksCollection;
	}
]);