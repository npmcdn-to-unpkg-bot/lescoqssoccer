'use strict';

// Articles routes use articles controller
var albums = require('../controllers/albums');
var authorization = require('./middlewares/authorization');

// Article authorization helpers
var hasAuthorization = function (req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.send(401, 'User is not authorized');
	}
	next();
};

module.exports = function (app) {

	/** File upload from user **/
	app.post('/upload', albums.uploadPhoto);

	/** File C.R.U.D. **/
	app.post('/photos', albums.addPhoto);
	app.get('/photos', albums.findAllPhotos);
	app.get('/photos/:id', albums.findPhotoById);
	app.put('/photos/:id', albums.updatePhoto);
	app.post('/photos/:id', albums.updatePhoto);
	app.delete('/photos/:id', albums.deletePhoto);
};