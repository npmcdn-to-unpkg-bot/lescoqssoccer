'use strict';

angular.module('mean.system').directive('cmSidebar', function() {
	return {
		restrict: 'E',
		transclude: true,
		controller: 'SidebarController',
		templateUrl: "js/appStructure/sidebar.html",
		replace: true,
		link: function($scope, element, attrs) {

			var menuEl = document.getElementById('ml-menu'),
			mlmenu = new MLMenu(menuEl, {
				// breadcrumbsCtrl : true, // show breadcrumbs
				initialBreadcrumb : '', // initial breadcrumb text
				backCtrl : false, // show back button
				// itemsDelayInterval : 60, // delay between each menu item sliding animation
				//onItemClick: loadDummyData // callback: item that doesn´t have a submenu gets clicked - onItemClick([event], [inner HTML of the clicked item])
			});

			// mobile menu toggle
			var openMenuCtrl = document.querySelector('.action--open');
			var closeMenuCtrl = document.querySelector('.action--close');

			if(openMenuCtrl){
				openMenuCtrl.addEventListener('click', openMenu);
			}

			if(closeMenuCtrl){
				closeMenuCtrl.addEventListener('click', closeMenu);
			}

			function openMenu() {
				$(menuEl).addClass('menu--open');
			}

			function closeMenu() {
				$(menuEl).removeClass('menu--open');
			}
		}
	}
});

angular.module('mean.system').directive('cmPageBuilder', function() {
	return {
		restrict: 'E',
		transclude: true,
		link: function($scope, element, attrs) {

			var _win = jQuery(window);
			var _win_height = _win.height();

			jQuery("html, body").css({
				min_height: _win_height + "px",
				height: 'auto'
			});

			setTimeout(function(){

				//** Page Loading
				var _page_loading = jQuery('.page-loading');
				if (_page_loading.length) {

					//** page loading event
					function ux_page_loading_event(el) {
						if (el.is('.lightbox')) {} else if (el.is('.liquid_list_image')) {} else {
							_page_loading.fadeIn(300, function() {
								_page_loading.addClass('visible');
							});
							return false;
						}
					}

					if (!Modernizr.touch) {

						//** Module
						jQuery('.moudle .iterlock-caption a, .moudle .tab-content a, .moudle .accordion-inner a, .moudle .blog-item a, .moudle .isotope a, .moudle .ux-btn, .moudle .post-carousel-item a, .moudle .caroufredsel_wrapper a').click(function() {
							ux_page_loading_event(jQuery(this));
						});

						//** Porfolio template
						jQuery('.related-post-unit a').click(function() {
							ux_page_loading_event(jQuery(this));
						});

					}
				}

				imageLoadAndMore($scope);
			});
		}
	}
});

angular.module('mean.system').directive('cmLogin', ['$http', '$location', '$window', 'Global', function($http, $location, $window, Global) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: "js/appStructure/login.html",
		controller: 'LoginController'
	}
}]);

angular.module('mean.system').directive('cmHeader', function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: "js/appStructure/header.html"
	}
});

angular.module('mean.system').directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
});

angular.module('mean.system').directive('cmWysiwyg', function() {
	return {
		restrict: 'E',
		transclude: true,
		link: function($scope, element, attrs) {
			setTimeout(function() {

				var config = {
					paste: {
						// Override default paste behavior, removing all inline styles
						style: 'clean'
					}
				};

				var editor = textboxio.replace('#mytextarea', config);
				editor.content.set($scope.article.content);
			});
		}
	}
});

angular.module('mean.system').directive('cmBlogPost', function() {
	return {
		restrict: 'E',
		replace: true,
		link: function(scope, element, attrs) {
			var format = attrs.format;
			scope.contentUrl = 'js/articles/views/' + format + '/' + attrs.type + '.html';
			attrs.$observe("type", function(postType) {
				scope.contentUrl = 'js/articles/views/tiles/' + postType + '.html';
			});
		},
		template: '<div ng-include="contentUrl"></div>'
	}
});

angular.module('mean.system').directive('cmComments', function() {
	return {
		restrict: 'E',
		templateUrl: "js/appStructure/comments.html",
		scope: {
			updateMethod: "&",
			object: "="
		},
		controller: 'CommentController'
	}
});