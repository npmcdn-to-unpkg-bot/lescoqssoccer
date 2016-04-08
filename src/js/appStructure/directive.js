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
			var openMenuCtrl = document.querySelector('.action--open'),
				closeMenuCtrl = document.querySelector('.action--close');

			if(openMenuCtrl)
				openMenuCtrl.addEventListener('click', openMenu);

			if(closeMenuCtrl)
				closeMenuCtrl.addEventListener('click', closeMenu);

			function openMenu() {
				$(menuEl).addClass('menu--open');
			}

			function closeMenu() {
				$(menuEl).removeClass('menu--open');
			}
		}
	}
});

angular.module('mean.system').directive('cmPageBuilder', ['ConversationService', function(ConversationService) {
	return {
		restrict: 'E',
		transclude: true,
		link: function($scope, element, attrs) {

			function closeSidebar(exceptId) {
				// close all open sidebars
				$(".sidebar:not(#" + exceptId + ")").removeClass(function(index, css) {
					return (css.match(/\S+\b-open/g) || []).join(' ');
				});

			}

			function collage() {
				$('.Collage').collagePlus({
					'targetHeight': 200
				});

				$('.Collage').css('visibility', 'visible');
				$('#isotope-load').fadeOut();
			}

			function moveProgressBar(o) {
				var getPercent = (o.data('progress-percent') / 100);
				var getProgressWrapWidth = o.width();
				var progressTotal = getPercent * getProgressWrapWidth;
				var progressTotalPercent = progressTotal - 30;
				var animationLength = 1500;

				if (o.hasClass('v')) {
					var getPercent = 1 - (o.data('progress-percent') / 100);
					var getProgressWrapWidth = o.height();
					var progressTotal = getPercent * getProgressWrapWidth;
					o.find('.progress-bar').stop().animate({
						top: progressTotal - getProgressWrapWidth
					}, animationLength);

					return false;
				}

				o.waypoint(function() {
					o.find('.progress-bar').stop().animate({
						left: progressTotal
					}, animationLength);
				}, {
					offset: '100%',
					triggerOnce: true
				});
			}

			setTimeout(function() {

				var _win = jQuery(window),
					_sidebar_bar = jQuery('#sidebar'),
					_win_height = _win.height();

				//** Page Loading
				var _page_loading = jQuery('.page-loading');
				if (_page_loading.length) {

					//** page loading event
					function ux_page_loading_event(el) {
						if (el.is('.lightbox')) {} else if (el.is('.liquid_list_image')) {} else {
							var _url = el.attr('href');
							if (_url) {
								jQuery('#sidebar').addClass('sidebar-out');
								_page_loading.fadeIn(300, function() {
									_page_loading.addClass('visible');
									window.location.href = _url;
								});
							}
							return false;
						}
					}

					if (!Modernizr.touch) {

						//** all search form
						jQuery('.submitsearch').parents('form').submit(function() {
							jQuery('#sidebar').addClass('sidebar-out');
							jQuery("html, body").css({
								height: _win_height,
								overflow: "hidden"
							});
							_page_loading.fadeIn(300, function() {
								_page_loading.addClass('visible');
							});
						});

						//** post navi
						jQuery('#post-navi a').click(function() {
							ux_page_loading_event(jQuery(this));
						});

						//** archive unit
						jQuery('.archive-unit a').click(function() {
							ux_page_loading_event(jQuery(this));
						});

						//** main title
						jQuery('#main-title a').click(function() {
							ux_page_loading_event(jQuery(this));
						});

						//** sidebar widget
						jQuery('.widget_archive a, .widget_recent_entries a, .widget_search a, .widget_pages a, .widget_nav_menu a, .widget_tag_cloud a, .widget_calendar a, .widget_text a, .widget_meta a, .widget_categories a, .widget_recent_comments a, .widget_tag_cloud a').click(function() {
							ux_page_loading_event(jQuery(this));
						});

						//** Module
						jQuery('.moudle .iterlock-caption a, .moudle .tab-content a, .moudle .accordion-inner a, .moudle .blog-item a, .moudle .isotope a, .moudle .ux-btn, .moudle .post-carousel-item a, .moudle .caroufredsel_wrapper a').click(function() {
							ux_page_loading_event(jQuery(this));
						});

						//** Porfolio template
						jQuery('.related-post-unit a').click(function() {
							ux_page_loading_event(jQuery(this));
						});

					}

					jQuery("html, body").css({
						height: _win_height
					});

					// $("#nav-container").mCustomScrollbar({
					// 	scrollInertia: 400,
					// 	autoHideScrollbar: true,
					// 	theme: "dark",
					// 	advanced: {
					// 		updateOnContentResize: true
					// 	}
					// });

					$("#sidebar").mCustomScrollbar({
						scrollInertia: 400,
						autoHideScrollbar: true,
						theme: "light",
						advanced: {
							updateOnContentResize: true
						}
					});

					jQuery('#wrap').imagesLoaded(function() {

						_page_loading.fadeOut(1300, function() {
							_page_loading.removeClass('visible');

							var ux_pb = new ThemePageBuilder();
							ux_pb.init();

							if (jQuery('.galleria').length) {

								var _win = jQuery(window);

								// Page fullwidth slider template. Fix height issue in ios7 ipad landscape mode.
								if (jQuery('.page-portfolio-template').length) {
									if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
										jQuery('html').addClass('ipad ios7');
									}
								}

								jQuery('.galleria').each(function() {

									var slider_h = window.innerHeight,
										crop = jQuery(this).data('crop'),
										transition = jQuery(this).data('transition'),
										interval = jQuery(this).data('interval');

									Galleria.run('.galleria', {
										idleMode: true,
										transition: transition, //fade, slide
										responsive: true,
										thumbnails: 'lazy',
										showImagenav: true,
										imageCrop: crop, // fit: false, fill: true
										height: slider_h,
										clicknext: true,
										show: $scope.current || 0,
										preload: 'all',
										trueFullscreen: false
									});

									Galleria.ready(function(options) {
										this.lazyLoadChunks(5);
									});

								});

								var screen_size = _win.width();

								_win.resize(function() {
									var before_resize = screen_size;
									var screen_size = _win.width();
									var width_change = Math.abs(before_resize - screen_size);

									if (width_change > 150) {
										window.setTimeout('location.reload()', 10);
									}

								});

							}

							if (jQuery('.Collage').length) {

								collage();

								var resizeTimer = null;
								$(window).bind('resize', function() {
									// hide all the images until we resize them
									// set the element you are scaling i.e. the first child nodes of ```.Collage``` to opacity 0
									$('.Collage .Image_Wrapper').css("opacity", 0);
									// set a timer to re-apply the plugin
									if (resizeTimer) clearTimeout(resizeTimer);
									resizeTimer = setTimeout(collage, 200);
								});
							}

						});

						jQuery("html, body").css({
							height: "auto"
						});

					});


				} else {

					jQuery('#wrap').imagesLoaded(function() {

						var ux_pb = new ThemePageBuilder();
						ux_pb.init();

						if (jQuery('.galleria').length) {

							var _win = jQuery(window);

							// Page fullwidth slider template. Fix height issue in ios7 ipad landscape mode.
							if (jQuery('.page-portfolio-template').length) {
								if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
									jQuery('html').addClass('ipad ios7');
								}
							}

							jQuery('.galleria').each(function() {

								var slider_h = window.innerHeight,
									crop = jQuery(this).data('crop'),
									transition = jQuery(this).data('transition'),
									interval = jQuery(this).data('interval');

								var galleria = jQuery(this).galleria({
									idleMode: true,
									transition: transition, //fade, slide
									responsive: true,
									thumbnails: true,
									showImagenav: true,
									imageCrop: crop, // fit: false, fill: true
									height: slider_h,
									clicknext: true,
									show: $scope.current || 0,
									preload: 'all'
								});

								Galleria.ready(function(options) {
									this.lazyLoadChunks(5);
								});

							});

							var screen_size = _win.width();

							_win.resize(function() {
								var before_resize = screen_size;
								var screen_size = _win.width();
								var width_change = Math.abs(before_resize - screen_size);

								if (width_change > 150) {
									window.setTimeout('location.reload()', 10);
								}

							});

						}

						if (jQuery('.Collage').length) {

							collage();

							var resizeTimer = null;
							$(window).bind('resize', function() {
								// hide all the images until we resize them
								// set the element you are scaling i.e. the first child nodes of ```.Collage``` to opacity 0
								$('.Collage .Image_Wrapper').css("opacity", 0);
								// set a timer to re-apply the plugin
								if (resizeTimer) clearTimeout(resizeTimer);
								resizeTimer = setTimeout(collage, 200);
							});
						}
					});
				}

				jQuery('.infrographic.pie').each(function(index, element) {
					var _this = jQuery(this);
					var _knob = _this.find('.knob');
					var progress = _knob.attr("data-val");

					_knob.knob();
					_knob.val(0);
					_this.waypoint(function() {
						if (_knob.val() == 0) {
							jQuery({
								value: 0
							}).animate({
								value: progress
							}, {
								duration: 2000,
								easing: 'swing',
								step: function() {
									_knob.val(Math.ceil(this.value)).trigger('change');
								},
								complete: function() {
									_knob.val(progress + '%');
								}
							})
						}
					}, {
						offset: '100%',
						triggerOnce: true
					});

				});

				jQuery(".progress-wrap").each(function() {
					var me = jQuery(this);
					moveProgressBar(me);
				});

				$('.material-card > .mc-btn-action').click(function () {
		            var card = $(this).parent('.material-card');
		            var icon = $(this).children('i');
		            icon.addClass('fa-spin-fast');

		            if (card.hasClass('mc-active')) {
		                card.removeClass('mc-active');

		                window.setTimeout(function() {
		                    icon
		                        .removeClass('fa-arrow-left')
		                        .removeClass('fa-spin-fast')
		                        .addClass('fa-bars');

		                }, 800);
		            } else {
		                card.addClass('mc-active');

		                window.setTimeout(function() {
		                    icon
		                        .removeClass('fa-bars')
		                        .removeClass('fa-spin-fast')
		                        .addClass('fa-arrow-left');

		                }, 800);
		            }
		        });

		        consoleText(['Hello World.', 'Console Text', 'Made with Love.'], 'text',['tomato','rebeccapurple','lightblue']);

		        function consoleText(words, id, colors) {
		         	if (colors === undefined) colors = ['#fff'];
		         	var visible = true;
		         	var con = document.getElementById('console');
		         	var letterCount = 1;
		         	var x = 1;
		         	var waiting = false;
		         	var target = document.getElementById(id);

		         	if(target){
		         		target.setAttribute('style', 'color:' + colors[0])

			         	window.setInterval(function() {

			         		if (letterCount === 0 && waiting === false) {
			         			waiting = true;
			         			target.innerHTML = words[0].substring(0, letterCount)
			         			window.setTimeout(function() {
			         				var usedColor = colors.shift();
			         				colors.push(usedColor);
			         				var usedWord = words.shift();
			         				words.push(usedWord);
			         				x = 1;
			         				target.setAttribute('style', 'color:' + colors[0])
			         				letterCount += x;
			         				waiting = false;
			         			}, 1000)
			         		} else if (letterCount === words[0].length + 1 && waiting === false) {
			         			waiting = true;
			         			window.setTimeout(function() {
			         				x = -1;
			         				letterCount += x;
			         				waiting = false;
			         			}, 1000)
			         		} else if (waiting === false) {
			         			target.innerHTML = words[0].substring(0, letterCount)
			         			letterCount += x;
			         		}
			         	}, 120);
			        }
		        }
			});
		}
	}
}]);

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