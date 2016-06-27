var fs = require("fs");
var path = require("path");
var config = require("../../config/config");
var qt = require("quickthumb");
var gm = require("gm").subClass({
	imageMagick: true
});

exports.uploadPhoto = function(req, res) {
	console.info("inside uploadPhoto"); // <-- never reached using IE9

	var callbacks = {

		uploadSuccess: function(newName, oldName) {
			console.log("inside uploadSuccess");

			res.writeHead(200, {
				"Content-Type": "application/json"
			});

			res.end(JSON.stringify({
				err: null,
				path: config.uploadDirectory + newName,
				name: oldName,
				location: config.uploadDirectory + newName
			}));
		},
		uploadFailure: function(err) {
			console.log("inside uploadFailure");

			res.writeHead(400, {
				"Content-Type": "text/plain"
			});

			res.end(JSON.stringify({
				err: 100, //Mettre en place des messages d"erreur
				path: null
			}))

		}
	};

	handlePhotoUpload(req.files, callbacks);
};

function handlePhotoUpload(params, callbacks) {
	console.log("inside handlePhotoUpload"); // <-- never reached using IE9

	if (params.file && params.file.type !== "image/png" && params.file.type !== "image/jpeg" && params.file.type !== "image/gif") {
		callbacks.uploadFailure("Wrong file type");
		return;
	}

	var oldImage = params.file || params.image;
	var oldName = oldImage.name || oldImage.name;
	var photoId = guid();
	var newName = photoId + "." + oldImage.path.split(".").pop();
	var newPath = path.resolve(config.root + "/server/" + config.uploadDirectory + newName);

	gm(oldImage.path)
		.autoOrient()
		.write(newPath, function(err) {

			if (err) {

				console.log("Error when trying to move new image " + err);
				callbacks.uploadFailure(err);

			} else {

				var image = gm(newPath);
				image.resize(300, "^");
				image.gravity("Center");
				image.quality(0.7);
				image.autoOrient();
				image.write(path.resolve(config.root + "/server/" + config.cacheDirectoryX300 + newName), function(err) {

					if (err) {
						console.log("Error when trying to resize img in 300 format" + err);
					}

					//Remove origin file in all case
					fs.unlink(oldImage.path, function(err) {

						if (err) {
							console.log("Erorr when trying to delete image " + err);
							callbacks.uploadFailure(err);
						} else {
							console.log("Successfully deleted : " + oldImage.path);
							callbacks.uploadSuccess(newName, oldName);
						}

					});
				});
			}
		});
}

var guid = (function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return function() {
		return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
	};
})();