"use strict";

/**
 * Agenda resource
 **/
angular.module("mean.agenda").factory("UserEvent", ["$resource",
	function($resource) {
		return $resource("userEvent/:userEventId", {
			userEventId: "@_id"
		}, {
			"save": {
				method: "POST"
			},
			"update": {
				method: "PUT",
				params: {
					userEventId: "@userEventId"
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
 * Agenda service
 **/
angular.module("mean.agenda").service("AgendaCollection", ["Global", "UserEvent",
	function(Global, UserEvent) {

		var AgendaCollection = {

			all: [],

			load: function() {
				return UserEvent.query({}, function(userEvents) {
					AgendaCollection.all = userEvents;
					return userEvents;
				}).$promise;
			},

			findOne: function(userEventId) {
				return UserEvent.get({
					userEventId: userEventId
				}, function(userEvent) {
					return userEvent;
				}).$promise;
			},

			add: function(userEvent) {
				return UserEvent.save({}, userEvent, function(userEvent) {
					AgendaCollection.all.push(userEvent);
					return userEvent;
				}).$promise;
			},

			update: function(userEvent) {
				return UserEvent.update({
					userEventId: userEvent._id
				}, userEvent, function(userEvent) {
					return userEvent;
				}).$promise;
			},

			remove: function(userEventId) {
				return UserEvent.delete({
					userEventId: userEventId
				}, function(userEvent) {
					return userEvent;
				}).$promise;
			},

			addMeToEvent: function(evt, userEvent) {

				if (evt) {
					evt.preventDefault();
					evt.stopPropagation();
				}

				if (!_.contains(_.pluck(userEvent.guest, "_id"), Global.user._id) && Global.user._id !== userEvent.user._id) {

					userEvent.guest.push({
						_id: Global.user._id
					});

					var ids = _.pluck(userEvent.guestUnavailable, "_id");
					var indexOfUser = _.indexOf(ids, Global.user._id);

					if (indexOfUser !== -1) {
						userEvent.guestUnavailable.splice(indexOfUser, 1);
					}

					AgendaCollection.update(userEvent).then(function(newUserEvent) {});
				}
			}
		}

		return AgendaCollection;
	}
]);