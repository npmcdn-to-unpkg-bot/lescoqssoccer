'use strict';

/**
 * Agenda resource
 **/
angular.module( 'mean.agenda' ).factory( 'UserEvent', [ '$resource',
	function ( $resource ) {
		return $resource( 'userEvent/:userEventId', {
			userEventId: '@_id'
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
 * Agenda service
 **/
angular.module( 'mean.agenda' ).service( 'AgendaCollection', [ 'Global', 'UserEvent',
	function ( Global, UserEvent ) {

		var AgendaCollection = {

			all: [],

			load: function () {
				return UserEvent.query( {}, function ( userEvents ) {
					return userEvents;
				} ).$promise;
			},

			setEvents: function(events){
				AgendaCollection.all = events;
			},

			add: function ( userEvent ) {
				return UserEvent.save( {}, userEvent, function ( userEvent ) {
					AgendaCollection.all.push(userEvent);
					return userEvent;
				} ).$promise;
			},

			update: function ( userEvent ) {
				return UserEvent.update( {}, userEvent, function ( userEvent ) {
					return userEvent;
				} ).$promise;
			},

			remove: function ( userEvent, callback ) {
				return UserEvent.delete( {}, userEvent, function ( userEvent ) {
					return userEvent;
				} ).$promise;
			}
		}

		return AgendaCollection;
	}
] );