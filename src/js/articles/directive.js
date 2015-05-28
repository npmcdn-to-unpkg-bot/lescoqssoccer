angular.module('mean.articles').directive('cmExpandable', ['$http', '$compile',
	function($http, $compile) {
		return {
			restrict: 'E',
			transclude: true,
			link: function($scope, element, attrs) {

				var bodyEl = document.body,
					docElem = window.document.documentElement,
					support = {
						transitions: Modernizr.csstransitions
					},

					// transition end event name
					transEndEventNames = {
						'WebkitTransition': 'webkitTransitionEnd',
						'MozTransition': 'transitionend',
						'OTransition': 'oTransitionEnd',
						'msTransition': 'MSTransitionEnd',
						'transition': 'transitionend'
					},
					transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
					isAnimating = false;

				var isContent = attrs.content;
				var close;

				$http.get(attrs.templateUrl).then(function(response) {
					element.append($compile(response.data)($scope));
				});

				function initEvents() {

					if (!isContent) {

						close = $(element.parent().parent().find(".content").find("[name='"+ attrs.name + "']").children()[1]);

						// grid element click event
						element.on('click', function(ev) {
							ev.preventDefault();

							if (isAnimating) {
								return false;
							}

							isAnimating = true;
							loadContent();
						});

					} else {

						close = element.find(".close-button");

						close.on('click', function() {

							// hide content
							hideContent();
						});
					}

				};

				function loadContent() {

					var contentItemsContainer = element.parent().parent().find('.content');

					// add expanding element/placeholder
					var dummy = document.createElement('div');
					dummy.className = 'placeholder placeholder--trans-in';

					// set the width/heigth and position
					dummy.style.WebkitTransform = 'translate3d(' + (element.offset().left - 5) + 'px, ' + (element.offset().top - 5) + 'px, 0px) scale3d(' + element.outerWidth() / element.parent().outerWidth() + ',' + (element.outerHeight()) / getViewport('y') + ',1)';
					dummy.style.transform = 'translate3d(' + (element.offset().left - 5) + 'px, ' + (element.offset().top - 5) + 'px, 0px) scale3d(' + element.outerWidth() / element.parent().outerWidth() + ',' + (element.outerHeight()) / getViewport('y') + ',1)';

					dummy.style.background = element.css('background');

					// insert it after all the grid items
					element.parent().append(dummy);

					setTimeout(function() {

						// expands the placeholder
						dummy.style.WebkitTransform = 'translate3d(-5px, ' + (scrollY() - 5 - 75) + 'px, 0px)';
						dummy.style.transform = 'translate3d(-5px, ' + (scrollY() - 5 - 75) + 'px, 0px)';

					}, 25);

					onEndTransition(dummy, function() {

						// add transition class
						$(dummy).addClass('placeholder--trans-in');
						$(dummy).addClass('placeholder--trans-out');

						// position the content container
						contentItemsContainer.css('top', scrollY() + 'px');
						contentItemsContainer.addClass('content--show');

						var divEl = contentItemsContainer.find("[name='"+ attrs.name + "']").children()[0];
						$(divEl).addClass('content__item--show');
						close.addClass('close-button--show');

						$("body").css('overflow', 'hidden');

						isAnimating = false;
					});
				}

				function hideContent() {

					var gridItemsContainer = element.parent().parent().parent().find('.grid');
					var gridItem = $(gridItemsContainer.find("[name='"+ attrs.name + "']").children()[0]);

					var contentItemsContainer = element.parent().parent().parent().find('.content');
					var contentItem = $(contentItemsContainer.find("[name='"+ attrs.name + "']").children()[0]);

					//hide article content
					contentItem.removeClass('content__item--show');
					close.removeClass('close-button--show');

					setTimeout(function() {

						var dummy = $('.placeholder');
						dummy.css('WebkitTransform', 'translate3d(' + gridItem.offset().left + 'px, ' + (gridItem.offset().top) + 'px, 0px) scale3d(' + gridItem.outerWidth() / $(gridItemsContainer).width() + ',' + (gridItem.outerHeight() - 40) / getViewport('y') + ',1)');
						dummy.css('transform', 'translate3d(' + gridItem.offset().left + 'px, ' + (gridItem.offset().top) + 'px, 0px) scale3d(' + gridItem.outerWidth() / $(gridItemsContainer).width() + ',' + (gridItem.outerHeight() - 40) / getViewport('y') + ',1)');

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
				};

				function onEndTransition(el, callback) {

					var onEndCallbackFn = function(ev) {
						if (support.transitions) {
							if (ev.target != this) return;
							this.removeEventListener(transEndEventName, onEndCallbackFn);
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

				setTimeout(initEvents, 500);
			}
		}
	}
]);