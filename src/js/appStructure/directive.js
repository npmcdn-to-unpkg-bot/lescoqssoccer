'use strict';

angular.module('mean.system').directive('cmSidebar',
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
			}
		}
	}
);

angular.module('mean.system').directive('cmPortfolio',
	function() {
		return {
			restrict: 'E',
			transclude: true,
			link: function($scope, element, attrs) {

				jQuery("#filters1").dysaniagrid({
					galleryid: "#gridbox1"
				});

			}
		}
	}
);

angular.module('mean.system').directive('cmColorboxphotos',
	function() {
		return {
			restrict: 'E',
			transclude: true,
			link: function($scope, element, attrs) {
				setTimeout(function() {
					jQuery(".clb-photo").colorbox({
						maxWidth: '95%',
						maxHeight: '95%',
						photo: true
					});
				}, 500);
			}
		}
	}
);

angular.module('mean.system').directive('cmColorboxvideos',
	function() {
		return {
			restrict: 'E',
			transclude: true,
			link: function($scope, element, attrs) {
				setTimeout(function() {
					jQuery(".clb-iframe").colorbox({
						width: '80%',
						height: '80%',
						iframe: true
					});
				}, 500);
			}
		}
	}
);

angular.module('mean.system').directive('cmRotator',
	function() {
		return {
			restrict: 'E',
			transclude: true,
			link: function($scope, element, attrs) {
				jQuery('#cbp-qtrotator').cbpQTRotator({
					speed: 700,
					interval: 7000
				});
			}
		}
	}
);

angular.module('mean.system').directive('cmBackstretch',
	function() {
		return {
			restrict: 'E',
			transclude: true,
			link: function($scope, element, attrs) {
				setTimeout(function() {
					jQuery(".blogimage").each(function() {
						if (jQuery(this).attr('data-image')) {
							jQuery(this).backstretch(jQuery(this).data('image'));
						}
					});
				}, 500);
			}
		}
	}
);