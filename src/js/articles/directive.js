angular.module('mean.articles').directive('wViewarticle', function () {

	return {
		restrict: 'E',
		templateUrl: 'js/articles/views/view.html'
	}
});

angular.module('mean.articles').directive('wCreatearticle', function () {

	return {
		restrict: 'E',
		templateUrl: 'js/articles/views/create.html'
	}
});

angular.module('mean.articles').directive('wEditarticle', function () {

	return {
		restrict: 'E',
		templateUrl: 'js/articles/views/edit.html'
	}
});

angular.module('mean.articles').directive('cmExpandable', function () {

	return {
		restrict: 'E',
		transclude: true,
	    // scope: {
	    //   'close': '&onClose'
	    // },
	    templateUrl: function(elem,attrs) {
           return attrs.templateUrl || 'js/articles/views/view.html'
       	},
	    link: function(scope, element, attr) {

	      	var bodyEl = document.body,

				docElem = window.document.documentElement,
				support = { transitions: Modernizr.csstransitions },

				// transition end event name
				transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
				transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
				onEndTransition = function( el, callback ) {
					var onEndCallbackFn = function( ev ) {
						if( support.transitions ) {
							if( ev.target != this ) return;
							this.removeEventListener( transEndEventName, onEndCallbackFn );
						}
						if( callback && typeof callback === 'function' ) { callback.call(this); }
					};
					if( support.transitions ) {
						$(el).on( transEndEventName, onEndCallbackFn );
					}
					else {
						onEndCallbackFn();
					}
				},
				gridItemsContainer = $('section.grid'),
				contentItemsContainer = $('section.content'),
				gridItems = $('.grid__item'),
				contentItems = $('.content__item'),
				closeCtrl = $('.close-button'),
				current = -1,
				isAnimating = false;

			/**
			 * gets the viewport width and height
			 * based on http://responsejs.com/labs/dimensions/
			 */
			function getViewport( axis ) {
				var client, inner;
				if( axis === 'x' ) {
					client = docElem['clientWidth'];
					inner = window['innerWidth'];
				}
				else if( axis === 'y' ) {
					client = docElem['clientHeight'];
					inner = window['innerHeight'];
				}

				return client < inner ? inner : client;
			}

			function scrollX() { return window.pageXOffset || docElem.scrollLeft; }
			function scrollY() { return window.pageYOffset || docElem.scrollTop; }

			function initEvents() {
				[].slice.call(gridItems).forEach(function(item, pos) {

					// grid item click event
					$(item).on('click', function(ev) {

						ev.preventDefault();
						if(isAnimating || current === pos) {
							return false;
						}
						isAnimating = true;
						// index of current item
						current = pos;

						loadContent(item);
					});
				});

				closeCtrl.on('click', function() {

					// hide content
					hideContent();

				});
			}

			function loadContent(item) {

				// add expanding element/placeholder
				var dummy = document.createElement('div');
				dummy.className = 'placeholder placeholder--trans-in';

				// set the width/heigth and position
				dummy.style.WebkitTransform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth/gridItemsContainer.width() + ',' + item.offsetHeight/getViewport('y') + ',1)';
				dummy.style.transform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth/gridItemsContainer.width() + ',' + item.offsetHeight/getViewport('y') + ',1)';

				// insert it after all the grid items
				gridItemsContainer.append(dummy);

				setTimeout(function() {

					// expands the placeholder
					dummy.style.WebkitTransform = 'translate3d(-5px, ' + (scrollY() - 5) + 'px, 0px)';
					dummy.style.transform = 'translate3d(-5px, ' + (scrollY() - 5) + 'px, 0px)';

				}, 25);

				onEndTransition(dummy, function() {

					// add transition class
					$(dummy).addClass('placeholder--trans-in');
					$(dummy).addClass('placeholder--trans-out');

					// position the content container
					contentItemsContainer.css('top', scrollY() + 'px');

					contentItemsContainer.addClass('content--show');

					$(contentItems[current]).addClass('content__item--show');

					closeCtrl.addClass('close-button--show');

					$(bodyEl).addClass('noscroll');

					isAnimating = false;
				});
			}

			function hideContent() {
				var gridItem = gridItems[current], contentItem = contentItems[current];

				$(contentItem).removeClass('content__item--show');
				contentItemsContainer.removeClass('content--show');
				closeCtrl.removeClass('close-button--show');
				$(bodyEl).removeClass('view-single');

				setTimeout(function() {

					var dummy = $('.placeholder');

					$(bodyEl).removeClass('noscroll');

					dummy.css('WebkitTransform','translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth/gridItemsContainer.width() + ',' + gridItem.offsetHeight/getViewport('y') + ',1)');
					dummy.css('transform', 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth/gridItemsContainer.width() + ',' + gridItem.offsetHeight/getViewport('y') + ',1)');

					onEndTransition(dummy, function() {

						// reset content scroll..
						$(contentItem).css('scrollTop', 0);
						// gridItemsContainer.remove(dummy);
						gridItem.removeClass('grid__item--loading');
						gridItem.removeClass('grid__item--animate');

					});

					// reset current
					current = -1;

				}, 25);
			}

			initEvents();
	    }
	}
});