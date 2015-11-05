'use strict';

//Global service for global variables
angular.module('mean.system').factory('Global', ['$window',

	function($window) {
		var _this = this;
		_this._data = {
			user: window.user,
			authenticated: !!window.user,
			guid: guid,
			back: function(){
				$window.history.back();
			}
		};

		return _this._data;
	}
]);

var s4 = function() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

var guid = function() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};