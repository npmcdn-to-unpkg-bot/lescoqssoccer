angular.module('mean.system').directive('cmSidebar', function() {
	return {
		restrict: 'E',
		transclude: true,
		controller: 'SidebarController',
		templateUrl: "js/appStructure/sidebar.html",
		replace: true,
		link: function($scope, element, attrs) {

			var _win = jQuery(window),
				_sidebar_bar = jQuery('#sidebar'),
				_win_height = _win.height();

			setTimeout(function() {

				//** Site Loading
				var _site_loading = jQuery('.site-loading');

				if (_site_loading.length) {

					jQuery("html, body").css({
						height: _win_height
					});

					jQuery('#wrap').imagesLoaded(setTimeout(function() {

						_site_loading.addClass('visible');

						jQuery('.sidebar-main,#sidebar-widget,#content_wrap').animate({
							opacity: 1
						}, 100);

						jQuery("html, body").css({
							height: "auto"
						});

					}, 1500));

				}
			});

			//** call Lightbox
			if (jQuery('.lightbox').length) {
				jQuery('.lightbox').attr("data-lightbox", "image-1");
			}

			//** init isotope
			var ux_ts = new ThemeIsotope;
			ux_ts.init();

			//** Mp3 Player
			var player_wrap = jQuery("#jquery_jplayer");
			var audio_format_post = jQuery('.audio-format-post .audiobutton');

			if (audio_format_post.length) {
				player_wrap.jPlayer({
					ready: function() {
						jQuery(this).jPlayer("setMedia", {
							mp3: ""
						});
					},
					swfPath: JS_PATH,
					supplied: "mp3",
					wmode: "window"
				});

				audio_format_post.each(function() {
					var _this = jQuery(this);
					var _this_id = _this.attr("id");

					_this.click(function() {
						player_wrap.jPlayer("stop");
						if (_this.is('.pause')) {
							jQuery('.audiobutton').removeClass('play').addClass('pause');
							_this.removeClass('pause').addClass('play');
							player_wrap.jPlayer("setMedia", {
								mp3: _this.attr("rel")
							});
							player_wrap.jPlayer("play");
							player_wrap.bind(jQuery.jPlayer.event.ended, function(event) {
								jQuery('#' + _id).removeClass('play');
								jQuery('#' + _id).addClass('pause');
							});

						} else if (_this.is('.play')) {
							_this.removeClass('play').addClass('pause');
							player_wrap.jPlayer("stop");
						}
					});
				});
			}

			// Responsive condition
			var _responsive = (jQuery('.responsive-ux').length);

			// Set min height for content area
			if (jQuery('#content_wrap').length) {
				jQuery('#content_wrap').parent('.row-fluid').css('min-height', _win_height);
				jQuery('#content_wrap').parent('#content').css('min-height', _win_height);
			}

			// Float bar set width
			if (jQuery("#float-bar-triggler").length) {

				jQuery("#float-bar-triggler").click(function(e) {

					if (Modernizr.touch) {

						if (jQuery(this).parent('#float-bar').hasClass('float-hover')) {

							jQuery(this).parent('#float-bar').removeClass('float-hover');
							jQuery('html,body').animate({
								scrollTop: 0
							}, 500);

						} else {
							jQuery(this).parent('#float-bar').addClass('float-hover');
						}

					} else {
						jQuery('html,body').animate({
							scrollTop: 0
						}, 500);
					}

					return false;

				});
			}

			// Theme: Responsive Mobile Menu
			function ux_responsive_menu() {

				var header = jQuery('#header');

				if (!header.length) return;

				var
					menu = _sidebar_bar.find('#navi ul.menu'),
					first_level_items = menu.find('>li').length;

				var switchWidth = 770;

				var
					container = jQuery('#wrap'),
					show_menu = jQuery('<a id="advanced_menu_toggle" href="#"><i class="icon-m-menu"></i></a>'),
					//hide_menu          = jQuery('<a id="advanced_menu_hide" href="#"><i class="m-close-circle"></i></a>'),
					show_meta = jQuery('<a id="advanced_menu_toggle2" href="#"><i class="icon-m-grid"></i></a>'),
					mobile_advanced = menu.clone().attr({
						id: "mobile-advanced",
						"class": ""
					}),
					mobile_meta_advanced = jQuery('#mobile-header-meta'),
					menu_added = false,
					meta_added = false,
					body_wrap = jQuery('body');


				show_menu.click(function() {

					if (body_wrap.is('.show_mobile_menu')) {
						body_wrap.removeClass('show_mobile_menu');
						body_wrap.removeClass('show_mobile_meta');
						body_wrap.css({
							'height': 'auto'
						});

					} else {
						body_wrap.addClass('show_mobile_menu');
						body_wrap.removeClass('show_mobile_meta');
						set_height();
					}

					return false;

				});

				show_meta.click(function() {

					if (body_wrap.is('.show_mobile_meta')) {
						body_wrap.removeClass('show_mobile_meta');
						body_wrap.removeClass('show_mobile_menu');
						body_wrap.css({
							'height': "auto"
						});

					} else {
						body_wrap.addClass('show_mobile_meta');
						body_wrap.removeClass('show_mobile_menu');
						set_height_meta();
					}

					return false;

				});

				var set_visibility = function() {

						if (_win.width() > switchWidth) {

							body_wrap.removeClass('show_mobile_menu');
							body_wrap.removeClass('show_mobile_meta');
							header.removeClass('mobile_active');
							jQuery('body').css({
								'height': "auto"
							});

							//HALF PAGE layout (feature image template)
							if (jQuery('#page-feaured-image-layout').length) {
								jQuery('#featured-img-wrap, #page-feaured-image-entry').css('height', _win_height);
							}

						} else {

							header.addClass('mobile_active');
							jQuery('body').css({
								'height': "auto"
							});

							if (!menu_added) {
								show_menu.appendTo(header);
								mobile_advanced.prependTo(body_wrap);
								menu_added = true;
							}

							if (!meta_added) {
								show_meta.appendTo(header);
								meta_added = true;
							}

							if (body_wrap.is('.show_mobile_menu')) {
								set_height();
							}

							if (body_wrap.is('.show_mobile_meta')) {
								set_height_meta();
							}

							//HALF PAGE layout (feature image template)
							if (jQuery('#page-feaured-image-layout').length) {
								jQuery('#featured-img-wrap, #page-feaured-image-entry').css('height', 'auto');
							}
						}
					},

					set_height = function() {
						var height = mobile_advanced.css({
								position: 'relative'
							}).outerHeight(true),
							win_h = _win_height;

						if (height < win_h) height = win_h;
						mobile_advanced.css({
							position: 'absolute'
						});
						body_wrap.css({
							'height': height,
							'overflow-y': 'hidden',
							'top': '0'
						});
					},

					set_height_meta = function() {
						var height = mobile_meta_advanced.css({
								position: 'relative'
							}).outerHeight(true),
							win_h = _win_height;

						if (height < win_h) height = win_h;
						mobile_meta_advanced.css({
							position: 'absolute'
						});
						jQuery('body').css({
							'height': height,
							'overflow-y': 'hidden',
							'top': '0'
						});
					}; /**/

				_win.on("debouncedresize", set_visibility);
				set_visibility();

			}

			if (_responsive == true) {
				ux_responsive_menu();
			}

			// For Touch Devices
			if (Modernizr.touch) {

				if (_sidebar_bar.hasClass('sidebar_hide')) {

					jQuery('#hot-close-sidebar-touch').click(function(e) {
						if (_sidebar_bar.hasClass('sidebar-hover')) {
							_sidebar_bar.removeClass('sidebar-hover');
						}
						e.preventDefault();
					});

					jQuery('#sidebar-trigger').on({
						'touchstart click': function() {
							if (!_sidebar_bar.hasClass('sidebar-hover')) {
								_sidebar_bar.addClass('sidebar-hover');
							}
							return false;
						}
					});
				}

				jQuery('#navi li:has(ul)').doubleTapToGo();
			}

			//Sidebar position when logined
			if (jQuery('#wpadminbar').length && jQuery('#wpadminbar').is(":visible")) {
				jQuery('#sidebar').css('top', '30px');
				jQuery('.filter-floating-fixed').css('top', '50px');
			}

			//Set transform-origin
			function main_transform_origin() {

				var origin_value = function() {

					var
						st = _win.scrollTop(),
						pageHeight = jQuery('#main').height(),
						orgin_y = '400px',
						win_Height = _win_height;

					if (st < win_Height) {
						orgin_y = win_Height / 1.2;
					} else {
						orgin_y = pageHeight - (win_Height / 1.2);
					}

					jQuery('#main').css('transform-origin', '50% ' + orgin_y + 'px');

				};
				_win.scroll(origin_value);

				origin_value();
			};

			if (_win.width() > 768 && !Modernizr.touch) {
				main_transform_origin();
			}

		}
	}
});

