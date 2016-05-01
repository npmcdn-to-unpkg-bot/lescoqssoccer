'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location',

	function($scope, Global, $location) {

		$scope.global = Global;

		$scope.menu1 = [{
			name: "Accueil",
			id: "home",
			link: "#!/home",
			icon: "home.jpg"
		},{
			name: "Articles",
			id: "articles",
			link: "#!/articles",
			icon: "articles.jpg"
		}, {
			name: "Rencards",
			link: "#!/agenda",
			id: "agenda",
			icon: "agenda.jpg"
		}, {
			name: "Photos",
			link: "#!/albums",
			id: "albums",
			icon: "articles.jpg"
		}];

		$scope.menu2 = [{
			name: "Copaings",
			link: "#!/users",
			id: "users",
			icon: "articles.jpg"
		},{
			name: "Votes",
			id: "suggestions",
			link: "#!/suggestions",
			icon: "suggestions.jpg"
		},
		{
			name: "Bugs",
			id: "issues",
			link: "#!/issues",
			icon: "buggs.jpg"
		}];

		$scope.isCurrentPath = function(item) {

			var cur_path = "#!" + $location.path().substr(0, item.id.length + 1);
			return (cur_path.indexOf(item.id) !== -1) || (item.id.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);

		};

		$scope.showChildren = function(evt, id) {

			evt.preventDefault();
			evt.stopPropagation();

			$('#' + id + '-childContainer').toggle();
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