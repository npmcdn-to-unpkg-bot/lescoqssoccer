"use strict";

angular.module("mean.agenda").filter("getByIdentifier", function() {
	return function(input, id) {
		var i = 0,
			len = input.length;
		for (i; i < len; i++) {
			if (input[i].identifier === id) {
				return input[i];
			}
		}
		return null;
	}
});

angular.module("mean.agenda").filter("getNameByIdentifier", function() {
	return function(input, id) {
		var i = 0,
			len = input.length;
		for (i; i < len; i++) {
			if (input[i].identifier === id) {
				return input[i].name;
			}
		}
		return null;
	}
});

angular.module("mean.agenda").filter("getImageByIdentifier", function() {
	return function(input, id) {
		var i = 0,
			len = input.length;

		for (i; i < len; i++) {
			if (input[i].identifier === id) {
				return input[i].image;
			}
		}
		return null;
	}
});

angular.module("mean.agenda").filter("limitToCustom", function() {
	return function(input, limit, begin) {

		begin = (begin < 0 && begin >= -input.length) ? input.length + begin : begin;

		if (limit >= 0) {
			return input.slice(begin, begin + limit);
		} else {
			if (begin === 0) {
				return input.slice(limit, input.length);
			} else {
				return input.slice(Math.max(0, begin + limit), begin);
			}
		}
	};
});