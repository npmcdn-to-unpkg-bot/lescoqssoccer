'use strict';

angular.module( 'mean.agenda' ).factory( 'UserEvent', [ '$resource',
	function ( $resource ) {
		return $resource( 'userEvent/:userEventId', {
			userEventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		} );
	}
] );

/**
 * ArticleModel service
 **/
angular.module( 'mean.agenda' ).service( 'AgendaCollection', [ 'Global', 'UserEvent',
	function ( Global, UserEvent ) {

		var global = Global;
		var AgendaCollection = {

			all: [],
			filtered: [],
			selected: null,
			selectedIdx: null,

			load: function ( callback ) {

				UserEvent.query( function ( userEvents ) {
					AgendaCollection.all = [];
					angular.forEach( userEvents, function ( userEvent ) {

						AgendaCollection.all.push( userEvent );
						AgendaCollection.filtered = AgendaCollection.all;
						AgendaCollection.selected = AgendaCollection.selected ? AgendaCollection.all.filter( function ( userEvent ) {
							return userEvent.id == AgendaCollection.selected.id;
						} )[ 0 ] : null;
					} );

					if ( callback )
						callback( AgendaCollection.all );
				} );
			},

			add: function ( userEvent, callback ) {

				var userEventModel = new UserEvent( userEvent );
				userEventModel.$save( function ( response ) {
					AgendaCollection.load();
					callback( response );
				} );
			},

			update: function ( userEvent, callback ) {
				if ( userEvent ) {
					userEvent.$update( function ( response ) {
						callback( response );
					} );
				} else {
					alert( "Erreur dans la mise à jour de l'évènement" );
				}
			},

			remove: function ( userEvent, callback ) {
				if ( userEvent ) {
					userEvent.$remove( function ( response ) {
						callback( response );
					} );
				} else {
					alert( "Erreur dans la suppression de l'évènement" );
				}
			}
		}

		return AgendaCollection;
	}
] );