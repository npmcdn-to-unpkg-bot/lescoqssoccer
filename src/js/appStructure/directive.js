var isAnimated = false;

angular.module('mean.articles').directive('cmSidebar',
	function() {
		return {
			restrict: 'E',
			transclude: true,
			controller: 'SidebarController',
			templateUrl: "js/appStructure/sidebar.html",
			link: function($scope, element, attrs) {

				/* WINDOW RESIZE FUNCTION */
				jQuery(window).resize(function() {
					jQuery("body").find('.page-title').show();
					if (jQuery(window).width() > 480) {
						jQuery('body').find('.leftcontainer').addClass('animated');
					} else {
						jQuery('body').find('.leftcontainer').removeClass('animated');
					}
				});

				/* SIDEBAR ANIMATIONS */
				jQuery('#menu-bar').find('.menu-bar-icon').click(function() {
					"use strict";
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
					"use strict";
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
					"use strict";
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
			}
		}
	}
);