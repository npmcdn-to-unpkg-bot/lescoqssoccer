var catInit = false;

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
			}, 500);

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

				if ($('#world').length && !catInit) {
					catInit = true;
					animateCat();
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
			});

			ConversationService.load();
		}
	}
}]);

function animateCat() {

	//THREEJS RELATED VARIABLES
	var scene,
		camera, fieldOfView, aspectRatio, nearPlane, farPlane,
		gobalLight, shadowLight, backLight,
		renderer,
		container,
		controls;

	//SCREEN & MOUSE VARIABLES

	var HEIGHT, WIDTH, windowHalfX, windowHalfY,
		mousePos = {
			x: 0,
			y: 0
		},
		oldMousePos = {
			x: 0,
			y: 0
		},
		ballWallDepth = 28;

	//3D OBJECTS VARIABLES

	var hero, ball;

	//INIT THREE JS, SCREEN AND MOUSE EVENTS

	function initScreenAnd3D() {

		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;
		windowHalfX = WIDTH / 2;
		windowHalfY = HEIGHT / 2;

		scene = new THREE.Scene();
		aspectRatio = WIDTH / HEIGHT;
		fieldOfView = 50;
		nearPlane = 1;
		farPlane = 2000;
		camera = new THREE.PerspectiveCamera(
			fieldOfView,
			aspectRatio,
			nearPlane,
			farPlane
		);
		camera.position.x = 0;
		camera.position.z = 300;
		camera.position.y = 250;
		camera.lookAt(new THREE.Vector3(0, 60, 0));

		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		});
		renderer.setSize(WIDTH, HEIGHT);
		renderer.shadowMapEnabled = true;

		container = document.getElementById('world');
		container.appendChild(renderer.domElement);

		window.addEventListener('resize', handleWindowResize, false);
		document.addEventListener('mousemove', handleMouseMove, false);
		document.addEventListener('touchmove', handleTouchMove, false);

		/*
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.minPolarAngle = -Math.PI / 2;
		controls.maxPolarAngle = Math.PI / 2;
		controls.noZoom = true;
		controls.noPan = true;
		//*/

	}

	function handleWindowResize() {
		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;
		windowHalfX = WIDTH / 2;
		windowHalfY = HEIGHT / 2;
		renderer.setSize(WIDTH, HEIGHT);
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	}

	function handleMouseMove(event) {
		mousePos = {
			x: event.clientX,
			y: event.clientY
		};
	}

	function handleTouchMove(event) {
		if (event.touches.length == 1) {
			event.preventDefault();
			mousePos = {
				x: event.touches[0].pageX,
				y: event.touches[0].pageY
			};
		}
	}

	function createLights() {
		var globalLight = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)

		shadowLight = new THREE.DirectionalLight(0xffffff, .9);
		shadowLight.position.set(200, 200, 200);
		shadowLight.castShadow = true;
		shadowLight.shadowDarkness = .2;
		shadowLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;

		backLight = new THREE.DirectionalLight(0xffffff, .4);
		backLight.position.set(-100, 100, 100);
		backLight.castShadow = true;
		backLight.shadowDarkness = .1;
		backLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;

		scene.add(globalLight);
		scene.add(shadowLight);
		scene.add(backLight);
	}

	function createFloor() {
		var floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500), new THREE.MeshBasicMaterial({
			color: 0xf0f0f0
		}));
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = 0;
		floor.receiveShadow = true;
		scene.add(floor);
	}

	function createHero() {
		hero = new Cat();
		scene.add(hero.threeGroup);
	}

	function createBall() {
		ball = new Ball();
		scene.add(ball.threeGroup);
	}

	// BALL RELATED CODE

	var woolNodes = 10,
		woolSegLength = 2,
		gravity = -.8,
		accuracy = 1;

	var Ball = function() {

		var redMat = new THREE.MeshLambertMaterial({
			color: 0x630d15,
			shading: THREE.FlatShading
		});

		var stringMat = new THREE.LineBasicMaterial({
			color: 0x630d15,
			linewidth: 3
		});

		this.threeGroup = new THREE.Group();
		this.ballRay = 8;

		this.verts = [];

		// string
		var stringGeom = new THREE.Geometry();

		for (var i = 0; i < woolNodes; i++) {
			var v = new THREE.Vector3(0, -i * woolSegLength, 0);
			stringGeom.vertices.push(v);

			var woolV = new WoolVert();
			woolV.x = woolV.oldx = v.x;
			woolV.y = woolV.oldy = v.y;
			woolV.z = 0;
			woolV.fx = woolV.fy = 0;
			woolV.isRootNode = (i == 0);
			woolV.vertex = v;
			if (i > 0) woolV.attach(this.verts[(i - 1)]);
			this.verts.push(woolV);

		}
		this.string = new THREE.Line(stringGeom, stringMat);

		// body
		var bodyGeom = new THREE.SphereGeometry(this.ballRay, 5, 4);
		this.body = new THREE.Mesh(bodyGeom, redMat);
		this.body.position.y = -woolSegLength * woolNodes;

		var wireGeom = new THREE.TorusGeometry(this.ballRay, .5, 3, 10, Math.PI * 2);
		this.wire1 = new THREE.Mesh(wireGeom, redMat);
		this.wire1.position.x = 1;
		this.wire1.rotation.x = -Math.PI / 4;

		this.wire2 = this.wire1.clone();
		this.wire2.position.y = 1;
		this.wire2.position.x = -1;
		this.wire1.rotation.x = -Math.PI / 4 + .5;
		this.wire1.rotation.y = -Math.PI / 6;

		this.wire3 = this.wire1.clone();
		this.wire3.rotation.x = -Math.PI / 2 + .3;

		this.wire4 = this.wire1.clone();
		this.wire4.position.x = -1;
		this.wire4.rotation.x = -Math.PI / 2 + .7;

		this.wire5 = this.wire1.clone();
		this.wire5.position.x = 2;
		this.wire5.rotation.x = -Math.PI / 2 + 1;

		this.wire6 = this.wire1.clone();
		this.wire6.position.x = 2;
		this.wire6.position.z = 1;
		this.wire6.rotation.x = 1;

		this.wire7 = this.wire1.clone();
		this.wire7.position.x = 1.5;
		this.wire7.rotation.x = 1.1;

		this.wire8 = this.wire1.clone();
		this.wire8.position.x = 1;
		this.wire8.rotation.x = 1.3;

		this.wire9 = this.wire1.clone();
		this.wire9.scale.set(1.2, 1.1, 1.1);
		this.wire9.rotation.z = Math.PI / 2;
		this.wire9.rotation.y = Math.PI / 2;
		this.wire9.position.y = 1;

		this.body.add(this.wire1);
		this.body.add(this.wire2);
		this.body.add(this.wire3);
		this.body.add(this.wire4);
		this.body.add(this.wire5);
		this.body.add(this.wire6);
		this.body.add(this.wire7);
		this.body.add(this.wire8);
		this.body.add(this.wire9);

		this.threeGroup.add(this.string);
		this.threeGroup.add(this.body);

		this.threeGroup.traverse(function(object) {
			if (object instanceof THREE.Mesh) {
				object.castShadow = true;
				object.receiveShadow = true;
			}
		});

	}

	/*
	The next part of the code is largely inspired by this codepen :
	http://codepen.io/dissimulate/pen/KrAwx?editors=001
	thanks to dissimulate for his great work
	*/

	/*
	Copyright (c) 2013 dissimulate at Codepen

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	*/

	var WoolVert = function() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.oldx = 0;
		this.oldy = 0;
		this.fx = 0;
		this.fy = 0;
		this.isRootNode = false;
		this.constraints = [];
		this.vertex = null;
	}

	WoolVert.prototype.update = function() {
		var wind = 0; //.1+Math.random()*.5;
		this.add_force(wind, gravity);

		var nx = this.x + ((this.x - this.oldx) * .9) + this.fx;
		var ny = this.y + ((this.y - this.oldy) * .9) + this.fy;
		this.oldx = this.x;
		this.oldy = this.y;
		this.x = nx;
		this.y = ny;

		this.vertex.x = this.x;
		this.vertex.y = this.y;
		this.vertex.z = this.z;

		this.fy = this.fx = 0
	}

	WoolVert.prototype.attach = function(point) {
		this.constraints.push(new Constraint(this, point));
	};

	WoolVert.prototype.add_force = function(x, y) {
		this.fx += x;
		this.fy += y;
	};

	var Constraint = function(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
		this.length = woolSegLength;
	};

	Ball.prototype.update = function(posX, posY, posZ) {

		var i = accuracy;

		while (i--) {

			var nodesCount = woolNodes;

			while (nodesCount--) {

				var v = this.verts[nodesCount];

				if (v.isRootNode) {
					v.x = posX;
					v.y = posY;
					v.z = posZ;
				} else {

					var constraintsCount = v.constraints.length;

					while (constraintsCount--) {

						var c = v.constraints[constraintsCount];

						var diff_x = c.p1.x - c.p2.x,
							diff_y = c.p1.y - c.p2.y,
							dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y),
							diff = (c.length - dist) / dist;

						var px = diff_x * diff * .5;
						var py = diff_y * diff * .5;

						c.p1.x += px;
						c.p1.y += py;
						c.p2.x -= px;
						c.p2.y -= py;
						c.p1.z = c.p2.z = posZ;
					}

					if (nodesCount == woolNodes - 1) {
						this.body.position.x = this.verts[nodesCount].x;
						this.body.position.y = this.verts[nodesCount].y;
						this.body.position.z = this.verts[nodesCount].z;

						this.body.rotation.z += (v.y <= this.ballRay) ? (v.oldx - v.x) / 10 : Math.min(Math.max(diff_x / 2, -.1), .1);
					}
				}

				if (v.y < this.ballRay) {
					v.y = this.ballRay;
				}
			}
		}

		nodesCount = woolNodes;
		while (nodesCount--) this.verts[nodesCount].update();

		this.string.geometry.verticesNeedUpdate = true;

	}

	Ball.prototype.receivePower = function(tp) {
		this.verts[woolNodes - 1].add_force(tp.x, tp.y);
	}

	// Enf of the code inspired by dissmulate

	// Make everything work together :

	var t = 0;

	function loop() {
		render();

		t += .05;
		hero.updateTail(t);

		var ballPos = getBallPos();
		ball.update(ballPos.x, ballPos.y, ballPos.z);
		ball.receivePower(hero.transferPower);
		hero.interactWithBall(ball.body.position);

		requestAnimationFrame(loop);
	}

	function getBallPos() {
		var vector = new THREE.Vector3();

		vector.set(
			(mousePos.x / window.innerWidth) * 2 - 1, -(mousePos.y / window.innerHeight) * 2 + 1,
			0.1);

		vector.unproject(camera);
		var dir = vector.sub(camera.position).normalize();
		var distance = (ballWallDepth - camera.position.z) / dir.z;
		var pos = camera.position.clone().add(dir.multiplyScalar(distance));
		return pos;
	}

	function render() {
		if (controls) controls.update();
		renderer.render(scene, camera);
	}

	initScreenAnd3D();
	createLights();
	createFloor()
	createHero();
	createBall();
	loop();
}

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