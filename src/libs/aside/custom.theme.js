jQuery(document).ready(function() {

	var  _win    = jQuery(window),
	_sidebar_bar = jQuery('#sidebar'),
	_win_height  = _win.height();

	//** call Lightbox
	if(jQuery('.lightbox').length){
		jQuery('.lightbox').attr("data-lightbox", "image-1");
	}

	// Set min height for content area
	if(jQuery('#content_wrap').length){
		jQuery('#content_wrap').parent('.row-fluid').css('min-height',_win_height);
		jQuery('#content_wrap').parent('#content').css('min-height',_win_height);
	}

	// Float bar set width
	if(jQuery("#float-bar-triggler").length) {

		   jQuery("#float-bar-triggler").click(function(e){

				if(Modernizr.touch){

					if(jQuery(this).parent('#float-bar').hasClass('float-hover')){

						jQuery(this).parent('#float-bar').removeClass('float-hover');
						jQuery('html,body').animate({scrollTop:0},500);

					}else{

						jQuery(this).parent('#float-bar').addClass('float-hover');

					}

				}else{
					jQuery('html,body').animate({scrollTop:0},500);
				}

				return false;

		   });

	}

	//Set transform-origin
	function main_transform_origin(){

		var origin_value  =  function(){

			var
			st         = _win.scrollTop(),
			pageHeight = jQuery('#main').height(),
			orgin_y    = '400px',
			win_Height = _win_height;

			if( st < win_Height ){
				orgin_y = win_Height/1.2;
			}else{
				orgin_y = pageHeight - (win_Height/1.2);
			}

			jQuery('#main').css('transform-origin','50% '+ orgin_y+'px');

		};
		_win.scroll(origin_value);

	    origin_value();
	};

	if( _win.width() > 768 && !Modernizr.touch ) {
		main_transform_origin();
	}
});

function progressbar(){
		jQuery(".progress-wrap").each(function() {
			var me = jQuery(this);
			moveProgressBar(me);
		});
	}

	function infographic(){
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
	}

	function setUserDisplay(){
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
	}

	function consoleText(words, id, colors) {

	     	if (colors === undefined) colors = ['#2196F3'];
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

	function imageLoadAndMore($scope){

		var _page_loading = jQuery('.page-loading');

		//** Page Loading ended
		jQuery('#wrap').imagesLoaded(function() {

			_page_loading.fadeOut(800, function() {

				_page_loading.removeClass('visible');

				var ux_pb = new ThemePageBuilder();
				ux_pb.init();

				setTimeout(function(){

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

					infographic();

					progressbar();

					setUserDisplay();

				}, 500);
			});
		});
	}