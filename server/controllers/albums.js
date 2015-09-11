var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var archiver = require('archiver');
var Album = mongoose.model('Album');

exports.findAllAlbums = function(req, res) {
	Album.find({}, null, {
		sort: {
			name: 1
		}
	}).populate('user').exec(function(err, albums) {
		res.send(albums);
	})
};

exports.findAlbumById = function(req, res) {
	Album.findOne({
		_id: req.params.id
	}).populate('user').exec(function(err, album) {
		if (err) console.log("error finding album: " + err)
		console.warn(album);
		res.send(album);
	})
};

exports.addAlbum = function(req, res) {

	var newAlbum = req.body;
	newAlbum.user = req.user;

	console.log("Adding Album: " + JSON.stringify(newAlbum));
	Album.create(newAlbum, function(err, album) {
		if (err) console.log("error: " + err);
		res.send(album);
	});
};

exports.updateAlbum = function(req, res) {
	Album.findById(req.params.id, function(err, album) {
		delete req.body._id;
		if (err) console.log("error: " + err)
		_.extend(album, req.body);
		album.save(function(err, album, numAffected) {
			if (err) console.log("Error saving album: " + err)
			console.log(numAffected + " documents updated.")
			res.send(album)
		});
	});
};

exports.deleteAlbum = function(req, res) {
	Album.findById(req.params.id, function(err, doc) {
		if (!err) {

			var files = _.extend({}, doc.photoList);
			doc.remove(function() {
				res.send(req.body);

				//remove files on filesystem
				_.each(files, function(file){
					if(file.filepath){
						fs.unlink(file.filepath);
					}
				});
			});

		} else {
			console.log("error: " + err);
		}
	})
};

exports.download = function(req, res) {

	var src = [];
	var id = req.params.id, // ID will be used when creating the archive
		output = fs.createWriteStream('server/public/temp_files/' + id + '.zip'), // Create a write stream for the archive
		archive = archiver('zip'); // Set our archive to zip format

	Album.findOne({
		_id: id
	}).exec(function(err, album) {
		if (err) console.log("error: " + err);

		archive.pipe(output);

		//add each photo of the album to the archive
		_.each(album.photoList, function(entry) {
			src.push(entry.filepath.split('public/img/users/').pop());
		});

		archive.bulk([{
			cwd: 'server/public/img/users/',
			src: src,
			dest: album.name,
			expand: true
		}]);

		archive.on('end', function() {
			return res.json({
				success: true
			});
		});

		archive.finalize();
	});
};

exports.getZipFile = function(req, res) {

	var error = false; // Set a flag to check for errors in downloading the file
	var filePath = 'server/public/temp_files/' + req.params.id + '.zip'; // Store the path to the file

	var stream = fs.createReadStream(filePath, {
		bufferSize: 64 * 1024
	}); // Create a readstream for our file

	stream.pipe(res);

	stream.on('error', function(err) // Error when downloading...
		{
			error = true;
		});

	stream.on('close', function() // Finished downloading...
		{
			if (!error) // If no errors occured
			{
				fs.unlink(filePath); // Delete the archive
			}
		});
};