var fs = require( 'fs' );
var path = require( "path" );
var config = require( '../../config/config' );

exports.uploadPhoto = function ( req, res ) {
	console.info( 'inside uploadPhoto' ); // <-- never reached using IE9

	var callbacks = {};

	callbacks.uploadSuccess = function ( newName, oldName) {
		console.log( 'inside uploadSuccess' );

		res.writeHead( 200, {
			'Content-Type': 'application/json'
		} );

		res.end( JSON.stringify( {
			err: null,
			path: config.uploadDirectory + newName,
			name: oldName
		} ) );
	};

	callbacks.uploadFailure = function ( err ) {
		console.log( 'inside uploadFailure' );

		res.writeHead( 400, {
			'Content-Type': 'text/plain'
		} );

		res.end( JSON.stringify( {
			err: 100, //Mettre en place des messages d'erreur
			path: null
		} ) );
	};

	handlePhotoUpload( req.files, callbacks );
};

function handlePhotoUpload( params, callbacks ) {
	console.log( 'inside handlePhotoUpload' ); // <-- never reached using IE9

	if ( params.file.type !== 'image/png' && params.file.type !== 'image/jpeg' && params.file.type !== 'image/gif' ) {
		callbacks.uploadFailure( 'Wrong file type' );
		return;
	}

	fs.readFile( params.file.path, function ( err, data ) {

		if ( err ) {
			callbacks.uploadFailure( err );
		}

		var oldName = params.file.name;
		var photoId = guid();
		var newName = photoId + "." + params.file.path.split( '.' ).pop();
		var newPath = path.resolve( config.root + "/server/" + config.uploadDirectory + newName );

		fs.writeFile( newPath, data, function ( err ) {

			if ( err ) {
				callbacks.uploadFailure( err );
			} else {
				callbacks.uploadSuccess( newName, oldName );
			}

			fs.unlink( params.file.path, function ( err ) {
				if ( err ) response.errors.push( "Erorr : " + err );
				console.log( 'successfully deleted : ' + params.file.path );
			} );
		} );
	} );
};

var guid = ( function () {
	function s4() {
		return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 );
	}
	return function () {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	};
} )();