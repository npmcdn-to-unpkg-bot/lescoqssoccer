angular.module( 'mean.agenda' ).filter( 'getByIdentifier', function () {
	return function ( input, id ) {
		var i = 0,
			len = input.length;
		for ( i; i < len; i++ ) {
			if ( input[ i ].identifier === id ) {
				return input[ i ];
			}
		}
		return null;
	}
} )