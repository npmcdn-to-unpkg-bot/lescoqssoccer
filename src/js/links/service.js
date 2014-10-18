'use strict';

//links service used for links REST endpoint
angular.module('mean.links').factory('Links', ['$resource',
	function ($resource) {
		return $resource('links/:linkId', {
			linkId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

/**
 * linkModel service
 **/
angular.module('mean.links').service('LinksCollection', ['Global', 'Links',
	function (Global, Links) {

		var global = Global;
		var LinksCollection = {

			all: [],
			filtered: [],
			selected: null,
			selectedIdx: null,
			readCount: 0,
			starredCount: 0,

			load: function () {

				Links.query(function (links) {

					LinksCollection.all = [];
					angular.forEach(links, function (link) {

						LinksCollection.all.push(link);
						LinksCollection.all.sort(function (linkA, linkB) {
							return new Date(linkB.created).getTime() - new Date(linkA.created).getTime();
						});

						LinksCollection.filtered = LinksCollection.all;
						LinksCollection.readCount = LinksCollection.all.reduce(function (count, link) {
							return link.read ? count : count;
						}, 0);
						LinksCollection.starredCount = LinksCollection.all.reduce(function (count, link) {
							return link.starred ? count : count;
						}, 0);
						LinksCollection.selected = LinksCollection.selected ? LinksCollection.all.filter(function (link) {
							return link.id == LinksCollection.selected.id;
						})[0] : null;
					});
				});
			},

			add: function (link, callback) {

				var linkModel = new Links(link);

				linkModel.$save(function (response) {
					LinksCollection.load();
					callback.call();
				});
			},

			update: function (index, callback) {

				if (index) {
					LinksCollection.filtered[index].$update(function (response) {
						LinksCollection.filtered[index] = response;

						if (callback)
							callback.call();
					});
				} else {
					if (callback)
						callback.call();
				}
			},

			remove: function (index, callback) {
				if (index) {
					$scope.filtered[index].$remove(function (response) {
						if (callback)
							callback.call();
					});
				} else {
					if (callback)
						callback.call();
				}
			}
		}

		return LinksCollection;
	}
]);