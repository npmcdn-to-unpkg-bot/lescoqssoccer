/* CSS3 ANIMATIONS */
jQuery(document).ready(function () {
    "use strict";
    jQuery("body").find('#home-slider').show();
    jQuery("body").find('.slogan').show();
    jQuery(".slogan").find('h1').addClass('animated fadeInDown');
    jQuery(".slogan").find('p').addClass('animated fadeInLeft');
    jQuery(".slogan").find('a').addClass('animated fadeInRight');
    if (jQuery(window).width() > 800) {
        jQuery("body").find('.page-title').show();
        jQuery(".page-title").find('h1').addClass('animated-fast fadeInLeftBig');
        jQuery(".page-title").find('.page-title-box').addClass('animated fadeInLeftBig');
    }
});
/* WINDOW RESIZE FUNCTION */
jQuery(window).resize(function () {
    jQuery("body").find('.page-title').show();
    if (jQuery(window).width() > 480) {
        jQuery('body').find('.leftcontainer').addClass('animated');
    }
    else {
        jQuery('body').find('.leftcontainer').removeClass('animated');
    }
});

/* SIDEBAR ANIMATIONS */
jQuery('#menu-bar').find('.menu-bar-icon').click(function () {
    "use strict";
    jQuery('body').find('#menu-bar').addClass('menucolor');
    jQuery('body').find('#menu-bg').fadeIn();
    jQuery('body').find('.leftcontainer').show();
    if (jQuery(window).width() > 480) {
        jQuery('body').find('.leftcontainer').removeClass('animated fadeOutLeft');
        jQuery('body').find('.leftcontainer').addClass('animated fadeInLeft');
    }
    else {
        jQuery('body').find('.leftcontainer').removeClass('animated');
    }
    jQuery(this).fadeOut();
    setTimeout(function(){
        jQuery('#menu-bar').find('.close-icon').fadeIn();
    }, 400);
});

jQuery('#menu-bg').click(function () {
    "use strict";
    jQuery('body').find('#menu-bar').removeClass('menucolor');
    jQuery('body').find('#menu-bg').fadeOut();
    if (jQuery(window).width() > 480) {
        jQuery('body').find('.leftcontainer').fadeOut();
        jQuery('body').find('.leftcontainer').removeClass('animated fadeInLeft');
        jQuery('body').find('.leftcontainer').addClass('animated fadeOutLeft');
    }
    else {
        jQuery('body').find('.leftcontainer').hide();
        jQuery('body').find('.leftcontainer').removeClass('animated');
    }
    jQuery('#menu-bar').find('.close-icon').fadeOut();
    setTimeout(function(){
        jQuery('#menu-bar').find('.menu-bar-icon').fadeIn();
    }, 400);
});

jQuery('#menu-bar').find('.close-icon').click(function () {
    "use strict";
    jQuery('body').find('#menu-bar').removeClass('menucolor');
    jQuery('body').find('#menu-bg').fadeOut();
    if (jQuery(window).width() > 480) {
        jQuery('body').find('.leftcontainer').fadeOut();
        jQuery('body').find('.leftcontainer').removeClass('animated fadeInLeft');
        jQuery('body').find('.leftcontainer').addClass('animated fadeOutLeft');
    }
    else {
        jQuery('body').find('.leftcontainer').hide();
        jQuery('body').find('.leftcontainer').removeClass('animated');
    }
    jQuery(this).fadeOut();
    setTimeout(function(){
        jQuery('#menu-bar').find('.menu-bar-icon').fadeIn();
    }, 400);
});

/* CUSTOM SCROLLBAR */
if (jQuery(window).width() > 1024) {
(function ($) {
    "use strict";
    jQuery(document).ready(function () {
        $(".leftcontainer").mCustomScrollbar({
            scrollInertia: 1000,
            autoHideScrollbar: true,
            theme: "light",
            advanced: {
                updateOnContentResize: true
            }
        });
    });
})(jQuery);
}
/* GO TO TOP BUTTON */

jQuery(document).ready(function () {
    "use strict";
    jQuery('.back-to-top').click(function (event) {
        event.preventDefault();
        jQuery('html, body').animate({
            scrollTop: 0
        }, 500);
        return false;
    });
});

/* DROPDOWN MENU */
jQuery(document).ready(function () {
    "use strict";
    jQuery('#mainmenu > ul > li:has(ul) > a').addClass("has-sub");
});

jQuery('#mainmenu ul > li > a').click(function () {
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

/* CAROUSEL DRAG FIX */
jQuery('a').on('dragstart', function(event) { 
    "use strict";
    event.preventDefault(); 
});

/* INFO BOXES */
jQuery('body').find('.info-box-close').on("click", function () {
    "use strict";
    jQuery(this).parent().fadeOut();
});

/* COLORBOX */
jQuery(document).ready(function () {
    "use strict";
    jQuery(".clb-photo").colorbox({
        maxWidth: '95%',
        maxHeight: '95%',
        title: function () {
            return jQuery(this).data('title');
        }
    });
    jQuery(".clb-iframe").colorbox({
        iframe: true,
        width: "80%",
        height: "80%",
        title: function () {
            return jQuery(this).data('title');
        }
    });
});