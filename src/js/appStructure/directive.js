'use strict';

angular.module('mean.system').directive('cmSidebar', function() {
	return {
		restrict: 'E',
		transclude: true,
		controller: 'SidebarController',
		templateUrl: "js/appStructure/sidebar.html",
		replace: true,
		link: function($scope, element, attrs) {

			/* SIDEBAR ANIMATIONS */
			jQuery('#menu-bar').find('.menu-bar-icon').click(function() {
				jQuery('body').find('#menu-bar').addClass('menucolor');
				jQuery('body').find('#menu-bg').fadeIn();
				jQuery('body').find('.leftcontainer').show();
				if (jQuery(window).width() > 480) {
					jQuery('body').find('.leftcontainer').removeClass('animated fadeOutLeft');
					jQuery('body').find('.leftcontainer').addClass('animated fadeInLeft');
				} else {
					jQuery('body').find('.leftcontainer').removeClass('animated');
				}
				jQuery(this).fadeOut();
				setTimeout(function() {
					jQuery('#menu-bar').find('.close-icon').fadeIn();
				}, 400);
			});

			jQuery('#menu-bg').click(function() {
				jQuery('body').find('#menu-bar').removeClass('menucolor');
				jQuery('body').find('#menu-bg').fadeOut();
				if (jQuery(window).width() > 480) {
					jQuery('body').find('.leftcontainer').fadeOut();
					jQuery('body').find('.leftcontainer').removeClass('animated fadeInLeft');
					jQuery('body').find('.leftcontainer').addClass('animated fadeOutLeft');
				} else {
					jQuery('body').find('.leftcontainer').hide();
					jQuery('body').find('.leftcontainer').removeClass('animated');
				}
				jQuery('#menu-bar').find('.close-icon').fadeOut();
				setTimeout(function() {
					jQuery('#menu-bar').find('.menu-bar-icon').fadeIn();
				}, 400);
			});

			jQuery('#menu-bar').find('.close-icon').click(function() {
				jQuery('body').find('#menu-bar').removeClass('menucolor');
				jQuery('body').find('#menu-bg').fadeOut();
				if (jQuery(window).width() > 480) {
					jQuery('body').find('.leftcontainer').fadeOut();
					jQuery('body').find('.leftcontainer').removeClass('animated fadeInLeft');
					jQuery('body').find('.leftcontainer').addClass('animated fadeOutLeft');
				} else {
					jQuery('body').find('.leftcontainer').hide();
					jQuery('body').find('.leftcontainer').removeClass('animated');
				}
				jQuery(this).fadeOut();
				setTimeout(function() {
					jQuery('#menu-bar').find('.menu-bar-icon').fadeIn();
				}, 400);
			});

			setTimeout(function() {
				$(".leftcontainer").mCustomScrollbar({
					scrollInertia: 400,
					autoHideScrollbar: true,
					theme: "light",
					advanced: {
						updateOnContentResize: true
					}
				});


			        	consoleText(['Hello World.', 'Console Text', 'Made with Love.'], 'text');
			}, 500);
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