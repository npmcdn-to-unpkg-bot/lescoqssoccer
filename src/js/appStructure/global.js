"use strict";

//Global service for global variables
angular.module("mean.system").factory("Global", ["$window",

	function($window) {
		var _this = this;
		_this._data = {
			user: window.user,
			authenticated: !!window.user,
			guid: guid,
			back: function() {
				$window.history.back();
			}
		};

		return _this._data;
	}
]);