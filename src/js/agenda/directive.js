angular.module( 'mean.agenda' ).directive( 'wViewevent', function () {

	return {
		restrict: 'E',
		templateUrl: 'js/agenda/views/view.html'
	}
} );

angular.module( 'mean.agenda' ).directive( 'wCreateevent', function () {

	return {
		restrict: 'E',
		templateUrl: 'js/agenda/views/create.html'
	}
} );

angular.module( 'mean.agenda' ).directive( 'wEditevent', function () {

	return {
		restrict: 'E',
		templateUrl: 'js/agenda/views/edit.html'
	}
} );

angular.module( 'mean.agenda' ).directive( 'ngEnter', function () {
	return function ( scope, element, attrs ) {
		element.bind( "keydown keypress", function ( event ) {
			if ( event.which === 13 ) {
				scope.$apply( function () {
					scope.$eval( attrs.ngEnter );
				} );

				event.preventDefault();
			}
		} );
	};
} );