angular.module('mean.system').directive('cmPageBuilder', function() {
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

					$("#nav-container").mCustomScrollbar({
						scrollInertia: 400,
						autoHideScrollbar: true,
						theme: "dark",
						advanced: {
							updateOnContentResize: true
						}
					});

					$("#main-wrap").mCustomScrollbar({
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

				if ($('#chat').length > 0) {

					var chat = $('#chat'),
						chatMessage = $('#chatMessage'),
						body = $('body');

					$('#chatMessages').on('click', function() {
						// Right Sidebar (Toggle Right Button) (Mobile)
						if ($(".sidebar-right-open").length > 0 && $('.sidebar-right-open').attr('id') != 'chat') {
							// other right sidebar is open keep overlay
							$('body').addClass('sidebar-push-toleft');
						} else {
							body.toggleClass('sidebar-push-toleft');
						}

						closeSidebar('sidebar-right');
						chat.toggleClass('sidebar-right-open');
					});

					// open message sidebar
					$('#chat ul li').on('click', function() {
						chatMessage.toggleClass('sidebar-right-open');
						$('.nicescroll').css('position', 'relative');
					});

					$('#chatMessage [data-toggle="close"]').on('click', function() {
						// remove all push-to classes from body
						chatMessage.toggleClass('sidebar-right-open');
						$('.nicescroll').css('position', 'initial');
					});

					$('.nicescroll').css('position', 'initial');
				}
			});
		}
	}
});

angular.module('mean.system').directive('cmHeader', function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: "js/appStructure/header.html"
	}
});

angular.module('mean.system').directive('cmMobileMenu', function() {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		templateUrl: "js/appStructure/mobileMenu.html"
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
			scope.contentUrl = 'js/articles/views/tiles/' + attrs.type + '.html';
			attrs.$observe("type", function(postType) {
				scope.contentUrl = 'js/articles/views/tiles/' + postType + '.html';
			});
		},
		template: '<div ng-include="contentUrl"></div>'
	}
});