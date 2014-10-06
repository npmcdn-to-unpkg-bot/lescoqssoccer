'use strict';

// Articles routes use articles controller
var photos = require('../controllers/photos');
var authorization = require('./middlewares/authorization');

// Article authorization helpers
var hasAuthorization = function (req, res, next) {
	if (req.photo.user.id !== req.photo.id) {
		return res.send(401, 'User is not authorized');
	}
	next();
};

module.exports = function (app) {

	/** File C.R.U.D. **/
	app.post('/photos', photos.addPhoto);
	app.get('/photos', photos.findAllPhotos);
	app.get('/photos/:id', photos.findPhotoById);
	app.put('/photos/:id', photos.updatePhoto);
	app.post('/photos/:id', photos.updatePhoto);
	app.delete('/photos/:id', photos.deletePhoto);
};