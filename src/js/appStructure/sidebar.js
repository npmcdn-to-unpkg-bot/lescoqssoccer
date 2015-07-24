'use strict';

angular.module('mean.system').service('SideMenu',
	function() {

		var sideMenu = {

			menu: {},
			show: true,
			hasSearch: false,

			setMenu: function(menu) {
				sideMenu.menu = menu;
				sideMenu.show = true;
			},

			setSearchInput: function(hasSearch) {
				sideMenu.hasSearch = hasSearch;
			},

			hide: function() {
				sideMenu.show = false;
			}
		};

		return sideMenu;

	}
);

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location', 'SideMenu',

	function($scope, Global, $location, SideMenu) {

		$scope.global = Global;
		$scope.sideMenu = SideMenu;

		$scope.isCurrentPath = function(path) {
			var cur_path = "#!" + $location.path().substr(0, path.length + 1);
			return (cur_path.indexOf(path) !== -1) || (path.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);
		};

		$scope.menu = [{
			name: "Home",
			link: "!#",
			children: [{
				name: "Albums",
				link: "#!/albums",
			},
			{
				name: "Style 2",
				link: "index2.html",
			}]
		},
		{
			name: "About Us",
			link: "about.html"
		},
		{
			name: "Portfolio",
			link: "#!"
		},
		{
			name: "Other Features",
			link: "features.html"
		},
		{
			name: "Blog",
			link: "#!/articles"
		},
		{
			name: "Single Post",
			link: "single-post.html"
		},
		{
			name: "Contact",
			link: "contact.html"
		}];

		$scope.recentPosts = [
			{
				name: "Suspendisse ipsum urna",
				link: "single-post.html"
			},
			{
				name: "Suspendisse ipsum urna",
				link: "single-post.html"
			},
			{
				name: "Suspendisse ipsum urna",
				link: "single-post.html"
			},{
				name: "Suspendisse ipsum urna",
				link: "single-post.html"
			},
			{
				name: "Suspendisse ipsum urna",
				link: "single-post.html"
			},{
				name: "Suspendisse ipsum urna",
				link: "single-post.html"
			}
		];

		$scope.articlesTags = ["Deserani", "Quo eram", "Mentitum amet sit", "Cillum", "Incurreret", "Eram amet aliqua"];

		setTimeout(function() {

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

			jQuery('#mainmenu ul > li > a').click(function() {
				"use strict";
				var checkElement = jQuery(this).next();

				if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
					checkElement.slideUp(300);
					jQuery(this).removeClass("has-sub2");
					jQuery(this).addClass("has-sub");
					checkElement.removeClass("animated-fast fadeInLeft");
					checkElement.addClass("animated-fast fadeOut");
				}

				if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
					jQuery('#mainmenu ul ul:visible').slideUp(300);
					checkElement.slideDown(100);
					jQuery('#mainmenu > ul > li:has(ul) > a').removeClass("has-sub2");
					jQuery('#mainmenu > ul > li:has(ul) > a').addClass("has-sub");
					jQuery(this).addClass("has-sub2");
					checkElement.removeClass("animated-fast fadeOut");
					checkElement.addClass("animated-fast fadeInLeft");
				}

				if (checkElement.is('ul')) {
					return false;
				} else {
					return true;
				}
			});

		}, 500);
	}
]);