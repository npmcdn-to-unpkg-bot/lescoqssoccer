angular.module('mean.articles').directive('cmExpandable',
	function() {
		return {
			restrict: 'E',
			transclude: true,
			templateUrl: function(elem, attrs) {
				return attrs.templateUrl;
			},
			link: function($scope, element, attrs) {

				// grid element click event
				element.on('click', function(ev) {
					ev.preventDefault();

					var marginTop = 10;

					var contentItem = $(element.children()[0]);
					var contentItemsContainer = element.parent().parent().parent().parent().parent().find('.content');
					var gridItemsContainer = element.parent().parent().parent().parent().parent().find('.grid');
					var close = $(element.parent().parent().parent().parent().parent().find(".content").find("[name='" + attrs.name + "']").find('.close-button'));

					// add expanding element/placeholder
					var dummy = document.createElement('div');
					dummy.className = (contentItem.hasClass('agendaItem'))? 'placeholder placeholder--trans-in agendaItem' : 'placeholder placeholder--trans-in';

					// set the width/heigth and position
					dummy.style.WebkitTransform = 'translate3d(' + (contentItem.position().left) + 'px, ' + (contentItem.position().top ) + 'px, 0px) scale3d(' + (contentItem.outerWidth()) / contentItemsContainer.outerWidth() + ',' + (contentItem.outerHeight()) / getViewport('y') + ',1)';
					dummy.style.transform = 'translate3d(' + (contentItem.position().left) + 'px, ' + (contentItem.position().top) + 'px, 0px) scale3d(' + (contentItem.outerWidth()) / contentItemsContainer.outerWidth() + ',' + (contentItem.outerHeight()) / getViewport('y') + ',1)';

					// insert it after all the grid items
					element.parent().append(dummy);

					setTimeout(function() {

						// expands the placeholder
						dummy.style.WebkitTransform = 'translate3d(-25px, ' + (scrollY() - marginTop) + 'px, 0px)';
						dummy.style.transform = 'translate3d(-25px, ' + (scrollY() - marginTop) + 'px, 0px)';

					}, 25);

					onEndTransition(dummy, function() {

						// add transition class
						$(dummy).addClass('placeholder--trans-in');
						$(dummy).addClass('placeholder--trans-out');

						// position the content container
						contentItemsContainer.css('top', (scrollY() - marginTop) + 'px');
						contentItemsContainer.addClass('content--show');

						$(contentItemsContainer.find("[name='" + attrs.name + "']").children()[0]).addClass('content__item--show').css('visibility', 'visible');
						close.addClass('close-button--show');

						$("#search").css('visibility', 'hidden');
						$(gridItemsContainer).css('display', 'none');
						$("body").css('overflow', 'hidden');
					});
				});
			}
		}
	}
);

angular.module('mean.articles').directive('cmReduce',
	function() {
		return {
			restrict: 'E',
			transclude: true,
			templateUrl: function(elem, attrs) {
				return attrs.templateUrl;
			},
			link: function($scope, element, attrs) {

				var close = element.find(".close-button");
				close.on('click', function(ev) {
					ev.preventDefault();

					var gridItemsContainer = element.parent().parent().parent().find('.grid');
					var gridItem = $(gridItemsContainer.find("[name='" + attrs.name + "']").children()[0]);

					var contentItemsContainer = element.parent().parent().parent().find('.content');
					var contentItem = $(contentItemsContainer.find("[name='" + attrs.name + "']").children()[0]);

					$(gridItemsContainer).css('display', 'flex');
					$("#search").css('visibility', 'visible');

					//hide article content
					contentItem.removeClass('content__item--show').css('visibility', 'hidden');
					close.removeClass('close-button--show');

					setTimeout(function() {

						var dummy = $('.placeholder');
						var negativeOuterWidth = 15;

						dummy.css('WebkitTransform', 'translate3d(' + (gridItem.position().left) + 'px, ' + (gridItem.position().top) + 'px, 0px) scale3d(' + (gridItem.outerWidth() - negativeOuterWidth) / $(gridItemsContainer).width() + ',' + (gridItem.outerHeight()) / getViewport('y') + ',1)');
						dummy.css('transform', 'translate3d(' + (gridItem.position().left) + 'px, ' + (gridItem.position().top) + 'px, 0px) scale3d(' + (gridItem.outerWidth() - negativeOuterWidth) / $(gridItemsContainer).width() + ',' + (gridItem.outerHeight()) / getViewport('y') + ',1)');

						onEndTransition(dummy, function() {

							// reset content scroll..
							gridItem.css('scrollTop', 0);
							dummy.remove();
							gridItem.removeClass('grid__item--loading grid__item--animate');

							//hide section content
							element.parent().parent().removeClass('content--show');

							$("body").css('overflow', '');
						});

					}, 25);

				});

			}
		}
	}
);

var docElem = window.document.documentElement,
	support = {
		transitions: Modernizr.csstransitions
	},
	transEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'msTransition': 'MSTransitionEnd',
		'transition': 'transitionend'
	},
	transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];

function onEndTransition(el, callback) {

	var onEndCallbackFn = function(ev) {
		if (support.transitions) {
			if (ev.target != this) return;
			$(this).unbind(transEndEventName);
		}
		if (callback && typeof callback === 'function') {
			callback.call(this);
		}
	};

	if (support.transitions) {
		$(el).on(transEndEventName, onEndCallbackFn);
	} else {
		onEndCallbackFn();
	}
};

/**
 * gets the viewport width and height
 * based on http://responsejs.com/labs/dimensions/
 */
function getViewport(axis) {
	var client, inner;
	if (axis === 'x') {
		client = docElem['clientWidth'];
		inner = window['innerWidth'];
	} else if (axis === 'y') {
		client = docElem['clientHeight'];
		inner = window['innerHeight'];
	}
	return client < inner ? inner : client;
}

function scrollX() {
	return window.pageXOffset || docElem.scrollLeft;
}

function scrollY() {
	return window.pageYOffset || docElem.scrollTop;
}
