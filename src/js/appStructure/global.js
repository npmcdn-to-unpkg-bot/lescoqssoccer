'use strict';

//Global service for global variables
angular.module('mean.system').factory('Global', ['$window',

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

var s4 = function() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

var guid = function() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

function progressbar() {
	$(".progress-wrap").each(function() {
		var me = jQuery(this);
		moveProgressBar(me);
	});
}

function moveProgressBar(o) {
	var getPercent = (o.data('progress-percent') / 100);
	var getProgressWrapWidth = o.width();
	var progressTotal = getPercent * getProgressWrapWidth;
	var progressTotalPercent = progressTotal - 30;
	var animationLength = 1500;

	if (o.hasClass('v')) {
		var getPercent = 1 - (o.data('progress-percent') / 100);
		var getProgressWrapWidth = o.height();
		var progressTotal = getPercent * getProgressWrapWidth;
		o.find('.progress-bar').stop().animate({
			top: progressTotal - getProgressWrapWidth
		}, animationLength);

		return false;
	}

	o.waypoint(function() {
		o.find('.progress-bar').stop().animate({
			left: progressTotal
		}, animationLength);
	}, {
		offset: '100%',
		triggerOnce: true
	});
}

function setUserDisplay() {
	$('.material-card > .mc-btn-action').click(function() {
		var card = $(this).parent('.material-card');
		var icon = $(this).children('i');
		icon.addClass('fa-spin-fast');

		if (card.hasClass('mc-active')) {
			card.removeClass('mc-active');

			window.setTimeout(function() {
				icon
					.removeClass('fa-arrow-left')
					.removeClass('fa-spin-fast')
					.addClass('fa-bars');

			}, 800);
		} else {
			card.addClass('mc-active');

			window.setTimeout(function() {
				icon
					.removeClass('fa-bars')
					.removeClass('fa-spin-fast')
					.addClass('fa-arrow-left');

			}, 800);
		}
	});
}

function consoleText(words, id, colors) {

	if (colors === undefined) colors = ['#2196F3'];
	var visible = true;
	var con = document.getElementById('console');
	var letterCount = 1;
	var x = 1;
	var waiting = false;
	var target = document.getElementById(id);

	if (target) {
		target.setAttribute('style', 'color:' + colors[0])

		window.setInterval(function() {

			if (letterCount === 0 && waiting === false) {
				waiting = true;
				target.innerHTML = words[0].substring(0, letterCount)
				window.setTimeout(function() {
					var usedColor = colors.shift();
					colors.push(usedColor);
					var usedWord = words.shift();
					words.push(usedWord);
					x = 1;
					target.setAttribute('style', 'color:' + colors[0])
					letterCount += x;
					waiting = false;
				}, 1000)
			} else if (letterCount === words[0].length + 1 && waiting === false) {
				waiting = true;
				window.setTimeout(function() {
					x = -1;
					letterCount += x;
					waiting = false;
				}, 1000)
			} else if (waiting === false) {
				target.innerHTML = words[0].substring(0, letterCount)
				letterCount += x;
			}
		}, 120);
	}
}

function collage() {
	$('.Collage').css('visibility', 'visible');
	$('#isotope-load').fadeOut();

	setTimeout(function() {
		$('.Collage').collagePlus({
			'targetHeight': 300
		});
	}, 200);
}