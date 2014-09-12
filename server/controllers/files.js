
exports.uploadPhoto = function(req, res) {
    console.info('inside uploadPhoto'); // <-- never reached using IE9

    var callbacks = {};

    callbacks.uploadSuccess = function(){
        console.log('send ok');

        var fileObject = req.files.file;
        fileObject.path = "img/users/" + fileObject.path.split('/').pop();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(fileObject));
    };

    callbacks.uploadFailure = function(err){
        console.log('send bad');
	    res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('callback(\'{\"msg\": \"KO\"}\')');
	};

	console.log(req.files);

    callbacks.uploadSuccess();
    //handlePhotoUpload(req.files, callbacks);
};

function handlePhotoUpload(params, callbacks) {
    console.log('inside handlePhotoUpload'); // <-- never reached using IE9

    console.log("00");

    console.log("0");
    if(params.file.type !== 'image/png' && params.file.type !== 'image/jpeg' && params.file.type !== 'image/gif') {
	    callbacks.uploadFailure('Wrong file type');
	    return;
	}

    console.log("1");
    fs.readFile(params.file.path, function(err, data){
        console.log("2");
        if(err){
            callbacks.uploadFailure(err);
        }

        console.log("3");
        var newPath = path.resolve("/public/img/users/" + params.file.filename);
        fs.writeFile(newPath, data, function(err) {

            console.log("4");
            if(err){
                callbacks.uploadFailure(err);
            }

            console.log("ok sauvé");
            callbacks.uploadSuccess();
        });
    });
};