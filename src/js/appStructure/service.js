
angular.module('mean.system').service('SubMenu',
	function() {

		var subMenu = {

			menu: {},

			setMenu: function(menu){
				subMenu.menu = menu;
			}
		};

		return subMenu;

	}
);

angular.module('mean.system').service('TopMenu',
	function() {

		var STATE_CLOSED = 0,
			STATE_DETACHED = 1,
			STATE_OPENED = 2,

			TAG_HEIGHT = 30,
			TAG_WIDTH = 75,
			MAX_STRAIN = 40,

			// Factor of page height that needs to be dragged for the
			// curtain to fall
			DRAG_THRESHOLD = 0.36;

		VENDORS = ['Webkit', 'Moz', 'O', 'ms'];

		var dom = {
				ribbon: null,
				ribbonString: null,
				ribbonTag: null,
				curtain: null,
				closeButton: null
			},

			// The current state of the ribbon
			state = STATE_CLOSED,

			// Ribbon text, correlates to states
			closedText = '',
			detachedText = '',

			friction = 1.04,
			gravity = 1.5,

			// Resting position of the ribbon when curtain is closed
			closedX = TAG_WIDTH * 0.4,
			closedY = -TAG_HEIGHT * 0.5,

			// Resting position of the ribbon when curtain is opened
			openedX = TAG_WIDTH * 0.4,
			openedY = TAG_HEIGHT,

			velocity = 0,
			rotation = 45,

			curtainTargetY = 0,
			curtainCurrentY = 0,

			dragging = false,
			dragTime = 0,
			dragY = 0,

			anchorA = new Point(closedX, closedY),
			anchorB = new Point(closedX, closedY),

			mouse = new Point();

		window.requestAnimFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
		})();

		var forkit = {

			initialize: function() {

				dom.ribbon = document.querySelector('.forkit');
				dom.curtain = document.querySelector('.forkit-curtain');
				dom.closeButton = document.querySelector('.forkit-curtain .close-button');
				dom.tooltip = document.querySelector('.homeTooltip');

				if (dom.ribbon) {

					// Fetch label texts from DOM
					closedText = dom.ribbon.getAttribute('data-text') || '';
					detachedText = dom.ribbon.getAttribute('data-text-detached') || closedText;

					// Construct the sub-elements required to represent the
					// tag and string that it hangs from
					dom.ribbon.innerHTML = '<span class="string"></span><span class="tag">' + closedText + '</span>';
					dom.ribbonString = dom.ribbon.querySelector('.string');
					dom.ribbonTag = dom.ribbon.querySelector('.tag');

					// Bind events
					dom.tooltip.addEventListener('click', this.onRibbonClick, false);
					document.addEventListener('mousemove', this.onMouseMove, false);
					document.addEventListener('mousedown', this.onMouseDown, false);
					document.addEventListener('mouseup', this.onMouseUp, false);
					document.addEventListener('touchstart', this.onTouchStart, false);
					document.addEventListener('touchmove', this.onTouchMove, false);
					document.addEventListener('touchend', this.onTouchEnd, false);
					window.addEventListener('resize', this.layout, false);

					if (dom.closeButton) {
						dom.closeButton.addEventListener('click', this.onCloseClick, false);
					}

					// Start the animation loop
					this.animate();

				}

			},

			onMouseDown: function(event) {
				if (dom.curtain && state === STATE_DETACHED) {
					event.preventDefault();
					dragY = event.clientY;
					dragTime = Date.now();
					dragging = true;

				}
			},

			onMouseMove: function(event) {
				mouse.x = event.clientX;
				mouse.y = event.clientY;
			},

			onMouseUp: function(event) {
				if (state !== STATE_OPENED) {
					state = STATE_CLOSED;
					dragging = false;
				}
			},

			onTouchStart: function(event) {
				if (dom.curtain && state === STATE_DETACHED) {
					event.preventDefault();
					var touch = event.touches[0];
					dragY = touch.clientY;
					dragTime = Date.now();
					dragging = true;
				}
			},

			onTouchMove: function(event) {
				var touch = event.touches[0];
				mouse.x = touch.pageX;
				mouse.y = touch.pageY;
			},

			onTouchEnd: function(event) {
				if (state !== STATE_OPENED) {
					state = STATE_CLOSED;
					dragging = false;
				}
			},

			onRibbonClick: function(event) {
				if (dom.curtain) {
					event.preventDefault();

					if (state === STATE_OPENED) {
						forkit.close();
					} else if (Date.now() - dragTime < 300) {
						forkit.open();
					}
				}
			},

			onCloseClick: function(event) {
				event.preventDefault();
				forkit.close();
			},

			layout: function() {
				if (state === STATE_OPENED) {
					curtainTargetY = window.innerHeight;
					curtainCurrentY = curtainTargetY;
				}
			},

			open: function() {
				dragging = false;
				state = STATE_OPENED;
				this.dispatchEvent('forkit-open');
			},

			close: function() {
				dragging = false;
				state = STATE_CLOSED;
				dom.ribbonTag.innerHTML = closedText;
				this.dispatchEvent('forkit-close');
			},

			detach: function() {
				state = STATE_DETACHED;
				dom.ribbonTag.innerHTML = detachedText;
			},

			animate: function() {
				forkit.update();
				forkit.render();

				requestAnimFrame(forkit.animate);
			},

			update: function() {
				// Distance between mouse and top right corner
				var distance = this.distanceBetween(mouse.x, mouse.y, 0, 0);

				// If we're OPENED the curtainTargetY should ease towards page bottom
				if (state === STATE_OPENED) {
					curtainTargetY = Math.min(curtainTargetY + (window.innerHeight - curtainTargetY) * 0.2, window.innerHeight);
				} else {

					// Detach the tag when hovering close enough
					if (distance < TAG_WIDTH * 1.5) {
						this.detach();
					}
					// Re-attach the tag if the user moved away
					else if (!dragging && state === STATE_DETACHED && distance > TAG_WIDTH * 2) {
						this.close();
					}

					if (dragging) {
						// Updat the curtain position while dragging
						curtainTargetY = Math.max(mouse.y - dragY, 0);

						// If the threshold is crossed, open the curtain
						if (curtainTargetY > window.innerHeight * DRAG_THRESHOLD) {
							this.open();
						}
					} else {
						curtainTargetY *= 0.8;
					}

				}

				// Ease towards the target position of the curtain
				curtainCurrentY += (curtainTargetY - curtainCurrentY) * 0.3;
			},

			render: function() {

				if (dom.curtain) {
					dom.curtain.style.top = -100 + Math.min((curtainCurrentY / window.innerHeight) * 100, 100) + '%';
				}

				dom.ribbon.style[this.prefix('transform')] = this.transform(0, curtainCurrentY, 0);

				var dy = anchorB.y - anchorA.y,
					dx = anchorB.x - anchorA.x;

				var angle = Math.atan2(dy, dx) * 180 / Math.PI;
				dom.ribbonString.style.width = anchorB.y + 'px';
			},

			prefix: function(property, el) {
				var propertyUC = property.slice(0, 1).toUpperCase() + property.slice(1);

				for (var i = 0, len = VENDORS.length; i < len; i++) {
					var vendor = VENDORS[i];

					if (typeof(el || document.body).style[vendor + propertyUC] !== 'undefined') {
						return vendor + propertyUC;
					}
				}

				return property;
			},

			transform: function(x, y, r) {
				return 'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg)';
			},

			distanceBetween: function(x1, y1, x2, y2) {
				var dx = x1 - x2;
				var dy = y1 - y2;
				return Math.sqrt(dx * dx + dy * dy);
			},

			dispatchEvent: function(type) {
				var event = document.createEvent('HTMLEvents', 1, 2);
				event.initEvent(type, true, true);
				dom.ribbon.dispatchEvent(event);
			}

		};

		return forkit;

	}
);

/**
 * Defines a 2D position.
 */
function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Point.prototype.distanceTo = function(x, y) {
	var dx = x - this.x;
	var dy = y - this.y;
	return Math.sqrt(dx * dx + dy * dy);
};

Point.prototype.clone = function() {
	return new Point(this.x, this.y);
};

Point.prototype.interpolate = function(x, y, amp) {
	this.x += (x - this.x) * amp;
	this.y += (y - this.y) * amp;
};