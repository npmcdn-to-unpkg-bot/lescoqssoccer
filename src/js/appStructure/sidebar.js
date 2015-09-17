'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location',

	function($scope, Global, $location) {

		$scope.global = Global;

		$scope.menu = [{
			name: "Accueil",
			link: "#!/home",
			id: 'home'
		}, {
			name: "Blog",
			link: "#!/articles",
			id: 'articles'
		}, {
			name: "Agenda",
			link: "#!/agenda",
			id: 'agenda'
			// children: [{
			// 	name: "Planning",
			// 	link: "#!/agenda",
			// }, {
			// 	name: "Carte",
			// 	link: "#!/agenda/map",
			// }]
		}, {
			name: "Photos",
			link: "#!/albums",
			id: 'albums'
		}, {
			name: "Liens",
			link: "#!/links",
			id: 'links'
		}, {
			name: "Suggestions",
			link: "#!/suggestions",
			id: 'suggestions'
		}, {
			name: "Team",
			link: "#!/team",
			id: 'team'
		}];

		$scope.isCurrentPath = function(item) {

			if (item.children) {
				return false;
			}

			var cur_path = "#!" + $location.path().substr(0, item.link.length + 1);
			return (cur_path.indexOf(item.link) !== -1) || (item.link.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);
		};

		$scope.closeSidebar = function(evt, item) {

			if(item){

				var checkElement = $($("#" + item.id).parent().find('ul')[0]);

				if (item.children && (checkElement.is(':visible'))) {

					evt.preventDefault();
					evt.stopPropagation();

					checkElement.slideUp(300);
					$("#" + item.id).removeClass("has-sub2");
					$("#" + item.id).addClass("has-sub");
					checkElement.removeClass("animated-fast fadeInLeft");
					checkElement.addClass("animated-fast fadeOut");
				}

				if (item.children && (!checkElement.is(':visible'))) {

					evt.preventDefault();
					evt.stopPropagation();

					jQuery('#mainmenu ul ul:visible').slideUp(300);
					checkElement.slideDown(100);
					jQuery('#mainmenu > ul > li:has(ul) > a').removeClass("has-sub2");
					jQuery('#mainmenu > ul > li:has(ul) > a').addClass("has-sub");
					$("#" + item.id).addClass("has-sub2");
					checkElement.removeClass("animated-fast fadeOut");
					checkElement.addClass("animated-fast fadeInLeft");
				}
			}

			if (item && item.children) {
				return false;
			} else {

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

				return true;
			};
		};
	}
]);