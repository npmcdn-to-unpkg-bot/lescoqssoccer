/**
 * Isotope v1.5.25
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time purchase of a commercial license
 * http://isotope.metafizzy.co/docs/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright 2013 Metafizzy
 */
(function(window, $, undefined) {
	'use strict';
	var document = window.document;
	var Modernizr = window.Modernizr;
	var capitalize = function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	};
	var prefixes = 'Moz Webkit O Ms'.split(' ');
	var getStyleProperty = function(propName) {
		var style = document.documentElement.style,
			prefixed;
		if (typeof style[propName] === 'string') {
			return propName
		}
		propName = capitalize(propName);
		for (var i = 0, len = prefixes.length; i < len; i++) {
			prefixed = prefixes[i] + propName;
			if (typeof style[prefixed] === 'string') {
				return prefixed
			}
		}
	};
	var transformProp = getStyleProperty('transform'),
		transitionProp = getStyleProperty('transitionProperty');
	var tests = {
		csstransforms: function() {
			return !!transformProp
		},
		csstransforms3d: function() {
			var test = !!getStyleProperty('perspective');
			if (test) {
				var vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
					mediaQuery = '@media (' + vendorCSSPrefixes.join('transform-3d),(') + 'modernizr)',
					$style = $('<style>' + mediaQuery + '{#modernizr{height:3px}}</style>').appendTo('head'),
					$div = $('<div id="modernizr" />').appendTo('html');
				test = $div.height() === 3;
				$div.remove();
				$style.remove()
			}
			return test
		},
		csstransitions: function() {
			return !!transitionProp
		}
	};
	var testName;
	if (Modernizr) {
		for (testName in tests) {
			if (!Modernizr.hasOwnProperty(testName)) {
				Modernizr.addTest(testName, tests[testName])
			}
		}
	} else {
		Modernizr = window.Modernizr = {
			_version: '1.6ish: miniModernizr for Isotope'
		};
		var classes = ' ';
		var result;
		for (testName in tests) {
			result = tests[testName]();
			Modernizr[testName] = result;
			classes += ' ' + (result ? '' : 'no-') + testName
		}
		$('html').addClass(classes)
	}
	if (Modernizr.csstransforms) {
		var transformFnNotations = Modernizr.csstransforms3d ? {
			translate: function(position) {
				return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0) '
			},
			scale: function(scale) {
				return 'scale3d(' + scale + ', ' + scale + ', 1) '
			}
		} : {
			translate: function(position) {
				return 'translate(' + position[0] + 'px, ' + position[1] + 'px) '
			},
			scale: function(scale) {
				return 'scale(' + scale + ') '
			}
		};
		var setIsoTransform = function(elem, name, value) {
			var data = $.data(elem, 'isoTransform') || {},
				newData = {},
				fnName, transformObj = {},
				transformValue;
			newData[name] = value;
			$.extend(data, newData);
			for (fnName in data) {
				transformValue = data[fnName];
				transformObj[fnName] = transformFnNotations[fnName](transformValue)
			}
			var translateFn = transformObj.translate || '',
				scaleFn = transformObj.scale || '',
				valueFns = translateFn + scaleFn;
			$.data(elem, 'isoTransform', data);
			elem.style[transformProp] = valueFns
		};
		$.cssNumber.scale = true;
		$.cssHooks.scale = {
			set: function(elem, value) {
				setIsoTransform(elem, 'scale', value)
			},
			get: function(elem, computed) {
				var transform = $.data(elem, 'isoTransform');
				return transform && transform.scale ? transform.scale : 1
			}
		};
		$.fx.step.scale = function(fx) {
			$.cssHooks.scale.set(fx.elem, fx.now + fx.unit)
		};
		$.cssNumber.translate = true;
		$.cssHooks.translate = {
			set: function(elem, value) {
				setIsoTransform(elem, 'translate', value)
			},
			get: function(elem, computed) {
				var transform = $.data(elem, 'isoTransform');
				return transform && transform.translate ? transform.translate : [0, 0]
			}
		}
	}
	var transitionEndEvent, transitionDurProp;
	if (Modernizr.csstransitions) {
		transitionEndEvent = {
			WebkitTransitionProperty: 'webkitTransitionEnd',
			MozTransitionProperty: 'transitionend',
			OTransitionProperty: 'oTransitionEnd otransitionend',
			transitionProperty: 'transitionend'
		}[transitionProp];
		transitionDurProp = getStyleProperty('transitionDuration')
	}
	var $event = $.event,
		dispatchMethod = $.event.handle ? 'handle' : 'dispatch',
		resizeTimeout;
	$event.special.smartresize = {
		setup: function() {
			$(this).bind("resize", $event.special.smartresize.handler)
		},
		teardown: function() {
			$(this).unbind("resize", $event.special.smartresize.handler)
		},
		handler: function(event, execAsap) {
			var context = this,
				args = arguments;
			event.type = "smartresize";
			if (resizeTimeout) {
				clearTimeout(resizeTimeout)
			}
			resizeTimeout = setTimeout(function() {
				$event[dispatchMethod].apply(context, args)
			}, execAsap === "execAsap" ? 0 : 100)
		}
	};
	$.fn.smartresize = function(fn) {
		return fn ? this.bind("smartresize", fn) : this.trigger("smartresize", ["execAsap"])
	};
	$.Isotope = function(options, element, callback) {
		this.element = $(element);
		this._create(options);
		this._init(callback)
	};
	var isoContainerStyles = ['width', 'height'];
	var $window = $(window);
	$.Isotope.settings = {
		resizable: true,
		layoutMode: 'masonry',
		containerClass: 'isotope',
		itemClass: 'isotope-item',
		hiddenClass: 'isotope-hidden',
		hiddenStyle: {
			opacity: 0,
			scale: 0.001
		},
		visibleStyle: {
			opacity: 1,
			scale: 1
		},
		containerStyle: {
			position: 'relative',
			overflow: 'hidden'
		},
		animationEngine: 'best-available',
		animationOptions: {
			queue: false,
			duration: 800
		},
		sortBy: 'original-order',
		sortAscending: true,
		resizesContainer: true,
		transformsEnabled: true,
		itemPositionDataEnabled: false
	};
	$.Isotope.prototype = {
		_create: function(options) {
			this.options = $.extend({}, $.Isotope.settings, options);
			this.styleQueue = [];
			this.elemCount = 0;
			var elemStyle = this.element[0].style;
			this.originalStyle = {};
			var containerStyles = isoContainerStyles.slice(0);
			for (var prop in this.options.containerStyle) {
				containerStyles.push(prop)
			}
			for (var i = 0, len = containerStyles.length; i < len; i++) {
				prop = containerStyles[i];
				this.originalStyle[prop] = elemStyle[prop] || ''
			}
			this.element.css(this.options.containerStyle);
			this._updateAnimationEngine();
			this._updateUsingTransforms();
			var originalOrderSorter = {
				'original-order': function($elem, instance) {
					instance.elemCount++;
					return instance.elemCount
				},
				random: function() {
					return Math.random()
				}
			};
			this.options.getSortData = $.extend(this.options.getSortData, originalOrderSorter);
			this.reloadItems();
			this.offset = {
				left: parseInt((this.element.css('padding-left') || 0), 10),
				top: parseInt((this.element.css('padding-top') || 0), 10)
			};
			var instance = this;
			setTimeout(function() {
				instance.element.addClass(instance.options.containerClass)
			}, 0);
			if (this.options.resizable) {
				$window.bind('smartresize.isotope', function() {
					instance.resize()
				})
			}
			this.element.delegate('.' + this.options.hiddenClass, 'click', function() {
				return false
			})
		},
		_getAtoms: function($elems) {
			var selector = this.options.itemSelector,
				$atoms = selector ? $elems.filter(selector).add($elems.find(selector)) : $elems,
				atomStyle = {
					position: 'absolute'
				};
			$atoms = $atoms.filter(function(i, atom) {
				return atom.nodeType === 1
			});
			if (this.usingTransforms) {
				atomStyle.left = 0;
				atomStyle.top = 0
			}
			$atoms.css(atomStyle).addClass(this.options.itemClass);
			this.updateSortData($atoms, true);
			return $atoms
		},
		_init: function(callback) {
			this.$filteredAtoms = this._filter(this.$allAtoms);
			this._sort();
			this.reLayout(callback)
		},
		option: function(opts) {
			if ($.isPlainObject(opts)) {
				this.options = $.extend(true, this.options, opts);
				var updateOptionFn;
				for (var optionName in opts) {
					updateOptionFn = '_update' + capitalize(optionName);
					if (this[updateOptionFn]) {
						this[updateOptionFn]()
					}
				}
			}
		},
		_updateAnimationEngine: function() {
			var animationEngine = this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, '');
			var isUsingJQueryAnimation;
			switch (animationEngine) {
				case 'css':
				case 'none':
					isUsingJQueryAnimation = false;
					break;
				case 'jquery':
					isUsingJQueryAnimation = true;
					break;
				default:
					isUsingJQueryAnimation = !Modernizr.csstransitions
			}
			this.isUsingJQueryAnimation = isUsingJQueryAnimation;
			this._updateUsingTransforms()
		},
		_updateTransformsEnabled: function() {
			this._updateUsingTransforms()
		},
		_updateUsingTransforms: function() {
			var usingTransforms = this.usingTransforms = this.options.transformsEnabled && Modernizr.csstransforms && Modernizr.csstransitions && !this.isUsingJQueryAnimation;
			if (!usingTransforms) {
				delete this.options.hiddenStyle.scale;
				delete this.options.visibleStyle.scale
			}
			this.getPositionStyles = usingTransforms ? this._translate : this._positionAbs
		},
		_filter: function($atoms) {
			var filter = this.options.filter === '' ? '*' : this.options.filter;
			if (!filter) {
				return $atoms
			}
			var hiddenClass = this.options.hiddenClass,
				hiddenSelector = '.' + hiddenClass,
				$hiddenAtoms = $atoms.filter(hiddenSelector),
				$atomsToShow = $hiddenAtoms;
			if (filter !== '*') {
				$atomsToShow = $hiddenAtoms.filter(filter);
				var $atomsToHide = $atoms.not(hiddenSelector).not(filter).addClass(hiddenClass);
				this.styleQueue.push({
					$el: $atomsToHide,
					style: this.options.hiddenStyle
				})
			}
			this.styleQueue.push({
				$el: $atomsToShow,
				style: this.options.visibleStyle
			});
			$atomsToShow.removeClass(hiddenClass);
			return $atoms.filter(filter)
		},
		updateSortData: function($atoms, isIncrementingElemCount) {
			var instance = this,
				getSortData = this.options.getSortData,
				$this, sortData;
			$atoms.each(function() {
				$this = $(this);
				sortData = {};
				for (var key in getSortData) {
					if (!isIncrementingElemCount && key === 'original-order') {
						sortData[key] = $.data(this, 'isotope-sort-data')[key]
					} else {
						sortData[key] = getSortData[key]($this, instance)
					}
				}
				$.data(this, 'isotope-sort-data', sortData)
			})
		},
		_sort: function() {
			var sortBy = this.options.sortBy,
				getSorter = this._getSorter,
				sortDir = this.options.sortAscending ? 1 : -1,
				sortFn = function(alpha, beta) {
					var a = getSorter(alpha, sortBy),
						b = getSorter(beta, sortBy);
					if (a === b && sortBy !== 'original-order') {
						a = getSorter(alpha, 'original-order');
						b = getSorter(beta, 'original-order')
					}
					return ((a > b) ? 1 : (a < b) ? -1 : 0) * sortDir
				};
			this.$filteredAtoms.sort(sortFn)
		},
		_getSorter: function(elem, sortBy) {
			return $.data(elem, 'isotope-sort-data')[sortBy]
		},
		_translate: function(x, y) {
			return {
				translate: [x, y]
			}
		},
		_positionAbs: function(x, y) {
			return {
				left: x,
				top: y
			}
		},
		_pushPosition: function($elem, x, y) {
			x = Math.round(x + this.offset.left);
			y = Math.round(y + this.offset.top);
			var position = this.getPositionStyles(x, y);
			this.styleQueue.push({
				$el: $elem,
				style: position
			});
			if (this.options.itemPositionDataEnabled) {
				$elem.data('isotope-item-position', {
					x: x,
					y: y
				})
			}
		},
		layout: function($elems, callback) {
			var layoutMode = this.options.layoutMode;
			this['_' + layoutMode + 'Layout']($elems);
			if (this.options.resizesContainer) {
				var containerStyle = this['_' + layoutMode + 'GetContainerSize']();
				this.styleQueue.push({
					$el: this.element,
					style: containerStyle
				})
			}
			this._processStyleQueue($elems, callback);
			this.isLaidOut = true
		},
		_processStyleQueue: function($elems, callback) {
			var styleFn = !this.isLaidOut ? 'css' : (this.isUsingJQueryAnimation ? 'animate' : 'css'),
				animOpts = this.options.animationOptions,
				onLayout = this.options.onLayout,
				objStyleFn, processor, triggerCallbackNow, callbackFn;
			processor = function(i, obj) {
				obj.$el[styleFn](obj.style, animOpts)
			};
			if (this._isInserting && this.isUsingJQueryAnimation) {
				processor = function(i, obj) {
					objStyleFn = obj.$el.hasClass('no-transition') ? 'css' : styleFn;
					obj.$el[objStyleFn](obj.style, animOpts)
				}
			} else if (callback || onLayout || animOpts.complete) {
				var isCallbackTriggered = false,
					callbacks = [callback, onLayout, animOpts.complete],
					instance = this;
				triggerCallbackNow = true;
				callbackFn = function() {
					if (isCallbackTriggered) {
						return
					}
					var hollaback;
					for (var i = 0, len = callbacks.length; i < len; i++) {
						hollaback = callbacks[i];
						if (typeof hollaback === 'function') {
							hollaback.call(instance.element, $elems, instance)
						}
					}
					isCallbackTriggered = true
				};
				if (this.isUsingJQueryAnimation && styleFn === 'animate') {
					animOpts.complete = callbackFn;
					triggerCallbackNow = false
				} else if (Modernizr.csstransitions) {
					var i = 0,
						firstItem = this.styleQueue[0],
						testElem = firstItem && firstItem.$el,
						styleObj;
					while (!testElem || !testElem.length) {
						styleObj = this.styleQueue[i++];
						if (!styleObj) {
							return
						}
						testElem = styleObj.$el
					}
					var duration = parseFloat(getComputedStyle(testElem[0])[transitionDurProp]);
					if (duration > 0) {
						processor = function(i, obj) {
							obj.$el[styleFn](obj.style, animOpts).one(transitionEndEvent, callbackFn)
						};
						triggerCallbackNow = false
					}
				}
			}
			$.each(this.styleQueue, processor);
			if (triggerCallbackNow) {
				callbackFn()
			}
			this.styleQueue = []
		},
		resize: function() {
			if (this['_' + this.options.layoutMode + 'ResizeChanged']()) {
				this.reLayout()
			}
		},
		reLayout: function(callback) {
			this['_' + this.options.layoutMode + 'Reset']();
			this.layout(this.$filteredAtoms, callback)
		},
		addItems: function($content, callback) {
			var $newAtoms = this._getAtoms($content);
			this.$allAtoms = this.$allAtoms.add($newAtoms);
			if (callback) {
				callback($newAtoms)
			}
		},
		insert: function($content, callback) {
			this.element.append($content);
			var instance = this;
			this.addItems($content, function($newAtoms) {
				var $newFilteredAtoms = instance._filter($newAtoms);
				instance._addHideAppended($newFilteredAtoms);
				instance._sort();
				instance.reLayout();
				instance._revealAppended($newFilteredAtoms, callback)
			})
		},
		appended: function($content, callback) {
			var instance = this;
			this.addItems($content, function($newAtoms) {
				instance._addHideAppended($newAtoms);
				instance.layout($newAtoms);
				instance._revealAppended($newAtoms, callback)
			})
		},
		_addHideAppended: function($newAtoms) {
			this.$filteredAtoms = this.$filteredAtoms.add($newAtoms);
			$newAtoms.addClass('no-transition');
			this._isInserting = true;
			this.styleQueue.push({
				$el: $newAtoms,
				style: this.options.hiddenStyle
			})
		},
		_revealAppended: function($newAtoms, callback) {
			var instance = this;
			setTimeout(function() {
				$newAtoms.removeClass('no-transition');
				instance.styleQueue.push({
					$el: $newAtoms,
					style: instance.options.visibleStyle
				});
				instance._isInserting = false;
				instance._processStyleQueue($newAtoms, callback)
			}, 10)
		},
		reloadItems: function() {
			this.$allAtoms = this._getAtoms(this.element.children())
		},
		remove: function($content, callback) {
			this.$allAtoms = this.$allAtoms.not($content);
			this.$filteredAtoms = this.$filteredAtoms.not($content);
			var instance = this;
			var removeContent = function() {
				$content.remove();
				if (callback) {
					callback.call(instance.element)
				}
			};
			if ($content.filter(':not(.' + this.options.hiddenClass + ')').length) {
				this.styleQueue.push({
					$el: $content,
					style: this.options.hiddenStyle
				});
				this._sort();
				this.reLayout(removeContent)
			} else {
				removeContent()
			}
		},
		shuffle: function(callback) {
			this.updateSortData(this.$allAtoms);
			this.options.sortBy = 'random';
			this._sort();
			this.reLayout(callback)
		},
		destroy: function() {
			var usingTransforms = this.usingTransforms;
			var options = this.options;
			this.$allAtoms.removeClass(options.hiddenClass + ' ' + options.itemClass).each(function() {
				var style = this.style;
				style.position = '';
				style.top = '';
				style.left = '';
				style.opacity = '';
				if (usingTransforms) {
					style[transformProp] = ''
				}
			});
			var elemStyle = this.element[0].style;
			for (var prop in this.originalStyle) {
				elemStyle[prop] = this.originalStyle[prop]
			}
			this.element.unbind('.isotope').undelegate('.' + options.hiddenClass, 'click').removeClass(options.containerClass).removeData('isotope');
			$window.unbind('.isotope')
		},
		_getSegments: function(isRows) {
			var namespace = this.options.layoutMode,
				measure = isRows ? 'rowHeight' : 'columnWidth',
				size = isRows ? 'height' : 'width',
				segmentsName = isRows ? 'rows' : 'cols',
				containerSize = this.element[size](),
				segments, segmentSize = this.options[namespace] && this.options[namespace][measure] || this.$filteredAtoms['outer' + capitalize(size)](true) || containerSize;
			segments = Math.floor(containerSize / segmentSize);
			segments = Math.max(segments, 1);
			this[namespace][segmentsName] = segments;
			this[namespace][measure] = segmentSize
		},
		_checkIfSegmentsChanged: function(isRows) {
			var namespace = this.options.layoutMode,
				segmentsName = isRows ? 'rows' : 'cols',
				prevSegments = this[namespace][segmentsName];
			this._getSegments(isRows);
			return (this[namespace][segmentsName] !== prevSegments)
		},
		_masonryReset: function() {
			this.masonry = {};
			this._getSegments();
			var i = this.masonry.cols;
			this.masonry.colYs = [];
			while (i--) {
				this.masonry.colYs.push(0)
			}
		},
		_masonryLayout: function($elems) {
			var instance = this,
				props = instance.masonry;
			$elems.each(function() {
				var $this = $(this),
					colSpan = Math.ceil($this.outerWidth(true) / props.columnWidth);
				colSpan = Math.min(colSpan, props.cols);
				if (colSpan === 1) {
					instance._masonryPlaceBrick($this, props.colYs)
				} else {
					var groupCount = props.cols + 1 - colSpan,
						groupY = [],
						groupColY, i;
					for (i = 0; i < groupCount; i++) {
						groupColY = props.colYs.slice(i, i + colSpan);
						groupY[i] = Math.max.apply(Math, groupColY)
					}
					instance._masonryPlaceBrick($this, groupY)
				}
			})
		},
		_masonryPlaceBrick: function($brick, setY) {
			var minimumY = Math.min.apply(Math, setY),
				shortCol = 0;
			for (var i = 0, len = setY.length; i < len; i++) {
				if (setY[i] === minimumY) {
					shortCol = i;
					break
				}
			}
			var x = this.masonry.columnWidth * shortCol,
				y = minimumY;
			this._pushPosition($brick, x, y);
			var setHeight = minimumY + $brick.outerHeight(true),
				setSpan = this.masonry.cols + 1 - len;
			for (i = 0; i < setSpan; i++) {
				this.masonry.colYs[shortCol + i] = setHeight
			}
		},
		_masonryGetContainerSize: function() {
			var containerHeight = Math.max.apply(Math, this.masonry.colYs);
			return {
				height: containerHeight
			}
		},
		_masonryResizeChanged: function() {
			return this._checkIfSegmentsChanged()
		},
		_fitRowsReset: function() {
			this.fitRows = {
				x: 0,
				y: 0,
				height: 0
			}
		},
		_fitRowsLayout: function($elems) {
			var instance = this,
				containerWidth = this.element.width(),
				props = this.fitRows;
			$elems.each(function() {
				var $this = $(this),
					atomW = $this.outerWidth(true),
					atomH = $this.outerHeight(true);
				if (props.x !== 0 && atomW + props.x > containerWidth) {
					props.x = 0;
					props.y = props.height
				}
				instance._pushPosition($this, props.x, props.y);
				props.height = Math.max(props.y + atomH, props.height);
				props.x += atomW
			})
		},
		_fitRowsGetContainerSize: function() {
			return {
				height: this.fitRows.height
			}
		},
		_fitRowsResizeChanged: function() {
			return true
		},
		_cellsByRowReset: function() {
			this.cellsByRow = {
				index: 0
			};
			this._getSegments();
			this._getSegments(true)
		},
		_cellsByRowLayout: function($elems) {
			var instance = this,
				props = this.cellsByRow;
			$elems.each(function() {
				var $this = $(this),
					col = props.index % props.cols,
					row = Math.floor(props.index / props.cols),
					x = (col + 0.5) * props.columnWidth - $this.outerWidth(true) / 2,
					y = (row + 0.5) * props.rowHeight - $this.outerHeight(true) / 2;
				instance._pushPosition($this, x, y);
				props.index++
			})
		},
		_cellsByRowGetContainerSize: function() {
			return {
				height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) * this.cellsByRow.rowHeight + this.offset.top
			}
		},
		_cellsByRowResizeChanged: function() {
			return this._checkIfSegmentsChanged()
		},
		_straightDownReset: function() {
			this.straightDown = {
				y: 0
			}
		},
		_straightDownLayout: function($elems) {
			var instance = this;
			$elems.each(function(i) {
				var $this = $(this);
				instance._pushPosition($this, 0, instance.straightDown.y);
				instance.straightDown.y += $this.outerHeight(true)
			})
		},
		_straightDownGetContainerSize: function() {
			return {
				height: this.straightDown.y
			}
		},
		_straightDownResizeChanged: function() {
			return true
		},
		_masonryHorizontalReset: function() {
			this.masonryHorizontal = {};
			this._getSegments(true);
			var i = this.masonryHorizontal.rows;
			this.masonryHorizontal.rowXs = [];
			while (i--) {
				this.masonryHorizontal.rowXs.push(0)
			}
		},
		_masonryHorizontalLayout: function($elems) {
			var instance = this,
				props = instance.masonryHorizontal;
			$elems.each(function() {
				var $this = $(this),
					rowSpan = Math.ceil($this.outerHeight(true) / props.rowHeight);
				rowSpan = Math.min(rowSpan, props.rows);
				if (rowSpan === 1) {
					instance._masonryHorizontalPlaceBrick($this, props.rowXs)
				} else {
					var groupCount = props.rows + 1 - rowSpan,
						groupX = [],
						groupRowX, i;
					for (i = 0; i < groupCount; i++) {
						groupRowX = props.rowXs.slice(i, i + rowSpan);
						groupX[i] = Math.max.apply(Math, groupRowX)
					}
					instance._masonryHorizontalPlaceBrick($this, groupX)
				}
			})
		},
		_masonryHorizontalPlaceBrick: function($brick, setX) {
			var minimumX = Math.min.apply(Math, setX),
				smallRow = 0;
			for (var i = 0, len = setX.length; i < len; i++) {
				if (setX[i] === minimumX) {
					smallRow = i;
					break
				}
			}
			var x = minimumX,
				y = this.masonryHorizontal.rowHeight * smallRow;
			this._pushPosition($brick, x, y);
			var setWidth = minimumX + $brick.outerWidth(true),
				setSpan = this.masonryHorizontal.rows + 1 - len;
			for (i = 0; i < setSpan; i++) {
				this.masonryHorizontal.rowXs[smallRow + i] = setWidth
			}
		},
		_masonryHorizontalGetContainerSize: function() {
			var containerWidth = Math.max.apply(Math, this.masonryHorizontal.rowXs);
			return {
				width: containerWidth
			}
		},
		_masonryHorizontalResizeChanged: function() {
			return this._checkIfSegmentsChanged(true)
		},
		_fitColumnsReset: function() {
			this.fitColumns = {
				x: 0,
				y: 0,
				width: 0
			}
		},
		_fitColumnsLayout: function($elems) {
			var instance = this,
				containerHeight = this.element.height(),
				props = this.fitColumns;
			$elems.each(function() {
				var $this = $(this),
					atomW = $this.outerWidth(true),
					atomH = $this.outerHeight(true);
				if (props.y !== 0 && atomH + props.y > containerHeight) {
					props.x = props.width;
					props.y = 0
				}
				instance._pushPosition($this, props.x, props.y);
				props.width = Math.max(props.x + atomW, props.width);
				props.y += atomH
			})
		},
		_fitColumnsGetContainerSize: function() {
			return {
				width: this.fitColumns.width
			}
		},
		_fitColumnsResizeChanged: function() {
			return true
		},
		_cellsByColumnReset: function() {
			this.cellsByColumn = {
				index: 0
			};
			this._getSegments();
			this._getSegments(true)
		},
		_cellsByColumnLayout: function($elems) {
			var instance = this,
				props = this.cellsByColumn;
			$elems.each(function() {
				var $this = $(this),
					col = Math.floor(props.index / props.rows),
					row = props.index % props.rows,
					x = (col + 0.5) * props.columnWidth - $this.outerWidth(true) / 2,
					y = (row + 0.5) * props.rowHeight - $this.outerHeight(true) / 2;
				instance._pushPosition($this, x, y);
				props.index++
			})
		},
		_cellsByColumnGetContainerSize: function() {
			return {
				width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) * this.cellsByColumn.columnWidth
			}
		},
		_cellsByColumnResizeChanged: function() {
			return this._checkIfSegmentsChanged(true)
		},
		_straightAcrossReset: function() {
			this.straightAcross = {
				x: 0
			}
		},
		_straightAcrossLayout: function($elems) {
			var instance = this;
			$elems.each(function(i) {
				var $this = $(this);
				instance._pushPosition($this, instance.straightAcross.x, 0);
				instance.straightAcross.x += $this.outerWidth(true)
			})
		},
		_straightAcrossGetContainerSize: function() {
			return {
				width: this.straightAcross.x
			}
		},
		_straightAcrossResizeChanged: function() {
			return true
		}
	};
	$.fn.getOutOfHere = function(callback) {
		var $this = this,
			$images = $this.find('img').add($this.filter('img')),
			len = $images.length,
			blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
			loaded = [];

		function triggerCallback() {
			callback.call($this, $images)
		}

		function imgLoaded(event) {
			var img = event.target;
			if (img.src !== blank && $.inArray(img, loaded) === -1) {
				loaded.push(img);
				if (--len <= 0) {
					setTimeout(triggerCallback);
					$images.unbind('.imagesLoaded', imgLoaded)
				}
			}
		}
		if (!len) {
			triggerCallback()
		}
		$images.bind('load.imagesLoaded error.imagesLoaded', imgLoaded).each(function() {
			var src = this.src;
			this.src = blank;
			this.src = src
		});
		return $this
	};
	var logError = function(message) {
		if (window.console) {
			window.console.error(message)
		}
	};
	$.fn.isotope = function(options, callback) {
		if (typeof options === 'string') {
			var args = Array.prototype.slice.call(arguments, 1);
			this.each(function() {
				var instance = $.data(this, 'isotope');
				if (!instance) {
					logError("cannot call methods on isotope prior to initialization; attempted to call method '" + options + "'");
					return
				}
				if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
					logError("no such method '" + options + "' for isotope instance");
					return
				}
				instance[options].apply(instance, args)
			})
		} else {
			this.each(function() {
				var instance = $.data(this, 'isotope');
				if (instance) {
					instance.option(options);
					instance._init(callback)
				} else {
					$.data(this, 'isotope', new $.Isotope(options, this, callback))
				}
			})
		}
		return this
	}
})(window, jQuery);

/*! modernizr 3.3.1 (Custom Build) | MIT *
 * http://modernizr.com/download/?-cssanimations-cssfilters-inlinesvg-svgfilters-touchevents-prefixed-prefixes-setclasses-shiv-teststyles !
 */
! function(e, t, n) {
	function r(e, t) {
		return typeof e === t
	}

	function o() {
		var e, t, n, o, i, a, s;
		for (var l in C)
			if (C.hasOwnProperty(l)) {
				if (e = [], t = C[l], t.name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
					for (n = 0; n < t.options.aliases.length; n++) e.push(t.options.aliases[n].toLowerCase());
				for (o = r(t.fn, "function") ? t.fn() : t.fn, i = 0; i < e.length; i++) a = e[i], s = a.split("."), 1 === s.length ? Modernizr[s[0]] = o : (!Modernizr[s[0]] || Modernizr[s[0]] instanceof Boolean || (Modernizr[s[0]] = new Boolean(Modernizr[s[0]])), Modernizr[s[0]][s[1]] = o), y.push((o ? "" : "no-") + s.join("-"))
			}
	}

	function i(e) {
		var t = x.className,
			n = Modernizr._config.classPrefix || "";
		if (b && (t = t.baseVal), Modernizr._config.enableJSClass) {
			var r = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
			t = t.replace(r, "$1" + n + "js$2")
		}
		Modernizr._config.enableClasses && (t += " " + n + e.join(" " + n), b ? x.className.baseVal = t : x.className = t)
	}

	function a(e) {
		return e.replace(/([a-z])-([a-z])/g, function(e, t, n) {
			return t + n.toUpperCase()
		}).replace(/^-/, "")
	}

	function s() {
		return "function" != typeof t.createElement ? t.createElement(arguments[0]) : b ? t.createElementNS.call(t, "http://www.w3.org/2000/svg", arguments[0]) : t.createElement.apply(t, arguments)
	}

	function l() {
		var e = t.body;
		return e || (e = s(b ? "svg" : "body"), e.fake = !0), e
	}

	function u(e, n, r, o) {
		var i, a, u, c, f = "modernizr",
			d = s("div"),
			p = l();
		if (parseInt(r, 10))
			for (; r--;) u = s("div"), u.id = o ? o[r] : f + (r + 1), d.appendChild(u);
		return i = s("style"), i.type = "text/css", i.id = "s" + f, (p.fake ? p : d).appendChild(i), p.appendChild(d), i.styleSheet ? i.styleSheet.cssText = e : i.appendChild(t.createTextNode(e)), d.id = f, p.fake && (p.style.background = "", p.style.overflow = "hidden", c = x.style.overflow, x.style.overflow = "hidden", x.appendChild(p)), a = n(d, e), p.fake ? (p.parentNode.removeChild(p), x.style.overflow = c, x.offsetHeight) : d.parentNode.removeChild(d), !!a
	}

	function c(e, t) {
		return !!~("" + e).indexOf(t)
	}

	function f(e, t) {
		return function() {
			return e.apply(t, arguments)
		}
	}

	function d(e, t, n) {
		var o;
		for (var i in e)
			if (e[i] in t) return n === !1 ? e[i] : (o = t[e[i]], r(o, "function") ? f(o, n || t) : o);
		return !1
	}

	function p(e) {
		return e.replace(/([A-Z])/g, function(e, t) {
			return "-" + t.toLowerCase()
		}).replace(/^ms-/, "-ms-")
	}

	function m(t, r) {
		var o = t.length;
		if ("CSS" in e && "supports" in e.CSS) {
			for (; o--;)
				if (e.CSS.supports(p(t[o]), r)) return !0;
			return !1
		}
		if ("CSSSupportsRule" in e) {
			for (var i = []; o--;) i.push("(" + p(t[o]) + ":" + r + ")");
			return i = i.join(" or "), u("@supports (" + i + ") { #modernizr { position: absolute; } }", function(e) {
				return "absolute" == getComputedStyle(e, null).position
			})
		}
		return n
	}

	function h(e, t, o, i) {
		function l() {
			f && (delete k.style, delete k.modElem)
		}
		if (i = r(i, "undefined") ? !1 : i, !r(o, "undefined")) {
			var u = m(e, o);
			if (!r(u, "undefined")) return u
		}
		for (var f, d, p, h, v, g = ["modernizr", "tspan"]; !k.style;) f = !0, k.modElem = s(g.shift()), k.style = k.modElem.style;
		for (p = e.length, d = 0; p > d; d++)
			if (h = e[d], v = k.style[h], c(h, "-") && (h = a(h)), k.style[h] !== n) {
				if (i || r(o, "undefined")) return l(), "pfx" == t ? h : !0;
				try {
					k.style[h] = o
				} catch (y) {}
				if (k.style[h] != v) return l(), "pfx" == t ? h : !0
			}
		return l(), !1
	}

	function v(e, t, n, o, i) {
		var a = e.charAt(0).toUpperCase() + e.slice(1),
			s = (e + " " + j.join(a + " ") + a).split(" ");
		return r(t, "string") || r(t, "undefined") ? h(s, t, o, i) : (s = (e + " " + F.join(a + " ") + a).split(" "), d(s, t, n))
	}

	function g(e, t, r) {
		return v(e, n, n, t, r)
	}
	var y = [],
		C = [],
		S = {
			_version: "3.3.1",
			_config: {
				classPrefix: "",
				enableClasses: !0,
				enableJSClass: !0,
				usePrefixes: !0
			},
			_q: [],
			on: function(e, t) {
				var n = this;
				setTimeout(function() {
					t(n[e])
				}, 0)
			},
			addTest: function(e, t, n) {
				C.push({
					name: e,
					fn: t,
					options: n
				})
			},
			addAsyncTest: function(e) {
				C.push({
					name: null,
					fn: e
				})
			}
		},
		Modernizr = function() {};
	Modernizr.prototype = S, Modernizr = new Modernizr, Modernizr.addTest("svgfilters", function() {
		var t = !1;
		try {
			t = "SVGFEColorMatrixElement" in e && 2 == SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE
		} catch (n) {}
		return t
	});
	var E = S._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : ["", ""];
	S._prefixes = E;
	var x = t.documentElement,
		b = "svg" === x.nodeName.toLowerCase();
	b || ! function(e, t) {
		function n(e, t) {
			var n = e.createElement("p"),
				r = e.getElementsByTagName("head")[0] || e.documentElement;
			return n.innerHTML = "x<style>" + t + "</style>", r.insertBefore(n.lastChild, r.firstChild)
		}

		function r() {
			var e = C.elements;
			return "string" == typeof e ? e.split(" ") : e
		}

		function o(e, t) {
			var n = C.elements;
			"string" != typeof n && (n = n.join(" ")), "string" != typeof e && (e = e.join(" ")), C.elements = n + " " + e, u(t)
		}

		function i(e) {
			var t = y[e[v]];
			return t || (t = {}, g++, e[v] = g, y[g] = t), t
		}

		function a(e, n, r) {
			if (n || (n = t), f) return n.createElement(e);
			r || (r = i(n));
			var o;
			return o = r.cache[e] ? r.cache[e].cloneNode() : h.test(e) ? (r.cache[e] = r.createElem(e)).cloneNode() : r.createElem(e), !o.canHaveChildren || m.test(e) || o.tagUrn ? o : r.frag.appendChild(o)
		}

		function s(e, n) {
			if (e || (e = t), f) return e.createDocumentFragment();
			n = n || i(e);
			for (var o = n.frag.cloneNode(), a = 0, s = r(), l = s.length; l > a; a++) o.createElement(s[a]);
			return o
		}

		function l(e, t) {
			t.cache || (t.cache = {}, t.createElem = e.createElement, t.createFrag = e.createDocumentFragment, t.frag = t.createFrag()), e.createElement = function(n) {
				return C.shivMethods ? a(n, e, t) : t.createElem(n)
			}, e.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + r().join().replace(/[\w\-:]+/g, function(e) {
				return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")'
			}) + ");return n}")(C, t.frag)
		}

		function u(e) {
			e || (e = t);
			var r = i(e);
			return !C.shivCSS || c || r.hasCSS || (r.hasCSS = !!n(e, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), f || l(e, r), e
		}
		var c, f, d = "3.7.3",
			p = e.html5 || {},
			m = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
			h = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
			v = "_html5shiv",
			g = 0,
			y = {};
		! function() {
			try {
				var e = t.createElement("a");
				e.innerHTML = "<xyz></xyz>", c = "hidden" in e, f = 1 == e.childNodes.length || function() {
					t.createElement("a");
					var e = t.createDocumentFragment();
					return "undefined" == typeof e.cloneNode || "undefined" == typeof e.createDocumentFragment || "undefined" == typeof e.createElement
				}()
			} catch (n) {
				c = !0, f = !0
			}
		}();
		var C = {
			elements: p.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",
			version: d,
			shivCSS: p.shivCSS !== !1,
			supportsUnknownElements: f,
			shivMethods: p.shivMethods !== !1,
			type: "default",
			shivDocument: u,
			createElement: a,
			createDocumentFragment: s,
			addElements: o
		};
		e.html5 = C, u(t), "object" == typeof module && module.exports && (module.exports = C)
	}("undefined" != typeof e ? e : this, t), Modernizr.addTest("inlinesvg", function() {
		var e = s("div");
		return e.innerHTML = "<svg/>", "http://www.w3.org/2000/svg" == ("undefined" != typeof SVGRect && e.firstChild && e.firstChild.namespaceURI)
	});
	var w = "CSS" in e && "supports" in e.CSS,
		_ = "supportsCSS" in e;
	Modernizr.addTest("supports", w || _);
	var T = S.testStyles = u;
	Modernizr.addTest("touchevents", function() {
		var n;
		if ("ontouchstart" in e || e.DocumentTouch && t instanceof DocumentTouch) n = !0;
		else {
			var r = ["@media (", E.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join("");
			T(r, function(e) {
				n = 9 === e.offsetTop
			})
		}
		return n
	});
	var N = "Moz O ms Webkit",
		j = S._config.usePrefixes ? N.split(" ") : [];
	S._cssomPrefixes = j;
	var z = function(t) {
		var r, o = E.length,
			i = e.CSSRule;
		if ("undefined" == typeof i) return n;
		if (!t) return !1;
		if (t = t.replace(/^@/, ""), r = t.replace(/-/g, "_").toUpperCase() + "_RULE", r in i) return "@" + t;
		for (var a = 0; o > a; a++) {
			var s = E[a],
				l = s.toUpperCase() + "_" + r;
			if (l in i) return "@-" + s.toLowerCase() + "-" + t
		}
		return !1
	};
	S.atRule = z;
	var F = S._config.usePrefixes ? N.toLowerCase().split(" ") : [];
	S._domPrefixes = F;
	var M = {
		elem: s("modernizr")
	};
	Modernizr._q.push(function() {
		delete M.elem
	});
	var k = {
		style: M.elem.style
	};
	Modernizr._q.unshift(function() {
		delete k.style
	}), S.testAllProps = v;
	S.prefixed = function(e, t, n) {
		return 0 === e.indexOf("@") ? z(e) : (-1 != e.indexOf("-") && (e = a(e)), t ? v(e, t, n) : v(e, "pfx"))
	};
	S.testAllProps = g, Modernizr.addTest("cssanimations", g("animationName", "a", !0)), Modernizr.addTest("cssfilters", function() {
		if (Modernizr.supports) return g("filter", "blur(2px)");
		var e = s("a");
		return e.style.cssText = E.join("filter:blur(2px); "), !!e.style.length && (t.documentMode === n || t.documentMode > 9)
	}), o(), i(y), delete S.addTest, delete S.addAsyncTest;
	for (var P = 0; P < Modernizr._q.length; P++) Modernizr._q[P]();
	e.Modernizr = Modernizr
}(window, document);

/* debouncedresize: special jQuery event that happens once after a window resize
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery-smartresize
 *
 * Copyright 2012 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work?
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 */

(function($) {
	var $event = $.event,
		$special, resizeTimeout;
	$special = $event.special.debouncedresize = {
		setup: function() {
			$(this).on("resize", $special.handler);
		},
		teardown: function() {
			$(this).off("resize", $special.handler);
		},
		handler: function(event, execAsap) {
			var context = this,
				args = arguments,
				dispatch = function() {
					event.type = "debouncedresize";
					$event.dispatch.apply(context, args);
				};
			if (resizeTimeout) {
				clearTimeout(resizeTimeout);
			}
			execAsap ? dispatch() : resizeTimeout = setTimeout(dispatch, $special.threshold);
		},
		threshold: 150
	};
})(jQuery);

/**
 * jquery.hoverdir.js v1.1.1
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2012, Codrops
 * http://www.codrops.com
 */
;
(function($, window, undefined) {
	'use strict';
	$.HoverDir = function(options, element) {
		this.$el = $(element);
		this._init(options);
	};
	$.HoverDir.defaults = {
		speed: 300,
		easing: 'ease',
		hoverDelay: 0,
		inverse: false,
		hoverElem: 'div'
	};
	$.HoverDir.prototype = {
		_init: function(options) {
			this.options = $.extend(true, {}, $.HoverDir.defaults, options);
			this.transitionProp = 'all ' + this.options.speed + 'ms ' + this.options.easing;
			this.support = Modernizr.csstransitions;
			this._loadEvents();
		},
		_loadEvents: function() {
			var self = this;
			this.$el.on('mouseenter.hoverdir, mouseleave.hoverdir', function(event) {
				var $el = $(this),
					$hoverElem = $el.find(self.options.hoverElem),
					direction = self._getDir($el, {
						x: event.pageX,
						y: event.pageY
					}),
					styleCSS = self._getStyle(direction);
				if (event.type === 'mouseenter') {
					$hoverElem.hide().css(styleCSS.from);
					clearTimeout(self.tmhover);
					self.tmhover = setTimeout(function() {
						$hoverElem.show(0, function() {
							var $el = $(this);
							if (self.support) {
								$el.css('transition', self.transitionProp);
							}
							self._applyAnimation($el, styleCSS.to, self.options.speed);
						});
					}, self.options.hoverDelay);
				} else {
					if (self.support) {
						$hoverElem.css('transition', self.transitionProp);
					}
					clearTimeout(self.tmhover);
					self._applyAnimation($hoverElem, styleCSS.from, self.options.speed);
				}
			});
		},
		_getDir: function($el, coordinates) {
			var w = $el.width(),
				h = $el.height(),
				x = (coordinates.x - $el.offset().left - (w / 2)) * (w > h ? (h / w) : 1),
				y = (coordinates.y - $el.offset().top - (h / 2)) * (h > w ? (w / h) : 1),
				direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
			return direction;
		},
		_getStyle: function(direction) {
			var fromStyle, toStyle, slideFromTop = {
					left: '0px',
					top: '-100%'
				},
				slideFromBottom = {
					left: '0px',
					top: '100%'
				},
				slideFromLeft = {
					left: '-100%',
					top: '0px'
				},
				slideFromRight = {
					left: '100%',
					top: '0px'
				},
				slideTop = {
					top: '0px'
				},
				slideLeft = {
					left: '0px'
				};
			switch (direction) {
				case 0:
					fromStyle = !this.options.inverse ? slideFromTop : slideFromBottom;
					toStyle = slideTop;
					break;
				case 1:
					fromStyle = !this.options.inverse ? slideFromRight : slideFromLeft;
					toStyle = slideLeft;
					break;
				case 2:
					fromStyle = !this.options.inverse ? slideFromBottom : slideFromTop;
					toStyle = slideTop;
					break;
				case 3:
					fromStyle = !this.options.inverse ? slideFromLeft : slideFromRight;
					toStyle = slideLeft;
					break;
			};
			return {
				from: fromStyle,
				to: toStyle
			};
		},
		_applyAnimation: function(el, styleCSS, speed) {
			$.fn.applyStyle = this.support ? $.fn.css : $.fn.animate;
			el.stop().applyStyle(styleCSS, $.extend(true, [], {
				duration: speed + 'ms'
			}));
		}
	};
	var logError = function(message) {
		if (window.console) {
			window.console.error(message);
		}
	};
	$.fn.hoverdir = function(options) {
		var instance = $.data(this, 'hoverdir');
		if (typeof options === 'string') {
			var args = Array.prototype.slice.call(arguments, 1);
			this.each(function() {
				if (!instance) {
					logError("cannot call methods on hoverdir prior to initialization; " + "attempted to call method '" + options + "'");
					return;
				}
				if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
					logError("no such method '" + options + "' for hoverdir instance");
					return;
				}
				instance[options].apply(instance, args);
			});
		} else {
			this.each(function() {
				if (instance) {
					instance._init();
				} else {
					instance = $.data(this, 'hoverdir', new $.HoverDir(options, this));
				}
			});
		}
		return instance;
	};
})(jQuery, window);

/*
	DoubleTapToGo - Touch device friendly
	AUTHOR: Osvaldas Valutis, www.osvaldas.info
*/
;
(function(e, t, n, r) {
	e.fn.doubleTapToGo = function(r) {
		if (!("ontouchstart" in t) && !navigator.msMaxTouchPoints && !navigator.userAgent.toLowerCase().match(/windows phone os 7/i)) return false;
		this.each(function() {
			var t = false;
			e(this).on("click", function(n) {
				var r = e(this);
				if (r[0] != t[0]) {
					n.preventDefault();
					t = r
				}
			});
			e(n).on("click touchstart MSPointerDown", function(n) {
				var r = true,
					i = e(n.target).parents();
				for (var s = 0; s < i.length; s++)
					if (i[s] == t[0]) r = false;
				if (r) t = false
			})
		});
		return this
	}
})(jQuery, window, document);

/*!
 * jQuery imagesLoaded plugin v1.2.3
 * http://github.com/desandro/imagesloaded
 *
 * MIT License. by Paul Irish et al.
 */
;
(function($, undefined) {

	// $('#my-container').imagesLoaded(myFunction)
	// or
	// $('img').imagesLoaded(myFunction)

	// execute a callback when all images have loaded.
	// needed because .load() doesn't work on cached images

	// callback is executed when all images has fineshed loading
	// callback function arguments: $all_images, $proper_images, $broken_images
	// `this` is the jQuery wrapped container

	// returns previous jQuery wrapped container extended with deferred object
	// done method arguments: .done( function( $all_images ){ ... } )
	// fail method arguments: .fail( function( $all_images, $proper_images, $broken_images ){ ... } )
	// progress method arguments: .progress( function( images_count, loaded_count, proper_count, broken_count )

	$.fn.imagesLoaded = function(callback) {
		var $this = this,
			deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
			hasNotify = $.isFunction(deferred.notify),
			$images = $this.find('img').add($this.filter('img')),
			len = $images.length,
			blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
			loaded = [],
			proper = [],
			broken = [];

		function doneLoading() {
			var $proper = $(proper),
				$broken = $(broken);
			if (deferred) {
				if (broken.length) {
					deferred.reject($images, $proper, $broken)
				} else {
					deferred.resolve($images)
				}
			}
			if ($.isFunction(callback)) {
				callback.call($this, $images, $proper, $broken)
			}
		}

		function imgLoaded(event) {
			if (event.target.src === blank || $.inArray(this, loaded) !== -1) {
				return
			}
			loaded.push(this);
			if (event.type === 'error') {
				broken.push(this)
			} else {
				proper.push(this)
			}
			$.data(this, 'imagesLoaded', event.type);
			if (hasNotify) {
				deferred.notify($images.length, loaded.length, proper.length, broken.length)
			}
			if (--len <= 0) {
				setTimeout(doneLoading);
				$images.unbind('.imagesLoaded', imgLoaded)
			}
		}
		if (!len) {
			doneLoading()
		}
		$images.bind('load.imagesLoaded error.imagesLoaded', imgLoaded).each(function() {
			var cachedEvent = $.data(this, 'imagesLoaded');
			if (cachedEvent) {
				$(this).triggerHandler(cachedEvent);
				return
			}
			var src = this.src;
			this.src = blank;
			this.src = src
		});
		return deferred ? deferred.promise($this) : $this
	}
})(jQuery);

// SmoothScroll for websites v1.2.1
// Licensed under the terms of the MIT license.

// People involved
//  - Balazs Galambosi (maintainer)
//  - Michael Herf     (Pulse Algorithm)

! function() {
	function e() {
		var e = !1;
		e && c("keydown", r), v.keyboardSupport && !e && u("keydown", r)
	}

	function t() {
		if (document.body) {
			var t = document.body,
				o = document.documentElement,
				n = window.innerHeight,
				r = t.scrollHeight;
			if (S = document.compatMode.indexOf("CSS") >= 0 ? o : t, w = t, e(), x = !0, top != self) y = !0;
			else if (r > n && (t.offsetHeight <= n || o.offsetHeight <= n)) {
				var a = !1,
					i = function() {
						a || o.scrollHeight == document.height || (a = !0, setTimeout(function() {
							o.style.height = document.height + "px", a = !1
						}, 500))
					};
				if (o.style.height = "auto", setTimeout(i, 10), S.offsetHeight <= n) {
					var l = document.createElement("div");
					l.style.clear = "both", t.appendChild(l)
				}
			}
			v.fixedBackground || b || (t.style.backgroundAttachment = "scroll", o.style.backgroundAttachment = "scroll")
		}
	}

	function o(e, t, o, n) {
		if (n || (n = 1e3), d(t, o), 1 != v.accelerationMax) {
			var r = +new Date,
				a = r - C;
			if (a < v.accelerationDelta) {
				var i = (1 + 30 / a) / 2;
				i > 1 && (i = Math.min(i, v.accelerationMax), t *= i, o *= i)
			}
			C = +new Date
		}
		if (M.push({
				x: t,
				y: o,
				lastX: 0 > t ? .99 : -.99,
				lastY: 0 > o ? .99 : -.99,
				start: +new Date
			}), !T) {
			var l = e === document.body,
				u = function() {
					for (var r = +new Date, a = 0, i = 0, c = 0; c < M.length; c++) {
						var s = M[c],
							d = r - s.start,
							f = d >= v.animationTime,
							h = f ? 1 : d / v.animationTime;
						v.pulseAlgorithm && (h = p(h));
						var m = s.x * h - s.lastX >> 0,
							w = s.y * h - s.lastY >> 0;
						a += m, i += w, s.lastX += m, s.lastY += w, f && (M.splice(c, 1), c--)
					}
					l ? window.scrollBy(a, i) : (a && (e.scrollLeft += a), i && (e.scrollTop += i)), t || o || (M = []), M.length ? E(u, e, n / v.frameRate + 1) : T = !1
				};
			E(u, e, 0), T = !0
		}
	}

	function n(e) {
		x || t();
		var n = e.target,
			r = l(n);
		if (!r || e.defaultPrevented || s(w, "embed") || s(n, "embed") && /\.pdf/i.test(n.src)) return !0;
		var a = e.wheelDeltaX || 0,
			i = e.wheelDeltaY || 0;
		return a || i || (i = e.wheelDelta || 0), !v.touchpadSupport && f(i) ? !0 : (Math.abs(a) > 1.2 && (a *= v.stepSize / 120), Math.abs(i) > 1.2 && (i *= v.stepSize / 120), o(r, -a, -i), void e.preventDefault())
	}

	function r(e) {
		var t = e.target,
			n = e.ctrlKey || e.altKey || e.metaKey || e.shiftKey && e.keyCode !== H.spacebar;
		if (/input|textarea|select|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n) return !0;
		if (s(t, "button") && e.keyCode === H.spacebar) return !0;
		var r, a = 0,
			i = 0,
			u = l(w),
			c = u.clientHeight;
		switch (u == document.body && (c = window.innerHeight), e.keyCode) {
			case H.up:
				i = -v.arrowScroll;
				break;
			case H.down:
				i = v.arrowScroll;
				break;
			case H.spacebar:
				r = e.shiftKey ? 1 : -1, i = -r * c * .9;
				break;
			case H.pageup:
				i = .9 * -c;
				break;
			case H.pagedown:
				i = .9 * c;
				break;
			case H.home:
				i = -u.scrollTop;
				break;
			case H.end:
				var d = u.scrollHeight - u.scrollTop - c;
				i = d > 0 ? d + 10 : 0;
				break;
			case H.left:
				a = -v.arrowScroll;
				break;
			case H.right:
				a = v.arrowScroll;
				break;
			default:
				return !0
		}
		o(u, a, i), e.preventDefault()
	}

	function a(e) {
		w = e.target
	}

	function i(e, t) {
		for (var o = e.length; o--;) z[N(e[o])] = t;
		return t
	}

	function l(e) {
		var t = [],
			o = S.scrollHeight;
		do {
			var n = z[N(e)];
			if (n) return i(t, n);
			if (t.push(e), o === e.scrollHeight) {
				if (!y || S.clientHeight + 10 < o) return i(t, document.body)
			} else if (e.clientHeight + 10 < e.scrollHeight && (overflow = getComputedStyle(e, "").getPropertyValue("overflow-y"), "scroll" === overflow || "auto" === overflow)) return i(t, e)
		} while (e = e.parentNode)
	}

	function u(e, t, o) {
		window.addEventListener(e, t, o || !1)
	}

	function c(e, t, o) {
		window.removeEventListener(e, t, o || !1)
	}

	function s(e, t) {
		return (e.nodeName || "").toLowerCase() === t.toLowerCase()
	}

	function d(e, t) {
		e = e > 0 ? 1 : -1, t = t > 0 ? 1 : -1, (k.x !== e || k.y !== t) && (k.x = e, k.y = t, M = [], C = 0)
	}

	function f(e) {
		if (e) {
			e = Math.abs(e), D.push(e), D.shift(), clearTimeout(A);
			var t = D[0] == D[1] && D[1] == D[2],
				o = h(D[0], 120) && h(D[1], 120) && h(D[2], 120);
			return !(t || o)
		}
	}

	function h(e, t) {
		return Math.floor(e / t) == e / t
	}

	function m(e) {
		var t, o, n;
		return e *= v.pulseScale, 1 > e ? t = e - (1 - Math.exp(-e)) : (o = Math.exp(-1), e -= 1, n = 1 - Math.exp(-e), t = o + n * (1 - o)), t * v.pulseNormalize
	}

	function p(e) {
		return e >= 1 ? 1 : 0 >= e ? 0 : (1 == v.pulseNormalize && (v.pulseNormalize /= m(1)), m(e))
	}
	var w, g = {
			frameRate: 150,
			animationTime: 800,
			stepSize: 120,
			pulseAlgorithm: !0,
			pulseScale: 8,
			pulseNormalize: 1,
			accelerationDelta: 20,
			accelerationMax: 1,
			keyboardSupport: !0,
			arrowScroll: 50,
			touchpadSupport: !0,
			fixedBackground: !0,
			excluded: ""
		},
		v = g,
		b = !1,
		y = !1,
		k = {
			x: 0,
			y: 0
		},
		x = !1,
		S = document.documentElement,
		D = [120, 120, 120],
		H = {
			left: 37,
			up: 38,
			right: 39,
			down: 40,
			spacebar: 32,
			pageup: 33,
			pagedown: 34,
			end: 35,
			home: 36
		},
		v = g,
		M = [],
		T = !1,
		C = +new Date,
		z = {};
	setInterval(function() {
		z = {}
	}, 1e4);
	var A, N = function() {
			var e = 0;
			return function(t) {
				return t.uniqueID || (t.uniqueID = e++)
			}
		}(),
		E = function() {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(e, t, o) {
				window.setTimeout(e, o || 1e3 / 60)
			}
		}(),
		K = /chrome/i.test(window.navigator.userAgent),
		L = "onmousewheel" in document;
	L && K && (u("mousedown", a), u("mousewheel", n), u("load", t))
}();


// Generated by CoffeeScript 1.6.2
/*
jQuery Waypoints - v2.0.4
Copyright (c) 2011-2014 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function() {
	var t = [].indexOf || function(t) {
			for (var e = 0, n = this.length; e < n; e++) {
				if (e in this && this[e] === t) return e
			}
			return -1
		},
		e = [].slice;
	(function(t, e) {
		if (typeof define === "function" && define.amd) {
			return define("waypoints", ["jquery"], function(n) {
				return e(n, t)
			})
		} else {
			return e(t.jQuery, t)
		}
	})(this, function(n, r) {
		var i, o, l, s, f, u, c, a, h, d, p, y, v, w, g, m;
		i = n(r);
		a = t.call(r, "ontouchstart") >= 0;
		s = {
			horizontal: {},
			vertical: {}
		};
		f = 1;
		c = {};
		u = "waypoints-context-id";
		p = "resize.waypoints";
		y = "scroll.waypoints";
		v = 1;
		w = "waypoints-waypoint-ids";
		g = "waypoint";
		m = "waypoints";
		o = function() {
			function t(t) {
				var e = this;
				this.$element = t;
				this.element = t[0];
				this.didResize = false;
				this.didScroll = false;
				this.id = "context" + f++;
				this.oldScroll = {
					x: t.scrollLeft(),
					y: t.scrollTop()
				};
				this.waypoints = {
					horizontal: {},
					vertical: {}
				};
				this.element[u] = this.id;
				c[this.id] = this;
				t.bind(y, function() {
					var t;
					if (!(e.didScroll || a)) {
						e.didScroll = true;
						t = function() {
							e.doScroll();
							return e.didScroll = false
						};
						return r.setTimeout(t, n[m].settings.scrollThrottle)
					}
				});
				t.bind(p, function() {
					var t;
					if (!e.didResize) {
						e.didResize = true;
						t = function() {
							n[m]("refresh");
							return e.didResize = false
						};
						return r.setTimeout(t, n[m].settings.resizeThrottle)
					}
				})
			}
			t.prototype.doScroll = function() {
				var t, e = this;
				t = {
					horizontal: {
						newScroll: this.$element.scrollLeft(),
						oldScroll: this.oldScroll.x,
						forward: "right",
						backward: "left"
					},
					vertical: {
						newScroll: this.$element.scrollTop(),
						oldScroll: this.oldScroll.y,
						forward: "down",
						backward: "up"
					}
				};
				if (a && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
					n[m]("refresh")
				}
				n.each(t, function(t, r) {
					var i, o, l;
					l = [];
					o = r.newScroll > r.oldScroll;
					i = o ? r.forward : r.backward;
					n.each(e.waypoints[t], function(t, e) {
						var n, i;
						if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
							return l.push(e)
						} else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
							return l.push(e)
						}
					});
					l.sort(function(t, e) {
						return t.offset - e.offset
					});
					if (!o) {
						l.reverse()
					}
					return n.each(l, function(t, e) {
						if (e.options.continuous || t === l.length - 1) {
							return e.trigger([i])
						}
					})
				});
				return this.oldScroll = {
					x: t.horizontal.newScroll,
					y: t.vertical.newScroll
				}
			};
			t.prototype.refresh = function() {
				var t, e, r, i = this;
				r = n.isWindow(this.element);
				e = this.$element.offset();
				this.doScroll();
				t = {
					horizontal: {
						contextOffset: r ? 0 : e.left,
						contextScroll: r ? 0 : this.oldScroll.x,
						contextDimension: this.$element.width(),
						oldScroll: this.oldScroll.x,
						forward: "right",
						backward: "left",
						offsetProp: "left"
					},
					vertical: {
						contextOffset: r ? 0 : e.top,
						contextScroll: r ? 0 : this.oldScroll.y,
						contextDimension: r ? n[m]("viewportHeight") : this.$element.height(),
						oldScroll: this.oldScroll.y,
						forward: "down",
						backward: "up",
						offsetProp: "top"
					}
				};
				return n.each(t, function(t, e) {
					return n.each(i.waypoints[t], function(t, r) {
						var i, o, l, s, f;
						i = r.options.offset;
						l = r.offset;
						o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
						if (n.isFunction(i)) {
							i = i.apply(r.element)
						} else if (typeof i === "string") {
							i = parseFloat(i);
							if (r.options.offset.indexOf("%") > -1) {
								i = Math.ceil(e.contextDimension * i / 100)
							}
						}
						r.offset = o - e.contextOffset + e.contextScroll - i;
						if (r.options.onlyOnScroll && l != null || !r.enabled) {
							return
						}
						if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
							return r.trigger([e.backward])
						} else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
							return r.trigger([e.forward])
						} else if (l === null && e.oldScroll >= r.offset) {
							return r.trigger([e.forward])
						}
					})
				})
			};
			t.prototype.checkEmpty = function() {
				if (n.isEmptyObject(this.waypoints.horizontal) && n.isEmptyObject(this.waypoints.vertical)) {
					this.$element.unbind([p, y].join(" "));
					return delete c[this.id]
				}
			};
			return t
		}();
		l = function() {
			function t(t, e, r) {
				var i, o;
				r = n.extend({}, n.fn[g].defaults, r);
				if (r.offset === "bottom-in-view") {
					r.offset = function() {
						var t;
						t = n[m]("viewportHeight");
						if (!n.isWindow(e.element)) {
							t = e.$element.height()
						}
						return t - n(this).outerHeight()
					}
				}
				this.$element = t;
				this.element = t[0];
				this.axis = r.horizontal ? "horizontal" : "vertical";
				this.callback = r.handler;
				this.context = e;
				this.enabled = r.enabled;
				this.id = "waypoints" + v++;
				this.offset = null;
				this.options = r;
				e.waypoints[this.axis][this.id] = this;
				s[this.axis][this.id] = this;
				i = (o = this.element[w]) != null ? o : [];
				i.push(this.id);
				this.element[w] = i
			}
			t.prototype.trigger = function(t) {
				if (!this.enabled) {
					return
				}
				if (this.callback != null) {
					this.callback.apply(this.element, t)
				}
				if (this.options.triggerOnce) {
					return this.destroy()
				}
			};
			t.prototype.disable = function() {
				return this.enabled = false
			};
			t.prototype.enable = function() {
				this.context.refresh();
				return this.enabled = true
			};
			t.prototype.destroy = function() {
				delete s[this.axis][this.id];
				delete this.context.waypoints[this.axis][this.id];
				return this.context.checkEmpty()
			};
			t.getWaypointsByElement = function(t) {
				var e, r;
				r = t[w];
				if (!r) {
					return []
				}
				e = n.extend({}, s.horizontal, s.vertical);
				return n.map(r, function(t) {
					return e[t]
				})
			};
			return t
		}();
		d = {
			init: function(t, e) {
				var r;
				if (e == null) {
					e = {}
				}
				if ((r = e.handler) == null) {
					e.handler = t
				}
				this.each(function() {
					var t, r, i, s;
					t = n(this);
					i = (s = e.context) != null ? s : n.fn[g].defaults.context;
					if (!n.isWindow(i)) {
						i = t.closest(i)
					}
					i = n(i);
					r = c[i[0][u]];
					if (!r) {
						r = new o(i)
					}
					return new l(t, r, e)
				});
				n[m]("refresh");
				return this
			},
			disable: function() {
				return d._invoke.call(this, "disable")
			},
			enable: function() {
				return d._invoke.call(this, "enable")
			},
			destroy: function() {
				return d._invoke.call(this, "destroy")
			},
			prev: function(t, e) {
				return d._traverse.call(this, t, e, function(t, e, n) {
					if (e > 0) {
						return t.push(n[e - 1])
					}
				})
			},
			next: function(t, e) {
				return d._traverse.call(this, t, e, function(t, e, n) {
					if (e < n.length - 1) {
						return t.push(n[e + 1])
					}
				})
			},
			_traverse: function(t, e, i) {
				var o, l;
				if (t == null) {
					t = "vertical"
				}
				if (e == null) {
					e = r
				}
				l = h.aggregate(e);
				o = [];
				this.each(function() {
					var e;
					e = n.inArray(this, l[t]);
					return i(o, e, l[t])
				});
				return this.pushStack(o)
			},
			_invoke: function(t) {
				this.each(function() {
					var e;
					e = l.getWaypointsByElement(this);
					return n.each(e, function(e, n) {
						n[t]();
						return true
					})
				});
				return this
			}
		};
		n.fn[g] = function() {
			var t, r;
			r = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
			if (d[r]) {
				return d[r].apply(this, t)
			} else if (n.isFunction(r)) {
				return d.init.apply(this, arguments)
			} else if (n.isPlainObject(r)) {
				return d.init.apply(this, [null, r])
			} else if (!r) {
				return n.error("jQuery Waypoints needs a callback function or handler option.")
			} else {
				return n.error("The " + r + " method does not exist in jQuery Waypoints.")
			}
		};
		n.fn[g].defaults = {
			context: r,
			continuous: true,
			enabled: true,
			horizontal: false,
			offset: 0,
			triggerOnce: false
		};
		h = {
			refresh: function() {
				return n.each(c, function(t, e) {
					return e.refresh()
				})
			},
			viewportHeight: function() {
				var t;
				return (t = r.innerHeight) != null ? t : i.height()
			},
			aggregate: function(t) {
				var e, r, i;
				e = s;
				if (t) {
					e = (i = c[n(t)[0][u]]) != null ? i.waypoints : void 0
				}
				if (!e) {
					return []
				}
				r = {
					horizontal: [],
					vertical: []
				};
				n.each(r, function(t, i) {
					n.each(e[t], function(t, e) {
						return i.push(e)
					});
					i.sort(function(t, e) {
						return t.offset - e.offset
					});
					r[t] = n.map(i, function(t) {
						return t.element
					});
					return r[t] = n.unique(r[t])
				});
				return r
			},
			above: function(t) {
				if (t == null) {
					t = r
				}
				return h._filter(t, "vertical", function(t, e) {
					return e.offset <= t.oldScroll.y
				})
			},
			below: function(t) {
				if (t == null) {
					t = r
				}
				return h._filter(t, "vertical", function(t, e) {
					return e.offset > t.oldScroll.y
				})
			},
			left: function(t) {
				if (t == null) {
					t = r
				}
				return h._filter(t, "horizontal", function(t, e) {
					return e.offset <= t.oldScroll.x
				})
			},
			right: function(t) {
				if (t == null) {
					t = r
				}
				return h._filter(t, "horizontal", function(t, e) {
					return e.offset > t.oldScroll.x
				})
			},
			enable: function() {
				return h._invoke("enable")
			},
			disable: function() {
				return h._invoke("disable")
			},
			destroy: function() {
				return h._invoke("destroy")
			},
			extendFn: function(t, e) {
				return d[t] = e
			},
			_invoke: function(t) {
				var e;
				e = n.extend({}, s.vertical, s.horizontal);
				return n.each(e, function(e, n) {
					n[t]();
					return true
				})
			},
			_filter: function(t, e, r) {
				var i, o;
				i = c[n(t)[0][u]];
				if (!i) {
					return []
				}
				o = [];
				n.each(i.waypoints[e], function(t, e) {
					if (r(i, e)) {
						return o.push(e)
					}
				});
				o.sort(function(t, e) {
					return t.offset - e.offset
				});
				return n.map(o, function(t) {
					return t.element
				})
			}
		};
		n[m] = function() {
			var t, n;
			n = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
			if (h[n]) {
				return h[n].apply(null, t)
			} else {
				return h.aggregate.call(null, n)
			}
		};
		n[m].settings = {
			resizeThrottle: 100,
			scrollThrottle: 30
		};
		return i.load(function() {
			return n[m]("refresh")
		})
	})
}).call(this);

/*!
 *
 * jQuery collagePlus Plugin v0.3.3
 * https://github.com/ed-lea/jquery-collagePlus
 *
 * Copyright 2012, Ed Lea twitter.com/ed_lea
 *
 * built for http://qiip.me
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 *
 */
;
(function(e) {
	e.fn.collagePlus = function(t) {
		function n(t, n, i, s) {
			var o = i.padding * (t.length - 1) + t.length * t[0][3],
				u = i.albumWidth - o,
				a = u / (n - o),
				f = o,
				l = n < i.albumWidth ? true : false;
			for (var c = 0; c < t.length; c++) {
				var h = e(t[c][0]),
					p = Math.floor(t[c][1] * a),
					d = Math.floor(t[c][2] * a),
					v = !!(c < t.length - 1);
				if (i.allowPartialLastRow === true && l === true) {
					p = t[c][1];
					d = t[c][2]
				}
				f += p;
				if (!v && f < i.albumWidth) {
					if (i.allowPartialLastRow === true && l === true) {
						p = p
					} else {
						p = p + (i.albumWidth - f)
					}
				}
				p--;
				var m = h.is("img") ? h : h.find("img");
				m.width(p);
				if (!h.is("img")) {
					h.width(p + t[c][3])
				}
				m.height(d);
				if (!h.is("img")) {
					h.height(d + t[c][4])
				}
				r(h, v, i);
				m.one("load", function(e) {
					return function() {
						if (i.effect == "default") {
							e.animate({
								opacity: "1"
							}, {
								duration: i.fadeSpeed
							})
						} else {
							if (i.direction == "vertical") {
								var t = s <= 10 ? s : 10
							} else {
								var t = c <= 9 ? c + 1 : 10
							}
							e.removeClass(function(e, t) {
								return (t.match(/\beffect-\S+/g) || []).join(" ")
							});
							e.addClass(i.effect);
							e.addClass("effect-duration-" + t)
						}
					}
				}(h)).each(function() {
					if (this.complete) e(this).trigger("load")
				})
			}
		}

		function r(e, t, n) {
			var r = {
				"margin-bottom": n.padding + "px",
				"margin-right": t ? n.padding + "px" : "0px",
				display: n.display,
				"vertical-align": "bottom",
				overflow: "hidden"
			};
			return e.css(r)
		}

		function i(t) {
			$img = e(t);
			var n = new Array;
			n["w"] = parseFloat($img.css("border-left-width")) + parseFloat($img.css("border-right-width"));
			n["h"] = parseFloat($img.css("border-top-width")) + parseFloat($img.css("border-bottom-width"));
			return n
		}
		return this.each(function() {
			var r = 0,
				s = [],
				o = 1,
				u = e(this);
			e.fn.collagePlus.defaults.albumWidth = u.width();
			e.fn.collagePlus.defaults.padding = parseFloat(u.css("padding-left"));
			e.fn.collagePlus.defaults.images = u.children();
			var a = e.extend({}, e.fn.collagePlus.defaults, t);
			a.images.each(function(t) {
				var u = e(this),
					f = u.is("img") ? u : e(this).find("img");
				var l = typeof f.data("width") != "undefined" ? f.data("width") : f.width(),
					c = typeof f.data("height") != "undefined" ? f.data("height") : f.height();
				var h = i(f);
				f.data("width", l);
				f.data("height", c);
				var p = Math.ceil(l / c * a.targetHeight),
					d = Math.ceil(a.targetHeight);
				s.push([this, p, d, h["w"], h["h"]]);
				r += p + h["w"] + a.padding;
				if (r > a.albumWidth && s.length != 0) {
					n(s, r - a.padding, a, o);
					delete r;
					delete s;
					r = 0;
					s = [];
					o += 1
				}
				if (a.images.length - 1 == t && s.length != 0) {
					n(s, r, a, o);
					delete r;
					delete s;
					r = 0;
					s = [];
					o += 1
				}
			})
		})
	};
	e.fn.collagePlus.defaults = {
		targetHeight: 400,
		fadeSpeed: "fast",
		display: "inline-block",
		effect: "default",
		direction: "vertical",
		allowPartialLastRow: false
	}
})(jQuery);

/*
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.jplayer.org
 *
 * Copyright (c) 2009 - 2012 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 2.2.0
 * Date: 13th September 2012
 */

(function(b, f) {
	b.fn.jPlayer = function(a) {
		var c = "string" === typeof a,
			d = Array.prototype.slice.call(arguments, 1),
			e = this,
			a = !c && d.length ? b.extend.apply(null, [!0, a].concat(d)) : a;
		if (c && "_" === a.charAt(0)) return e;
		c ? this.each(function() {
			var c = b.data(this, "jPlayer"),
				h = c && b.isFunction(c[a]) ? c[a].apply(c, d) : c;
			if (h !== c && h !== f) return e = h, !1
		}) : this.each(function() {
			var c = b.data(this, "jPlayer");
			c ? c.option(a || {}) : b.data(this, "jPlayer", new b.jPlayer(a, this))
		});
		return e
	};
	b.jPlayer = function(a, c) {
		if (arguments.length) {
			this.element =
				b(c);
			this.options = b.extend(!0, {}, this.options, a);
			var d = this;
			this.element.bind("remove.jPlayer", function() {
				d.destroy()
			});
			this._init()
		}
	};
	b.jPlayer.emulateMethods = "load play pause";
	b.jPlayer.emulateStatus = "src readyState networkState currentTime duration paused ended playbackRate";
	b.jPlayer.emulateOptions = "muted volume";
	b.jPlayer.reservedEvent = "ready flashreset resize repeat error warning";
	b.jPlayer.event = {
		ready: "jPlayer_ready",
		flashreset: "jPlayer_flashreset",
		resize: "jPlayer_resize",
		repeat: "jPlayer_repeat",
		click: "jPlayer_click",
		error: "jPlayer_error",
		warning: "jPlayer_warning",
		loadstart: "jPlayer_loadstart",
		progress: "jPlayer_progress",
		suspend: "jPlayer_suspend",
		abort: "jPlayer_abort",
		emptied: "jPlayer_emptied",
		stalled: "jPlayer_stalled",
		play: "jPlayer_play",
		pause: "jPlayer_pause",
		loadedmetadata: "jPlayer_loadedmetadata",
		loadeddata: "jPlayer_loadeddata",
		waiting: "jPlayer_waiting",
		playing: "jPlayer_playing",
		canplay: "jPlayer_canplay",
		canplaythrough: "jPlayer_canplaythrough",
		seeking: "jPlayer_seeking",
		seeked: "jPlayer_seeked",
		timeupdate: "jPlayer_timeupdate",
		ended: "jPlayer_ended",
		ratechange: "jPlayer_ratechange",
		durationchange: "jPlayer_durationchange",
		volumechange: "jPlayer_volumechange"
	};
	b.jPlayer.htmlEvent = "loadstart abort emptied stalled loadedmetadata loadeddata canplay canplaythrough ratechange".split(" ");
	b.jPlayer.pause = function() {
		b.each(b.jPlayer.prototype.instances, function(a, c) {
			c.data("jPlayer").status.srcSet && c.jPlayer("pause")
		})
	};
	b.jPlayer.timeFormat = {
		showHour: !1,
		showMin: !0,
		showSec: !0,
		padHour: !1,
		padMin: !0,
		padSec: !0,
		sepHour: ":",
		sepMin: ":",
		sepSec: ""
	};
	b.jPlayer.convertTime = function(a) {
		var c = new Date(1E3 * a),
			d = c.getUTCHours(),
			a = c.getUTCMinutes(),
			c = c.getUTCSeconds(),
			d = b.jPlayer.timeFormat.padHour && 10 > d ? "0" + d : d,
			a = b.jPlayer.timeFormat.padMin && 10 > a ? "0" + a : a,
			c = b.jPlayer.timeFormat.padSec && 10 > c ? "0" + c : c;
		return (b.jPlayer.timeFormat.showHour ? d + b.jPlayer.timeFormat.sepHour : "") + (b.jPlayer.timeFormat.showMin ? a + b.jPlayer.timeFormat.sepMin : "") + (b.jPlayer.timeFormat.showSec ? c + b.jPlayer.timeFormat.sepSec : "")
	};
	b.jPlayer.uaBrowser =
		function(a) {
			var a = a.toLowerCase(),
				c = /(opera)(?:.*version)?[ \/]([\w.]+)/,
				b = /(msie) ([\w.]+)/,
				e = /(mozilla)(?:.*? rv:([\w.]+))?/,
				a = /(webkit)[ \/]([\w.]+)/.exec(a) || c.exec(a) || b.exec(a) || 0 > a.indexOf("compatible") && e.exec(a) || [];
			return {
				browser: a[1] || "",
				version: a[2] || "0"
			}
		};
	b.jPlayer.uaPlatform = function(a) {
		var b = a.toLowerCase(),
			d = /(android)/,
			e = /(mobile)/,
			a = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/.exec(b) || [],
			b = /(ipad|playbook)/.exec(b) || !e.exec(b) && d.exec(b) || [];
		a[1] && (a[1] = a[1].replace(/\s/g,
			"_"));
		return {
			platform: a[1] || "",
			tablet: b[1] || ""
		}
	};
	b.jPlayer.browser = {};
	b.jPlayer.platform = {};
	var i = b.jPlayer.uaBrowser(navigator.userAgent);
	i.browser && (b.jPlayer.browser[i.browser] = !0, b.jPlayer.browser.version = i.version);
	i = b.jPlayer.uaPlatform(navigator.userAgent);
	i.platform && (b.jPlayer.platform[i.platform] = !0, b.jPlayer.platform.mobile = !i.tablet, b.jPlayer.platform.tablet = !!i.tablet);
	b.jPlayer.prototype = {
		count: 0,
		version: {
			script: "2.2.0",
			needFlash: "2.2.0",
			flash: "unknown"
		},
		options: {
			swfPath: "js",
			solution: "html, flash",
			supplied: "mp3",
			preload: "metadata",
			volume: 0.8,
			muted: !1,
			wmode: "opaque",
			backgroundColor: "#000000",
			cssSelectorAncestor: "#jp_container_1",
			cssSelector: {
				videoPlay: ".jp-video-play",
				play: ".jp-play",
				pause: ".jp-pause",
				stop: ".jp-stop",
				seekBar: ".jp-seek-bar",
				playBar: ".jp-play-bar",
				mute: ".jp-mute",
				unmute: ".jp-unmute",
				volumeBar: ".jp-volume-bar",
				volumeBarValue: ".jp-volume-bar-value",
				volumeMax: ".jp-volume-max",
				currentTime: ".jp-current-time",
				duration: ".jp-duration",
				fullScreen: ".jp-full-screen",
				restoreScreen: ".jp-restore-screen",
				repeat: ".jp-repeat",
				repeatOff: ".jp-repeat-off",
				gui: ".jp-gui",
				noSolution: ".jp-no-solution"
			},
			fullScreen: !1,
			autohide: {
				restored: !1,
				full: !0,
				fadeIn: 200,
				fadeOut: 600,
				hold: 1E3
			},
			loop: !1,
			repeat: function(a) {
				a.jPlayer.options.loop ? b(this).unbind(".jPlayerRepeat").bind(b.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
					b(this).jPlayer("play")
				}) : b(this).unbind(".jPlayerRepeat")
			},
			nativeVideoControls: {},
			noFullScreen: {
				msie: /msie [0-6]/,
				ipad: /ipad.*?os [0-4]/,
				iphone: /iphone/,
				ipod: /ipod/,
				android_pad: /android [0-3](?!.*?mobile)/,
				android_phone: /android.*?mobile/,
				blackberry: /blackberry/,
				windows_ce: /windows ce/,
				webos: /webos/
			},
			noVolume: {
				ipad: /ipad/,
				iphone: /iphone/,
				ipod: /ipod/,
				android_pad: /android(?!.*?mobile)/,
				android_phone: /android.*?mobile/,
				blackberry: /blackberry/,
				windows_ce: /windows ce/,
				webos: /webos/,
				playbook: /playbook/
			},
			verticalVolume: !1,
			idPrefix: "jp",
			noConflict: "jQuery",
			emulateHtml: !1,
			errorAlerts: !1,
			warningAlerts: !1
		},
		optionsAudio: {
			size: {
				width: "0px",
				height: "0px",
				cssClass: ""
			},
			sizeFull: {
				width: "0px",
				height: "0px",
				cssClass: ""
			}
		},
		optionsVideo: {
			size: {
				width: "480px",
				height: "270px",
				cssClass: "jp-video-270p"
			},
			sizeFull: {
				width: "100%",
				height: "100%",
				cssClass: "jp-video-full"
			}
		},
		instances: {},
		status: {
			src: "",
			media: {},
			paused: !0,
			format: {},
			formatType: "",
			waitForPlay: !0,
			waitForLoad: !0,
			srcSet: !1,
			video: !1,
			seekPercent: 0,
			currentPercentRelative: 0,
			currentPercentAbsolute: 0,
			currentTime: 0,
			duration: 0,
			readyState: 0,
			networkState: 0,
			playbackRate: 1,
			ended: 0
		},
		internal: {
			ready: !1
		},
		solution: {
			html: !0,
			flash: !0
		},
		format: {
			mp3: {
				codec: 'audio/mpeg; codecs="mp3"',
				flashCanPlay: !0,
				media: "audio"
			},
			m4a: {
				codec: 'audio/mp4; codecs="mp4a.40.2"',
				flashCanPlay: !0,
				media: "audio"
			},
			oga: {
				codec: 'audio/ogg; codecs="vorbis"',
				flashCanPlay: !1,
				media: "audio"
			},
			wav: {
				codec: 'audio/wav; codecs="1"',
				flashCanPlay: !1,
				media: "audio"
			},
			webma: {
				codec: 'audio/webm; codecs="vorbis"',
				flashCanPlay: !1,
				media: "audio"
			},
			fla: {
				codec: "audio/x-flv",
				flashCanPlay: !0,
				media: "audio"
			},
			rtmpa: {
				codec: 'audio/rtmp; codecs="rtmp"',
				flashCanPlay: !0,
				media: "audio"
			},
			m4v: {
				codec: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
				flashCanPlay: !0,
				media: "video"
			},
			ogv: {
				codec: 'video/ogg; codecs="theora, vorbis"',
				flashCanPlay: !1,
				media: "video"
			},
			webmv: {
				codec: 'video/webm; codecs="vorbis, vp8"',
				flashCanPlay: !1,
				media: "video"
			},
			flv: {
				codec: "video/x-flv",
				flashCanPlay: !0,
				media: "video"
			},
			rtmpv: {
				codec: 'video/rtmp; codecs="rtmp"',
				flashCanPlay: !0,
				media: "video"
			}
		},
		_init: function() {
			var a = this;
			this.element.empty();
			this.status = b.extend({}, this.status);
			this.internal = b.extend({}, this.internal);
			this.internal.domNode = this.element.get(0);
			this.formats = [];
			this.solutions = [];
			this.require = {};
			this.htmlElement = {};
			this.html = {};
			this.html.audio = {};
			this.html.video = {};
			this.flash = {};
			this.css = {};
			this.css.cs = {};
			this.css.jq = {};
			this.ancestorJq = [];
			this.options.volume = this._limitValue(this.options.volume, 0, 1);
			b.each(this.options.supplied.toLowerCase().split(","), function(c, d) {
				var e = d.replace(/^\s+|\s+$/g, "");
				if (a.format[e]) {
					var f = false;
					b.each(a.formats, function(a, b) {
						if (e === b) {
							f = true;
							return false
						}
					});
					f || a.formats.push(e)
				}
			});
			b.each(this.options.solution.toLowerCase().split(","), function(c, d) {
				var e =
					d.replace(/^\s+|\s+$/g, "");
				if (a.solution[e]) {
					var f = false;
					b.each(a.solutions, function(a, b) {
						if (e === b) {
							f = true;
							return false
						}
					});
					f || a.solutions.push(e)
				}
			});
			this.internal.instance = "jp_" + this.count;
			this.instances[this.internal.instance] = this.element;
			this.element.attr("id") || this.element.attr("id", this.options.idPrefix + "_jplayer_" + this.count);
			this.internal.self = b.extend({}, {
				id: this.element.attr("id"),
				jq: this.element
			});
			this.internal.audio = b.extend({}, {
				id: this.options.idPrefix + "_audio_" + this.count,
				jq: f
			});
			this.internal.video =
				b.extend({}, {
					id: this.options.idPrefix + "_video_" + this.count,
					jq: f
				});
			this.internal.flash = b.extend({}, {
				id: this.options.idPrefix + "_flash_" + this.count,
				jq: f,
				swf: this.options.swfPath + (this.options.swfPath.toLowerCase().slice(-4) !== ".swf" ? (this.options.swfPath && this.options.swfPath.slice(-1) !== "/" ? "/" : "") + "Jplayer.swf" : "")
			});
			this.internal.poster = b.extend({}, {
				id: this.options.idPrefix + "_poster_" + this.count,
				jq: f
			});
			b.each(b.jPlayer.event, function(b, c) {
				if (a.options[b] !== f) {
					a.element.bind(c + ".jPlayer", a.options[b]);
					a.options[b] = f
				}
			});
			this.require.audio = false;
			this.require.video = false;
			b.each(this.formats, function(b, c) {
				a.require[a.format[c].media] = true
			});
			this.options = this.require.video ? b.extend(true, {}, this.optionsVideo, this.options) : b.extend(true, {}, this.optionsAudio, this.options);
			this._setSize();
			this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
			this.status.noFullScreen = this._uaBlocklist(this.options.noFullScreen);
			this.status.noVolume = this._uaBlocklist(this.options.noVolume);
			this._restrictNativeVideoControls();
			this.htmlElement.poster = document.createElement("img");
			this.htmlElement.poster.id = this.internal.poster.id;
			this.htmlElement.poster.onload = function() {
				(!a.status.video || a.status.waitForPlay) && a.internal.poster.jq.show()
			};
			this.element.append(this.htmlElement.poster);
			this.internal.poster.jq = b("#" + this.internal.poster.id);
			this.internal.poster.jq.css({
				width: this.status.width,
				height: this.status.height
			});
			this.internal.poster.jq.hide();
			this.internal.poster.jq.bind("click.jPlayer", function() {
				a._trigger(b.jPlayer.event.click)
			});
			this.html.audio.available = false;
			if (this.require.audio) {
				this.htmlElement.audio = document.createElement("audio");
				this.htmlElement.audio.id = this.internal.audio.id;
				this.html.audio.available = !!this.htmlElement.audio.canPlayType && this._testCanPlayType(this.htmlElement.audio)
			}
			this.html.video.available = false;
			if (this.require.video) {
				this.htmlElement.video = document.createElement("video");
				this.htmlElement.video.id = this.internal.video.id;
				this.html.video.available = !!this.htmlElement.video.canPlayType && this._testCanPlayType(this.htmlElement.video)
			}
			this.flash.available =
				this._checkForFlash(10);
			this.html.canPlay = {};
			this.flash.canPlay = {};
			b.each(this.formats, function(b, c) {
				a.html.canPlay[c] = a.html[a.format[c].media].available && "" !== a.htmlElement[a.format[c].media].canPlayType(a.format[c].codec);
				a.flash.canPlay[c] = a.format[c].flashCanPlay && a.flash.available
			});
			this.html.desired = false;
			this.flash.desired = false;
			b.each(this.solutions, function(c, d) {
				if (c === 0) a[d].desired = true;
				else {
					var e = false,
						f = false;
					b.each(a.formats, function(b, c) {
						a[a.solutions[0]].canPlay[c] && (a.format[c].media ===
							"video" ? f = true : e = true)
					});
					a[d].desired = a.require.audio && !e || a.require.video && !f
				}
			});
			this.html.support = {};
			this.flash.support = {};
			b.each(this.formats, function(b, c) {
				a.html.support[c] = a.html.canPlay[c] && a.html.desired;
				a.flash.support[c] = a.flash.canPlay[c] && a.flash.desired
			});
			this.html.used = false;
			this.flash.used = false;
			b.each(this.solutions, function(c, d) {
				b.each(a.formats, function(b, c) {
					if (a[d].support[c]) {
						a[d].used = true;
						return false
					}
				})
			});
			this._resetActive();
			this._resetGate();
			this._cssSelectorAncestor(this.options.cssSelectorAncestor);
			if (!this.html.used && !this.flash.used) {
				this._error({
					type: b.jPlayer.error.NO_SOLUTION,
					context: "{solution:'" + this.options.solution + "', supplied:'" + this.options.supplied + "'}",
					message: b.jPlayer.errorMsg.NO_SOLUTION,
					hint: b.jPlayer.errorHint.NO_SOLUTION
				});
				this.css.jq.noSolution.length && this.css.jq.noSolution.show()
			} else this.css.jq.noSolution.length && this.css.jq.noSolution.hide();
			if (this.flash.used) {
				var c, d = "jQuery=" + encodeURI(this.options.noConflict) + "&id=" + encodeURI(this.internal.self.id) + "&vol=" + this.options.volume +
					"&muted=" + this.options.muted;
				if (b.jPlayer.browser.msie && Number(b.jPlayer.browser.version) <= 8) {
					d = ['<param name="movie" value="' + this.internal.flash.swf + '" />', '<param name="FlashVars" value="' + d + '" />', '<param name="allowScriptAccess" value="always" />', '<param name="bgcolor" value="' + this.options.backgroundColor + '" />', '<param name="wmode" value="' + this.options.wmode + '" />'];
					c = document.createElement('<object id="' + this.internal.flash.id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0"></object>');
					for (var e = 0; e < d.length; e++) c.appendChild(document.createElement(d[e]))
				} else {
					e = function(a, b, c) {
						var d = document.createElement("param");
						d.setAttribute("name", b);
						d.setAttribute("value", c);
						a.appendChild(d)
					};
					c = document.createElement("object");
					c.setAttribute("id", this.internal.flash.id);
					c.setAttribute("data", this.internal.flash.swf);
					c.setAttribute("type", "application/x-shockwave-flash");
					c.setAttribute("width", "1");
					c.setAttribute("height", "1");
					e(c, "flashvars", d);
					e(c, "allowscriptaccess", "always");
					e(c, "bgcolor",
						this.options.backgroundColor);
					e(c, "wmode", this.options.wmode)
				}
				this.element.append(c);
				this.internal.flash.jq = b(c)
			}
			if (this.html.used) {
				if (this.html.audio.available) {
					this._addHtmlEventListeners(this.htmlElement.audio, this.html.audio);
					this.element.append(this.htmlElement.audio);
					this.internal.audio.jq = b("#" + this.internal.audio.id)
				}
				if (this.html.video.available) {
					this._addHtmlEventListeners(this.htmlElement.video, this.html.video);
					this.element.append(this.htmlElement.video);
					this.internal.video.jq = b("#" + this.internal.video.id);
					this.status.nativeVideoControls ? this.internal.video.jq.css({
						width: this.status.width,
						height: this.status.height
					}) : this.internal.video.jq.css({
						width: "0px",
						height: "0px"
					});
					this.internal.video.jq.bind("click.jPlayer", function() {
						a._trigger(b.jPlayer.event.click)
					})
				}
			}
			this.options.emulateHtml && this._emulateHtmlBridge();
			this.html.used && !this.flash.used && setTimeout(function() {
				a.internal.ready = true;
				a.version.flash = "n/a";
				a._trigger(b.jPlayer.event.repeat);
				a._trigger(b.jPlayer.event.ready)
			}, 100);
			this._updateNativeVideoControls();
			this._updateInterface();
			this._updateButtons(false);
			this._updateAutohide();
			this._updateVolume(this.options.volume);
			this._updateMute(this.options.muted);
			this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide();
			b.jPlayer.prototype.count++
		},
		destroy: function() {
			this.clearMedia();
			this._removeUiClass();
			this.css.jq.currentTime.length && this.css.jq.currentTime.text("");
			this.css.jq.duration.length && this.css.jq.duration.text("");
			b.each(this.css.jq, function(a, b) {
				b.length && b.unbind(".jPlayer")
			});
			this.internal.poster.jq.unbind(".jPlayer");
			this.internal.video.jq && this.internal.video.jq.unbind(".jPlayer");
			this.options.emulateHtml && this._destroyHtmlBridge();
			this.element.removeData("jPlayer");
			this.element.unbind(".jPlayer");
			this.element.empty();
			delete this.instances[this.internal.instance]
		},
		enable: function() {},
		disable: function() {},
		_testCanPlayType: function(a) {
			try {
				a.canPlayType(this.format.mp3.codec);
				return true
			} catch (b) {
				return false
			}
		},
		_uaBlocklist: function(a) {
			var c = navigator.userAgent.toLowerCase(),
				d = false;
			b.each(a, function(a, b) {
				if (b &&
					b.test(c)) {
					d = true;
					return false
				}
			});
			return d
		},
		_restrictNativeVideoControls: function() {
			if (this.require.audio && this.status.nativeVideoControls) {
				this.status.nativeVideoControls = false;
				this.status.noFullScreen = true
			}
		},
		_updateNativeVideoControls: function() {
			if (this.html.video.available && this.html.used) {
				this.htmlElement.video.controls = this.status.nativeVideoControls;
				this._updateAutohide();
				if (this.status.nativeVideoControls && this.require.video) {
					this.internal.poster.jq.hide();
					this.internal.video.jq.css({
						width: this.status.width,
						height: this.status.height
					})
				} else if (this.status.waitForPlay && this.status.video) {
					this.internal.poster.jq.show();
					this.internal.video.jq.css({
						width: "0px",
						height: "0px"
					})
				}
			}
		},
		_addHtmlEventListeners: function(a, c) {
			var d = this;
			a.preload = this.options.preload;
			a.muted = this.options.muted;
			a.volume = this.options.volume;
			a.addEventListener("progress", function() {
				if (c.gate) {
					d._getHtmlStatus(a);
					d._updateInterface();
					d._trigger(b.jPlayer.event.progress)
				}
			}, false);
			a.addEventListener("timeupdate", function() {
				if (c.gate) {
					d._getHtmlStatus(a);
					d._updateInterface();
					d._trigger(b.jPlayer.event.timeupdate)
				}
			}, false);
			a.addEventListener("durationchange", function() {
				if (c.gate) {
					d._getHtmlStatus(a);
					d._updateInterface();
					d._trigger(b.jPlayer.event.durationchange)
				}
			}, false);
			a.addEventListener("play", function() {
				if (c.gate) {
					d._updateButtons(true);
					d._html_checkWaitForPlay();
					d._trigger(b.jPlayer.event.play)
				}
			}, false);
			a.addEventListener("playing", function() {
				if (c.gate) {
					d._updateButtons(true);
					d._seeked();
					d._trigger(b.jPlayer.event.playing)
				}
			}, false);
			a.addEventListener("pause",
				function() {
					if (c.gate) {
						d._updateButtons(false);
						d._trigger(b.jPlayer.event.pause)
					}
				}, false);
			a.addEventListener("waiting", function() {
				if (c.gate) {
					d._seeking();
					d._trigger(b.jPlayer.event.waiting)
				}
			}, false);
			a.addEventListener("seeking", function() {
				if (c.gate) {
					d._seeking();
					d._trigger(b.jPlayer.event.seeking)
				}
			}, false);
			a.addEventListener("seeked", function() {
				if (c.gate) {
					d._seeked();
					d._trigger(b.jPlayer.event.seeked)
				}
			}, false);
			a.addEventListener("volumechange", function() {
				if (c.gate) {
					d.options.volume = a.volume;
					d.options.muted =
						a.muted;
					d._updateMute();
					d._updateVolume();
					d._trigger(b.jPlayer.event.volumechange)
				}
			}, false);
			a.addEventListener("suspend", function() {
				if (c.gate) {
					d._seeked();
					d._trigger(b.jPlayer.event.suspend)
				}
			}, false);
			a.addEventListener("ended", function() {
				if (c.gate) {
					if (!b.jPlayer.browser.webkit) d.htmlElement.media.currentTime = 0;
					d.htmlElement.media.pause();
					d._updateButtons(false);
					d._getHtmlStatus(a, true);
					d._updateInterface();
					d._trigger(b.jPlayer.event.ended)
				}
			}, false);
			a.addEventListener("error", function() {
				if (c.gate) {
					d._updateButtons(false);
					d._seeked();
					if (d.status.srcSet) {
						clearTimeout(d.internal.htmlDlyCmdId);
						d.status.waitForLoad = true;
						d.status.waitForPlay = true;
						d.status.video && !d.status.nativeVideoControls && d.internal.video.jq.css({
							width: "0px",
							height: "0px"
						});
						d._validString(d.status.media.poster) && !d.status.nativeVideoControls && d.internal.poster.jq.show();
						d.css.jq.videoPlay.length && d.css.jq.videoPlay.show();
						d._error({
							type: b.jPlayer.error.URL,
							context: d.status.src,
							message: b.jPlayer.errorMsg.URL,
							hint: b.jPlayer.errorHint.URL
						})
					}
				}
			}, false);
			b.each(b.jPlayer.htmlEvent,
				function(e, g) {
					a.addEventListener(this, function() {
						c.gate && d._trigger(b.jPlayer.event[g])
					}, false)
				})
		},
		_getHtmlStatus: function(a, b) {
			var d = 0,
				e = 0,
				g = 0,
				f = 0;
			if (isFinite(a.duration)) this.status.duration = a.duration;
			d = a.currentTime;
			e = this.status.duration > 0 ? 100 * d / this.status.duration : 0;
			if (typeof a.seekable === "object" && a.seekable.length > 0) {
				g = this.status.duration > 0 ? 100 * a.seekable.end(a.seekable.length - 1) / this.status.duration : 100;
				f = this.status.duration > 0 ? 100 * a.currentTime / a.seekable.end(a.seekable.length - 1) : 0
			} else {
				g =
					100;
				f = e
			}
			if (b) e = f = d = 0;
			this.status.seekPercent = g;
			this.status.currentPercentRelative = f;
			this.status.currentPercentAbsolute = e;
			this.status.currentTime = d;
			this.status.readyState = a.readyState;
			this.status.networkState = a.networkState;
			this.status.playbackRate = a.playbackRate;
			this.status.ended = a.ended
		},
		_resetStatus: function() {
			this.status = b.extend({}, this.status, b.jPlayer.prototype.status)
		},
		_trigger: function(a, c, d) {
			a = b.Event(a);
			a.jPlayer = {};
			a.jPlayer.version = b.extend({}, this.version);
			a.jPlayer.options = b.extend(true, {}, this.options);
			a.jPlayer.status = b.extend(true, {}, this.status);
			a.jPlayer.html = b.extend(true, {}, this.html);
			a.jPlayer.flash = b.extend(true, {}, this.flash);
			if (c) a.jPlayer.error = b.extend({}, c);
			if (d) a.jPlayer.warning = b.extend({}, d);
			this.element.trigger(a)
		},
		jPlayerFlashEvent: function(a, c) {
			if (a === b.jPlayer.event.ready)
				if (this.internal.ready) {
					if (this.flash.gate) {
						if (this.status.srcSet) {
							var d = this.status.currentTime,
								e = this.status.paused;
							this.setMedia(this.status.media);
							d > 0 && (e ? this.pause(d) : this.play(d))
						}
						this._trigger(b.jPlayer.event.flashreset)
					}
				} else {
					this.internal.ready =
						true;
					this.internal.flash.jq.css({
						width: "0px",
						height: "0px"
					});
					this.version.flash = c.version;
					this.version.needFlash !== this.version.flash && this._error({
						type: b.jPlayer.error.VERSION,
						context: this.version.flash,
						message: b.jPlayer.errorMsg.VERSION + this.version.flash,
						hint: b.jPlayer.errorHint.VERSION
					});
					this._trigger(b.jPlayer.event.repeat);
					this._trigger(a)
				}
			if (this.flash.gate) switch (a) {
				case b.jPlayer.event.progress:
					this._getFlashStatus(c);
					this._updateInterface();
					this._trigger(a);
					break;
				case b.jPlayer.event.timeupdate:
					this._getFlashStatus(c);
					this._updateInterface();
					this._trigger(a);
					break;
				case b.jPlayer.event.play:
					this._seeked();
					this._updateButtons(true);
					this._trigger(a);
					break;
				case b.jPlayer.event.pause:
					this._updateButtons(false);
					this._trigger(a);
					break;
				case b.jPlayer.event.ended:
					this._updateButtons(false);
					this._trigger(a);
					break;
				case b.jPlayer.event.click:
					this._trigger(a);
					break;
				case b.jPlayer.event.error:
					this.status.waitForLoad = true;
					this.status.waitForPlay = true;
					this.status.video && this.internal.flash.jq.css({
						width: "0px",
						height: "0px"
					});
					this._validString(this.status.media.poster) &&
						this.internal.poster.jq.show();
					this.css.jq.videoPlay.length && this.status.video && this.css.jq.videoPlay.show();
					this.status.video ? this._flash_setVideo(this.status.media) : this._flash_setAudio(this.status.media);
					this._updateButtons(false);
					this._error({
						type: b.jPlayer.error.URL,
						context: c.src,
						message: b.jPlayer.errorMsg.URL,
						hint: b.jPlayer.errorHint.URL
					});
					break;
				case b.jPlayer.event.seeking:
					this._seeking();
					this._trigger(a);
					break;
				case b.jPlayer.event.seeked:
					this._seeked();
					this._trigger(a);
					break;
				case b.jPlayer.event.ready:
					break;
				default:
					this._trigger(a)
			}
			return false
		},
		_getFlashStatus: function(a) {
			this.status.seekPercent = a.seekPercent;
			this.status.currentPercentRelative = a.currentPercentRelative;
			this.status.currentPercentAbsolute = a.currentPercentAbsolute;
			this.status.currentTime = a.currentTime;
			this.status.duration = a.duration;
			this.status.readyState = 4;
			this.status.networkState = 0;
			this.status.playbackRate = 1;
			this.status.ended = false
		},
		_updateButtons: function(a) {
			if (a !== f) {
				this.status.paused = !a;
				if (this.css.jq.play.length && this.css.jq.pause.length)
					if (a) {
						this.css.jq.play.hide();
						this.css.jq.pause.show()
					} else {
						this.css.jq.play.show();
						this.css.jq.pause.hide()
					}
			}
			if (this.css.jq.restoreScreen.length && this.css.jq.fullScreen.length)
				if (this.status.noFullScreen) {
					this.css.jq.fullScreen.hide();
					this.css.jq.restoreScreen.hide()
				} else if (this.options.fullScreen) {
				this.css.jq.fullScreen.hide();
				this.css.jq.restoreScreen.show()
			} else {
				this.css.jq.fullScreen.show();
				this.css.jq.restoreScreen.hide()
			}
			if (this.css.jq.repeat.length && this.css.jq.repeatOff.length)
				if (this.options.loop) {
					this.css.jq.repeat.hide();
					this.css.jq.repeatOff.show()
				} else {
					this.css.jq.repeat.show();
					this.css.jq.repeatOff.hide()
				}
		},
		_updateInterface: function() {
			this.css.jq.seekBar.length && this.css.jq.seekBar.width(this.status.seekPercent + "%");
			this.css.jq.playBar.length && this.css.jq.playBar.width(this.status.currentPercentRelative + "%");
			this.css.jq.currentTime.length && this.css.jq.currentTime.text(b.jPlayer.convertTime(this.status.currentTime));
			this.css.jq.duration.length && this.css.jq.duration.text(b.jPlayer.convertTime(this.status.duration))
		},
		_seeking: function() {
			this.css.jq.seekBar.length && this.css.jq.seekBar.addClass("jp-seeking-bg")
		},
		_seeked: function() {
			this.css.jq.seekBar.length && this.css.jq.seekBar.removeClass("jp-seeking-bg")
		},
		_resetGate: function() {
			this.html.audio.gate = false;
			this.html.video.gate = false;
			this.flash.gate = false
		},
		_resetActive: function() {
			this.html.active = false;
			this.flash.active = false
		},
		setMedia: function(a) {
			var c = this,
				d = false,
				e = this.status.media.poster !== a.poster;
			this._resetMedia();
			this._resetGate();
			this._resetActive();
			b.each(this.formats,
				function(e, f) {
					var i = c.format[f].media === "video";
					b.each(c.solutions, function(b, e) {
						if (c[e].support[f] && c._validString(a[f])) {
							var g = e === "html";
							if (i) {
								if (g) {
									c.html.video.gate = true;
									c._html_setVideo(a);
									c.html.active = true
								} else {
									c.flash.gate = true;
									c._flash_setVideo(a);
									c.flash.active = true
								}
								c.css.jq.videoPlay.length && c.css.jq.videoPlay.show();
								c.status.video = true
							} else {
								if (g) {
									c.html.audio.gate = true;
									c._html_setAudio(a);
									c.html.active = true
								} else {
									c.flash.gate = true;
									c._flash_setAudio(a);
									c.flash.active = true
								}
								c.css.jq.videoPlay.length &&
									c.css.jq.videoPlay.hide();
								c.status.video = false
							}
							d = true;
							return false
						}
					});
					if (d) return false
				});
			if (d) {
				if ((!this.status.nativeVideoControls || !this.html.video.gate) && this._validString(a.poster)) e ? this.htmlElement.poster.src = a.poster : this.internal.poster.jq.show();
				this.status.srcSet = true;
				this.status.media = b.extend({}, a);
				this._updateButtons(false);
				this._updateInterface()
			} else this._error({
				type: b.jPlayer.error.NO_SUPPORT,
				context: "{supplied:'" + this.options.supplied + "'}",
				message: b.jPlayer.errorMsg.NO_SUPPORT,
				hint: b.jPlayer.errorHint.NO_SUPPORT
			})
		},
		_resetMedia: function() {
			this._resetStatus();
			this._updateButtons(false);
			this._updateInterface();
			this._seeked();
			this.internal.poster.jq.hide();
			clearTimeout(this.internal.htmlDlyCmdId);
			this.html.active ? this._html_resetMedia() : this.flash.active && this._flash_resetMedia()
		},
		clearMedia: function() {
			this._resetMedia();
			this.html.active ? this._html_clearMedia() : this.flash.active && this._flash_clearMedia();
			this._resetGate();
			this._resetActive()
		},
		load: function() {
			this.status.srcSet ?
				this.html.active ? this._html_load() : this.flash.active && this._flash_load() : this._urlNotSetError("load")
		},
		play: function(a) {
			a = typeof a === "number" ? a : NaN;
			this.status.srcSet ? this.html.active ? this._html_play(a) : this.flash.active && this._flash_play(a) : this._urlNotSetError("play")
		},
		videoPlay: function() {
			this.play()
		},
		pause: function(a) {
			a = typeof a === "number" ? a : NaN;
			this.status.srcSet ? this.html.active ? this._html_pause(a) : this.flash.active && this._flash_pause(a) : this._urlNotSetError("pause")
		},
		pauseOthers: function() {
			var a =
				this;
			b.each(this.instances, function(b, d) {
				a.element !== d && d.data("jPlayer").status.srcSet && d.jPlayer("pause")
			})
		},
		stop: function() {
			this.status.srcSet ? this.html.active ? this._html_pause(0) : this.flash.active && this._flash_pause(0) : this._urlNotSetError("stop")
		},
		playHead: function(a) {
			a = this._limitValue(a, 0, 100);
			this.status.srcSet ? this.html.active ? this._html_playHead(a) : this.flash.active && this._flash_playHead(a) : this._urlNotSetError("playHead")
		},
		_muted: function(a) {
			this.options.muted = a;
			this.html.used && this._html_mute(a);
			this.flash.used && this._flash_mute(a);
			if (!this.html.video.gate && !this.html.audio.gate) {
				this._updateMute(a);
				this._updateVolume(this.options.volume);
				this._trigger(b.jPlayer.event.volumechange)
			}
		},
		mute: function(a) {
			a = a === f ? true : !!a;
			this._muted(a)
		},
		unmute: function(a) {
			a = a === f ? true : !!a;
			this._muted(!a)
		},
		_updateMute: function(a) {
			if (a === f) a = this.options.muted;
			if (this.css.jq.mute.length && this.css.jq.unmute.length)
				if (this.status.noVolume) {
					this.css.jq.mute.hide();
					this.css.jq.unmute.hide()
				} else if (a) {
				this.css.jq.mute.hide();
				this.css.jq.unmute.show()
			} else {
				this.css.jq.mute.show();
				this.css.jq.unmute.hide()
			}
		},
		volume: function(a) {
			a = this._limitValue(a, 0, 1);
			this.options.volume = a;
			this.html.used && this._html_volume(a);
			this.flash.used && this._flash_volume(a);
			if (!this.html.video.gate && !this.html.audio.gate) {
				this._updateVolume(a);
				this._trigger(b.jPlayer.event.volumechange)
			}
		},
		volumeBar: function(a) {
			if (this.css.jq.volumeBar.length) {
				var b = this.css.jq.volumeBar.offset(),
					d = a.pageX - b.left,
					e = this.css.jq.volumeBar.width(),
					a = this.css.jq.volumeBar.height() -
					a.pageY + b.top,
					b = this.css.jq.volumeBar.height();
				this.options.verticalVolume ? this.volume(a / b) : this.volume(d / e)
			}
			this.options.muted && this._muted(false)
		},
		volumeBarValue: function(a) {
			this.volumeBar(a)
		},
		_updateVolume: function(a) {
			if (a === f) a = this.options.volume;
			a = this.options.muted ? 0 : a;
			if (this.status.noVolume) {
				this.css.jq.volumeBar.length && this.css.jq.volumeBar.hide();
				this.css.jq.volumeBarValue.length && this.css.jq.volumeBarValue.hide();
				this.css.jq.volumeMax.length && this.css.jq.volumeMax.hide()
			} else {
				this.css.jq.volumeBar.length &&
					this.css.jq.volumeBar.show();
				if (this.css.jq.volumeBarValue.length) {
					this.css.jq.volumeBarValue.show();
					this.css.jq.volumeBarValue[this.options.verticalVolume ? "height" : "width"](a * 100 + "%")
				}
				this.css.jq.volumeMax.length && this.css.jq.volumeMax.show()
			}
		},
		volumeMax: function() {
			this.volume(1);
			this.options.muted && this._muted(false)
		},
		_cssSelectorAncestor: function(a) {
			var c = this;
			this.options.cssSelectorAncestor = a;
			this._removeUiClass();
			this.ancestorJq = a ? b(a) : [];
			a && this.ancestorJq.length !== 1 && this._warning({
				type: b.jPlayer.warning.CSS_SELECTOR_COUNT,
				context: a,
				message: b.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.ancestorJq.length + " found for cssSelectorAncestor.",
				hint: b.jPlayer.warningHint.CSS_SELECTOR_COUNT
			});
			this._addUiClass();
			b.each(this.options.cssSelector, function(a, b) {
				c._cssSelector(a, b)
			})
		},
		_cssSelector: function(a, c) {
			var d = this;
			if (typeof c === "string")
				if (b.jPlayer.prototype.options.cssSelector[a]) {
					this.css.jq[a] && this.css.jq[a].length && this.css.jq[a].unbind(".jPlayer");
					this.options.cssSelector[a] = c;
					this.css.cs[a] = this.options.cssSelectorAncestor +
						" " + c;
					this.css.jq[a] = c ? b(this.css.cs[a]) : [];
					this.css.jq[a].length && this.css.jq[a].bind("click.jPlayer", function(c) {
						d[a](c);
						b(this).blur();
						return false
					});
					c && this.css.jq[a].length !== 1 && this._warning({
						type: b.jPlayer.warning.CSS_SELECTOR_COUNT,
						context: this.css.cs[a],
						message: b.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.css.jq[a].length + " found for " + a + " method.",
						hint: b.jPlayer.warningHint.CSS_SELECTOR_COUNT
					})
				} else this._warning({
					type: b.jPlayer.warning.CSS_SELECTOR_METHOD,
					context: a,
					message: b.jPlayer.warningMsg.CSS_SELECTOR_METHOD,
					hint: b.jPlayer.warningHint.CSS_SELECTOR_METHOD
				});
			else this._warning({
				type: b.jPlayer.warning.CSS_SELECTOR_STRING,
				context: c,
				message: b.jPlayer.warningMsg.CSS_SELECTOR_STRING,
				hint: b.jPlayer.warningHint.CSS_SELECTOR_STRING
			})
		},
		seekBar: function(a) {
			if (this.css.jq.seekBar) {
				var b = this.css.jq.seekBar.offset(),
					a = a.pageX - b.left,
					b = this.css.jq.seekBar.width();
				this.playHead(100 * a / b)
			}
		},
		playBar: function(a) {
			this.seekBar(a)
		},
		repeat: function() {
			this._loop(true)
		},
		repeatOff: function() {
			this._loop(false)
		},
		_loop: function(a) {
			if (this.options.loop !==
				a) {
				this.options.loop = a;
				this._updateButtons();
				this._trigger(b.jPlayer.event.repeat)
			}
		},
		currentTime: function() {},
		duration: function() {},
		gui: function() {},
		noSolution: function() {},
		option: function(a, c) {
			var d = a;
			if (arguments.length === 0) return b.extend(true, {}, this.options);
			if (typeof a === "string") {
				var e = a.split(".");
				if (c === f) {
					for (var d = b.extend(true, {}, this.options), g = 0; g < e.length; g++)
						if (d[e[g]] !== f) d = d[e[g]];
						else {
							this._warning({
								type: b.jPlayer.warning.OPTION_KEY,
								context: a,
								message: b.jPlayer.warningMsg.OPTION_KEY,
								hint: b.jPlayer.warningHint.OPTION_KEY
							});
							return f
						}
					return d
				}
				for (var g = d = {}, h = 0; h < e.length; h++)
					if (h < e.length - 1) {
						g[e[h]] = {};
						g = g[e[h]]
					} else g[e[h]] = c
			}
			this._setOptions(d);
			return this
		},
		_setOptions: function(a) {
			var c = this;
			b.each(a, function(a, b) {
				c._setOption(a, b)
			});
			return this
		},
		_setOption: function(a, c) {
			var d = this;
			switch (a) {
				case "volume":
					this.volume(c);
					break;
				case "muted":
					this._muted(c);
					break;
				case "cssSelectorAncestor":
					this._cssSelectorAncestor(c);
					break;
				case "cssSelector":
					b.each(c, function(a, b) {
						d._cssSelector(a,
							b)
					});
					break;
				case "fullScreen":
					if (this.options[a] !== c) {
						this._removeUiClass();
						this.options[a] = c;
						this._refreshSize()
					}
					break;
				case "size":
					!this.options.fullScreen && this.options[a].cssClass !== c.cssClass && this._removeUiClass();
					this.options[a] = b.extend({}, this.options[a], c);
					this._refreshSize();
					break;
				case "sizeFull":
					this.options.fullScreen && this.options[a].cssClass !== c.cssClass && this._removeUiClass();
					this.options[a] = b.extend({}, this.options[a], c);
					this._refreshSize();
					break;
				case "autohide":
					this.options[a] = b.extend({},
						this.options[a], c);
					this._updateAutohide();
					break;
				case "loop":
					this._loop(c);
					break;
				case "nativeVideoControls":
					this.options[a] = b.extend({}, this.options[a], c);
					this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
					this._restrictNativeVideoControls();
					this._updateNativeVideoControls();
					break;
				case "noFullScreen":
					this.options[a] = b.extend({}, this.options[a], c);
					this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
					this.status.noFullScreen = this._uaBlocklist(this.options.noFullScreen);
					this._restrictNativeVideoControls();
					this._updateButtons();
					break;
				case "noVolume":
					this.options[a] = b.extend({}, this.options[a], c);
					this.status.noVolume = this._uaBlocklist(this.options.noVolume);
					this._updateVolume();
					this._updateMute();
					break;
				case "emulateHtml":
					if (this.options[a] !== c)(this.options[a] = c) ? this._emulateHtmlBridge() : this._destroyHtmlBridge()
			}
			return this
		},
		_refreshSize: function() {
			this._setSize();
			this._addUiClass();
			this._updateSize();
			this._updateButtons();
			this._updateAutohide();
			this._trigger(b.jPlayer.event.resize)
		},
		_setSize: function() {
			if (this.options.fullScreen) {
				this.status.width = this.options.sizeFull.width;
				this.status.height = this.options.sizeFull.height;
				this.status.cssClass = this.options.sizeFull.cssClass
			} else {
				this.status.width = this.options.size.width;
				this.status.height = this.options.size.height;
				this.status.cssClass = this.options.size.cssClass
			}
			this.element.css({
				width: this.status.width,
				height: this.status.height
			})
		},
		_addUiClass: function() {
			this.ancestorJq.length && this.ancestorJq.addClass(this.status.cssClass)
		},
		_removeUiClass: function() {
			this.ancestorJq.length &&
				this.ancestorJq.removeClass(this.status.cssClass)
		},
		_updateSize: function() {
			this.internal.poster.jq.css({
				width: this.status.width,
				height: this.status.height
			});
			!this.status.waitForPlay && this.html.active && this.status.video || this.html.video.available && this.html.used && this.status.nativeVideoControls ? this.internal.video.jq.css({
				width: this.status.width,
				height: this.status.height
			}) : !this.status.waitForPlay && (this.flash.active && this.status.video) && this.internal.flash.jq.css({
				width: this.status.width,
				height: this.status.height
			})
		},
		_updateAutohide: function() {
			var a = this,
				b = function() {
					a.css.jq.gui.fadeIn(a.options.autohide.fadeIn, function() {
						clearTimeout(a.internal.autohideId);
						a.internal.autohideId = setTimeout(function() {
							a.css.jq.gui.fadeOut(a.options.autohide.fadeOut)
						}, a.options.autohide.hold)
					})
				};
			if (this.css.jq.gui.length) {
				this.css.jq.gui.stop(true, true);
				clearTimeout(this.internal.autohideId);
				this.element.unbind(".jPlayerAutohide");
				this.css.jq.gui.unbind(".jPlayerAutohide");
				if (this.status.nativeVideoControls) this.css.jq.gui.hide();
				else if (this.options.fullScreen && this.options.autohide.full || !this.options.fullScreen && this.options.autohide.restored) {
					this.element.bind("mousemove.jPlayer.jPlayerAutohide", b);
					this.css.jq.gui.bind("mousemove.jPlayer.jPlayerAutohide", b);
					this.css.jq.gui.hide()
				} else this.css.jq.gui.show()
			}
		},
		fullScreen: function() {
			this._setOption("fullScreen", true)
		},
		restoreScreen: function() {
			this._setOption("fullScreen", false)
		},
		_html_initMedia: function() {
			this.htmlElement.media.src = this.status.src;
			this.options.preload !==
				"none" && this._html_load();
			this._trigger(b.jPlayer.event.timeupdate)
		},
		_html_setAudio: function(a) {
			var c = this;
			b.each(this.formats, function(b, e) {
				if (c.html.support[e] && a[e]) {
					c.status.src = a[e];
					c.status.format[e] = true;
					c.status.formatType = e;
					return false
				}
			});
			this.htmlElement.media = this.htmlElement.audio;
			this._html_initMedia()
		},
		_html_setVideo: function(a) {
			var c = this;
			b.each(this.formats, function(b, e) {
				if (c.html.support[e] && a[e]) {
					c.status.src = a[e];
					c.status.format[e] = true;
					c.status.formatType = e;
					return false
				}
			});
			if (this.status.nativeVideoControls) this.htmlElement.video.poster =
				this._validString(a.poster) ? a.poster : "";
			this.htmlElement.media = this.htmlElement.video;
			this._html_initMedia()
		},
		_html_resetMedia: function() {
			if (this.htmlElement.media) {
				this.htmlElement.media.id === this.internal.video.id && !this.status.nativeVideoControls && this.internal.video.jq.css({
					width: "0px",
					height: "0px"
				});
				this.htmlElement.media.pause()
			}
		},
		_html_clearMedia: function() {
			if (this.htmlElement.media) {
				this.htmlElement.media.src = "";
				this.htmlElement.media.load()
			}
		},
		_html_load: function() {
			if (this.status.waitForLoad) {
				this.status.waitForLoad =
					false;
				this.htmlElement.media.load()
			}
			clearTimeout(this.internal.htmlDlyCmdId)
		},
		_html_play: function(a) {
			var b = this;
			this._html_load();
			this.htmlElement.media.play();
			if (!isNaN(a)) try {
				this.htmlElement.media.currentTime = a
			} catch (d) {
				this.internal.htmlDlyCmdId = setTimeout(function() {
					b.play(a)
				}, 100);
				return
			}
			this._html_checkWaitForPlay()
		},
		_html_pause: function(a) {
			var b = this;
			a > 0 ? this._html_load() : clearTimeout(this.internal.htmlDlyCmdId);
			this.htmlElement.media.pause();
			if (!isNaN(a)) try {
				this.htmlElement.media.currentTime =
					a
			} catch (d) {
				this.internal.htmlDlyCmdId = setTimeout(function() {
					b.pause(a)
				}, 100);
				return
			}
			a > 0 && this._html_checkWaitForPlay()
		},
		_html_playHead: function(a) {
			var b = this;
			this._html_load();
			try {
				if (typeof this.htmlElement.media.seekable === "object" && this.htmlElement.media.seekable.length > 0) this.htmlElement.media.currentTime = a * this.htmlElement.media.seekable.end(this.htmlElement.media.seekable.length - 1) / 100;
				else if (this.htmlElement.media.duration > 0 && !isNaN(this.htmlElement.media.duration)) this.htmlElement.media.currentTime =
					a * this.htmlElement.media.duration / 100;
				else throw "e";
			} catch (d) {
				this.internal.htmlDlyCmdId = setTimeout(function() {
					b.playHead(a)
				}, 100);
				return
			}
			this.status.waitForLoad || this._html_checkWaitForPlay()
		},
		_html_checkWaitForPlay: function() {
			if (this.status.waitForPlay) {
				this.status.waitForPlay = false;
				this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide();
				if (this.status.video) {
					this.internal.poster.jq.hide();
					this.internal.video.jq.css({
						width: this.status.width,
						height: this.status.height
					})
				}
			}
		},
		_html_volume: function(a) {
			if (this.html.audio.available) this.htmlElement.audio.volume =
				a;
			if (this.html.video.available) this.htmlElement.video.volume = a
		},
		_html_mute: function(a) {
			if (this.html.audio.available) this.htmlElement.audio.muted = a;
			if (this.html.video.available) this.htmlElement.video.muted = a
		},
		_flash_setAudio: function(a) {
			var c = this;
			try {
				b.each(this.formats, function(b, d) {
					if (c.flash.support[d] && a[d]) {
						switch (d) {
							case "m4a":
							case "fla":
								c._getMovie().fl_setAudio_m4a(a[d]);
								break;
							case "mp3":
								c._getMovie().fl_setAudio_mp3(a[d]);
								break;
							case "rtmpa":
								c._getMovie().fl_setAudio_rtmp(a[d])
						}
						c.status.src =
							a[d];
						c.status.format[d] = true;
						c.status.formatType = d;
						return false
					}
				});
				if (this.options.preload === "auto") {
					this._flash_load();
					this.status.waitForLoad = false
				}
			} catch (d) {
				this._flashError(d)
			}
		},
		_flash_setVideo: function(a) {
			var c = this;
			try {
				b.each(this.formats, function(b, d) {
					if (c.flash.support[d] && a[d]) {
						switch (d) {
							case "m4v":
							case "flv":
								c._getMovie().fl_setVideo_m4v(a[d]);
								break;
							case "rtmpv":
								c._getMovie().fl_setVideo_rtmp(a[d])
						}
						c.status.src = a[d];
						c.status.format[d] = true;
						c.status.formatType = d;
						return false
					}
				});
				if (this.options.preload ===
					"auto") {
					this._flash_load();
					this.status.waitForLoad = false
				}
			} catch (d) {
				this._flashError(d)
			}
		},
		_flash_resetMedia: function() {
			this.internal.flash.jq.css({
				width: "0px",
				height: "0px"
			});
			this._flash_pause(NaN)
		},
		_flash_clearMedia: function() {
			try {
				this._getMovie().fl_clearMedia()
			} catch (a) {
				this._flashError(a)
			}
		},
		_flash_load: function() {
			try {
				this._getMovie().fl_load()
			} catch (a) {
				this._flashError(a)
			}
			this.status.waitForLoad = false
		},
		_flash_play: function(a) {
			try {
				this._getMovie().fl_play(a)
			} catch (b) {
				this._flashError(b)
			}
			this.status.waitForLoad =
				false;
			this._flash_checkWaitForPlay()
		},
		_flash_pause: function(a) {
			try {
				this._getMovie().fl_pause(a)
			} catch (b) {
				this._flashError(b)
			}
			if (a > 0) {
				this.status.waitForLoad = false;
				this._flash_checkWaitForPlay()
			}
		},
		_flash_playHead: function(a) {
			try {
				this._getMovie().fl_play_head(a)
			} catch (b) {
				this._flashError(b)
			}
			this.status.waitForLoad || this._flash_checkWaitForPlay()
		},
		_flash_checkWaitForPlay: function() {
			if (this.status.waitForPlay) {
				this.status.waitForPlay = false;
				this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide();
				if (this.status.video) {
					this.internal.poster.jq.hide();
					this.internal.flash.jq.css({
						width: this.status.width,
						height: this.status.height
					})
				}
			}
		},
		_flash_volume: function(a) {
			try {
				this._getMovie().fl_volume(a)
			} catch (b) {
				this._flashError(b)
			}
		},
		_flash_mute: function(a) {
			try {
				this._getMovie().fl_mute(a)
			} catch (b) {
				this._flashError(b)
			}
		},
		_getMovie: function() {
			return document[this.internal.flash.id]
		},
		_checkForFlash: function(a) {
			var b = false,
				d;
			if (window.ActiveXObject) try {
				new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + a);
				b = true
			} catch (e) {} else if (navigator.plugins && navigator.mimeTypes.length >
				0)(d = navigator.plugins["Shockwave Flash"]) && navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/, "$1") >= a && (b = true);
			return b
		},
		_validString: function(a) {
			return a && typeof a === "string"
		},
		_limitValue: function(a, b, d) {
			return a < b ? b : a > d ? d : a
		},
		_urlNotSetError: function(a) {
			this._error({
				type: b.jPlayer.error.URL_NOT_SET,
				context: a,
				message: b.jPlayer.errorMsg.URL_NOT_SET,
				hint: b.jPlayer.errorHint.URL_NOT_SET
			})
		},
		_flashError: function(a) {
			var c;
			c = this.internal.ready ? "FLASH_DISABLED" : "FLASH";
			this._error({
				type: b.jPlayer.error[c],
				context: this.internal.flash.swf,
				message: b.jPlayer.errorMsg[c] + a.message,
				hint: b.jPlayer.errorHint[c]
			});
			this.internal.flash.jq.css({
				width: "1px",
				height: "1px"
			})
		},
		_error: function(a) {
			this._trigger(b.jPlayer.event.error, a);
			this.options.errorAlerts && this._alert("Error!" + (a.message ? "\n\n" + a.message : "") + (a.hint ? "\n\n" + a.hint : "") + "\n\nContext: " + a.context)
		},
		_warning: function(a) {
			this._trigger(b.jPlayer.event.warning, f, a);
			this.options.warningAlerts && this._alert("Warning!" + (a.message ? "\n\n" + a.message : "") + (a.hint ?
				"\n\n" + a.hint : "") + "\n\nContext: " + a.context)
		},
		_alert: function(a) {
			alert("jPlayer " + this.version.script + " : id='" + this.internal.self.id + "' : " + a)
		},
		_emulateHtmlBridge: function() {
			var a = this;
			b.each(b.jPlayer.emulateMethods.split(/\s+/g), function(b, d) {
				a.internal.domNode[d] = function(b) {
					a[d](b)
				}
			});
			b.each(b.jPlayer.event, function(c, d) {
				var e = true;
				b.each(b.jPlayer.reservedEvent.split(/\s+/g), function(a, b) {
					if (b === c) return e = false
				});
				e && a.element.bind(d + ".jPlayer.jPlayerHtml", function() {
					a._emulateHtmlUpdate();
					var b = document.createEvent("Event");
					b.initEvent(c, false, true);
					a.internal.domNode.dispatchEvent(b)
				})
			})
		},
		_emulateHtmlUpdate: function() {
			var a = this;
			b.each(b.jPlayer.emulateStatus.split(/\s+/g), function(b, d) {
				a.internal.domNode[d] = a.status[d]
			});
			b.each(b.jPlayer.emulateOptions.split(/\s+/g), function(b, d) {
				a.internal.domNode[d] = a.options[d]
			})
		},
		_destroyHtmlBridge: function() {
			var a = this;
			this.element.unbind(".jPlayerHtml");
			b.each((b.jPlayer.emulateMethods + " " + b.jPlayer.emulateStatus + " " + b.jPlayer.emulateOptions).split(/\s+/g),
				function(b, d) {
					delete a.internal.domNode[d]
				})
		}
	};
	b.jPlayer.error = {
		FLASH: "e_flash",
		FLASH_DISABLED: "e_flash_disabled",
		NO_SOLUTION: "e_no_solution",
		NO_SUPPORT: "e_no_support",
		URL: "e_url",
		URL_NOT_SET: "e_url_not_set",
		VERSION: "e_version"
	};
	b.jPlayer.errorMsg = {
		FLASH: "jPlayer's Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ",
		FLASH_DISABLED: "jPlayer's Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ",
		NO_SOLUTION: "No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.",
		NO_SUPPORT: "It is not possible to play any media format provided in setMedia() on this browser using your current options.",
		URL: "Media URL could not be loaded.",
		URL_NOT_SET: "Attempt to issue media playback commands, while no media url is set.",
		VERSION: "jPlayer " + b.jPlayer.prototype.version.script + " needs Jplayer.swf version " + b.jPlayer.prototype.version.needFlash + " but found "
	};
	b.jPlayer.errorHint = {
		FLASH: "Check your swfPath option and that Jplayer.swf is there.",
		FLASH_DISABLED: "Check that you have not display:none; the jPlayer entity or any ancestor.",
		NO_SOLUTION: "Review the jPlayer options: support and supplied.",
		NO_SUPPORT: "Video or audio formats defined in the supplied option are missing.",
		URL: "Check media URL is valid.",
		URL_NOT_SET: "Use setMedia() to set the media URL.",
		VERSION: "Update jPlayer files."
	};
	b.jPlayer.warning = {
		CSS_SELECTOR_COUNT: "e_css_selector_count",
		CSS_SELECTOR_METHOD: "e_css_selector_method",
		CSS_SELECTOR_STRING: "e_css_selector_string",
		OPTION_KEY: "e_option_key"
	};
	b.jPlayer.warningMsg = {
		CSS_SELECTOR_COUNT: "The number of css selectors found did not equal one: ",
		CSS_SELECTOR_METHOD: "The methodName given in jPlayer('cssSelector') is not a valid jPlayer method.",
		CSS_SELECTOR_STRING: "The methodCssSelector given in jPlayer('cssSelector') is not a String or is empty.",
		OPTION_KEY: "The option requested in jPlayer('option') is undefined."
	};
	b.jPlayer.warningHint = {
		CSS_SELECTOR_COUNT: "Check your css selector and the ancestor.",
		CSS_SELECTOR_METHOD: "Check your method name.",
		CSS_SELECTOR_STRING: "Check your css selector is a string.",
		OPTION_KEY: "Check your option name."
	}
})(jQuery);

jQuery(document).ready(function($) {

	//infographic Call Code

	//Pagebuild: InfoGarphic - Bignumber
	jQuery('.bignumber-item').each(function() {

		var digit = jQuery(this).data('digit');

		if (Modernizr.touch) {
			jQuery(this).animateNumbers(digit, false, 1000);
		} else {
			jQuery(this).waypoint(function() {
				jQuery(this).animateNumbers(digit, false, 1000);
			}, {
				offset: '100%'
			});
		}

	});

	//Pagebuild: InfoGarphic -  Columns
	jQuery('.infrographic.columns').each(function(index, element) {
		var
			_this = jQuery(this),
			vbar_items = _this.find('.vbar-item').length,
			vbar_item_width = 100 / vbar_items;
		_this.find('.vbar-item').css({
			width: vbar_item_width + '%'
		});


		_this.waypoint(function() {
			_this.find('.vbar').each(function() {
				jQuery(this).jqbar({
					label: jQuery(this).attr('data-lbl'),
					value: jQuery(this).attr('data-val'),
					barColor: jQuery(this).attr('data-clr'),
					barWidth: 160,
					orientation: 'v'
				});
			});
		}, {
			offset: '100%',
			triggerOnce: true
		});


	});

	//Pagebuild: InfoGarphic -  Pictorial
	jQuery('.infrographic.pictorial').each(function(index, element) {
		var _this = jQuery(this),
			_thisIcon = _this.find("i");

		if (_thisIcon.hasClass('m-people-male') || _thisIcon.hasClass('m-people-female') || _thisIcon.hasClass('m-up-arrow') || _thisIcon.hasClass('m-down-arrow') || _thisIcon.hasClass('m-dot')) {
			_this.find('.bar').css({
				width: '46px'
			})
		}
		_this.waypoint(function() {
			_this.find('.progress_bars_with_image_content .bar').each(function(i, element) {
				var bar = jQuery(this);
				if (i < bar.parent().attr('data-number')) {
					var $this = this;
					setTimeout(function() {
						$this.setAttribute("class", "bar active");
					}, (i + 1) * 300);
				}
			});
		}, {
			offset: '100%',
			triggerOnce: true
		});
	});

	//Pagebuild: InfoGarphic -  Pie
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

	//Pagebuild: InfoGarphic -  Bar
	jQuery('.infrographic.bar').each(function(index, element) {
		var _this = jQuery(this);

		if (Modernizr.touch) {
			moveProgressBar(_this);
		} else {
			_this.waypoint(function() {
				moveProgressBar(_this);
			}, {
				offset: '100%',
				triggerOnce: true
			});
		}
	});
});

/*********************************************

jquery Bar
Author : EGrappler.com
URL    : http://www.egrappler.com
License: http://www.egrappler.com/license.

*********************************************/
(function($) {
	$.fn.extend({
		jqbar: function(options) {
			var settings = $.extend({
				animationSpeed: 2000,
				barLength: 200,
				orientation: 'h',
				barWidth: 10,
				barColor: 'red',
				label: '&nbsp;',
				value: 100
			}, options);

			return this.each(function() {

				var valueLabelHeight = 0;
				var progressContainer = $(this);

				if (settings.orientation == 'h') {

					progressContainer.addClass('jqbar horizontal').append('<span class="bar-label"></span><span class="bar-level-wrapper"><span class="bar-level"></span></span><span class="bar-percent"></span>');

					var progressLabel = progressContainer.find('.bar-label').html(settings.label);
					var progressBar = progressContainer.find('.bar-level').attr('data-value', settings.value);
					var progressBarWrapper = progressContainer.find('.bar-level-wrapper');

					progressBar.css({
						height: settings.barWidth,
						width: 0,
						backgroundColor: settings.barColor
					});

					var valueLabel = progressContainer.find('.bar-percent');
					valueLabel.html('0');
				} else {

					progressContainer.addClass('jqbar vertical').append('<span class="bar-level-wrapper"><span class="bar-level"></span></span><span class="bar-percent"></span><span class="bar-label"></span>');

					var progressLabel = progressContainer.find('.bar-label').html(settings.label);
					var progressBar = progressContainer.find('.bar-level').attr('data-value', settings.value);
					var progressBarWrapper = progressContainer.find('.bar-level-wrapper');

					progressContainer.css('height', settings.barLength);
					progressBar.css({
						height: settings.barLength,
						top: settings.barLength,
						backgroundColor: settings.barColor
					});
					progressBarWrapper.css({
						height: settings.barLength
					});

					var valueLabel = progressContainer.find('.bar-percent');
					valueLabel.html('0');
					valueLabelHeight = parseInt(valueLabel.outerHeight());
					//valueLabel.css({ top: (settings.barLength - valueLabelHeight) + 'px' });
				}

				animateProgressBar(progressBar);

				function animateProgressBar(progressBar) {

					var level = parseInt(progressBar.attr('data-value'));
					if (level > 100) {
						level = 100;
						alert('max value cannot exceed 100 percent');
					}
					var w = settings.barLength * level / 100;

					if (settings.orientation == 'h') {
						progressBar.animate({
							width: w
						}, {
							duration: 2000,
							step: function(currentWidth) {
								var percent = parseInt(currentWidth / settings.barLength * 100);
								if (isNaN(percent))
									percent = 0;
								progressContainer.find('.bar-percent').html(percent + '%');
							}
						});
					} else {

						var h = settings.barLength - settings.barLength * level / 100;
						progressBar.animate({
							top: h
						}, {
							duration: 2000,
							step: function(currentValue) {
								var percent = parseInt((settings.barLength - parseInt(currentValue)) / settings.barLength * 100);
								if (isNaN(percent))
									percent = 0;
								progressContainer.find('.bar-percent').html(Math.abs(percent) + '%');
							}
						});

						progressContainer.find('.bar-percent').animate({
							top: (h - valueLabelHeight)
						}, 2000);

					}
				}

			});
		}
	});

})(jQuery);
/***********
jquery animateNumbers
	Animates element's number to new number with commas
	Parameters:
		stop (number): number to stop on
        commas (boolean): turn commas on/off (default is true)
		duration (number): how long in ms (default is 1000)
		ease (string): type of easing (default is "swing", others are avaiable from jQuery's easing plugin
	Examples:
        $("#div").animateNumbers(1234, false, 500, "linear"); // half second linear without commas
		$("#div").animateNumbers(1234, true, 2000); // two second swing with commas
		$("#div").animateNumbers(4321); // one second swing with commas
	This fully expects an element containing an integer
	If the number is within copy then separate it with a span and target the span
	Inserts and accounts for commas during animation by default
***********/

(function($) {
	$.fn.animateNumbers = function(stop, commas, duration, ease) {
		return this.each(function() {
			var $this = $(this);
			var start = parseInt($this.text().replace(/,/g, ""));
			commas = (commas === undefined) ? true : commas;
			$({
				value: start
			}).animate({
				value: stop
			}, {
				duration: duration == undefined ? 1000 : duration,
				easing: ease == undefined ? "swing" : ease,
				step: function() {
					$this.text(Math.floor(this.value));
					if (commas) {
						$this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
					}
				},
				complete: function() {
					if (parseInt($this.text()) !== stop) {
						$this.text(stop);
						if (commas) {
							$this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
						}
					}
				}
			});
		});
	};
})(jQuery);
/*!jQuery Knob*/
/**
 * Downward compatible, touchable dial
 *
 * Version: 1.2.0 (15/07/2012)
 * Requires: jQuery v1.7+
 *
 * Copyright (c) 2012 Anthony Terrien
 * Under MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to vor, eskimoblood, spiffistan, FabrizioC
 */

(function($) {
	"use strict";
	var k = {},
		max = Math.max,
		min = Math.min;
	k.c = {};
	k.c.d = $(document);
	k.c.t = function(e) {
		return e.originalEvent.touches.length - 1;
	};
	k.o = function() {
		var s = this;
		this.o = null;
		this.$ = null;
		this.i = null;
		this.g = null;
		this.v = null;
		this.cv = null;
		this.x = 0;
		this.y = 0;
		this.$c = null;
		this.c = null;
		this.t = 0;
		this.isInit = false;
		this.fgColor = null;
		this.pColor = null;
		this.dH = null;
		this.cH = null;
		this.eH = null;
		this.rH = null;
		this.run = function() {
			var cf = function(e, conf) {
				var k;
				for (k in conf) {
					s.o[k] = conf[k];
				}
				s.init();
				s._configure()._draw();
			};
			if (this.$.data('kontroled')) return;
			this.$.data('kontroled', true);
			this.extend();
			this.o = $.extend({
				min: this.$.data('min') || 0,
				max: this.$.data('max') || 100,
				stopper: true,
				readOnly: this.$.data('readonly'),
				cursor: (this.$.data('cursor') === true && 30) || this.$.data('cursor') || 0,
				thickness: this.$.data('thickness') || 0.35,
				width: this.$.data('width') || 200,
				height: this.$.data('height') || 200,
				displayInput: this.$.data('displayinput') == null || this.$.data('displayinput'),
				displayPrevious: this.$.data('displayprevious'),
				fgColor: this.$.data('fgcolor') || '#87CEEB',
				inline: false,
				draw: null,
				change: null,
				cancel: null,
				release: null
			}, this.o);
			if (this.$.is('fieldset')) {
				this.v = {};
				this.i = this.$.find('input')
				this.i.each(function(k) {
					var $this = $(this);
					s.i[k] = $this;
					s.v[k] = $this.val();
					$this.bind('change', function() {
						var val = {};
						val[k] = $this.val();
						s.val(val);
					});
				});
				this.$.find('legend').remove();
			} else {
				this.i = this.$;
				this.v = this.$.val();
				(this.v == '') && (this.v = this.o.min);
				this.$.bind('change', function() {
					s.val(s.$.val());
				});
			}
			(!this.o.displayInput) && this.$.hide();
			this.$c = $(document.createElement('canvas')).attr({
				width: this.o.width,
				height: this.o.height
			});
			this.$.wrap($('<div style="' + (this.o.inline ? 'display:inline;' : '') + 'width:' + this.o.width + 'px;height:' +
				this.o.height + 'px;"></div>')).before(this.$c);
			if (typeof G_vmlCanvasManager !== 'undefined') {
				G_vmlCanvasManager.initElement(this.$c[0]);
			}
			this.c = this.$c[0].getContext("2d");
			if (this.v instanceof Object) {
				this.cv = {};
				this.copy(this.v, this.cv);
			} else {
				this.cv = this.v;
			}
			this.$.bind("configure", cf).parent().bind("configure", cf);
			this._listen()._configure()._xy().init();
			this.isInit = true;
			this._draw();
			return this;
		};
		this._draw = function() {
			var d = true;
			s.g = s.c;
			s.clear();
			s.dH && (d = s.dH());
			(d !== false) && s.draw();
		};
		this._touch = function(e) {
			var touchMove = function(e) {
				var v = s.xy2val(e.originalEvent.touches[s.t].pageX, e.originalEvent.touches[s.t].pageY);
				if (v == s.cv) return;
				if (s.cH && (s.cH(v) === false)) return;
				s.change(v);
				s._draw();
			};
			this.t = k.c.t(e);
			touchMove(e);
			k.c.d.bind("touchmove.k", touchMove).bind("touchend.k", function() {
				k.c.d.unbind('touchmove.k touchend.k');
				if (s.rH && (s.rH(s.cv) === false)) return;
				s.val(s.cv);
			});
			return this;
		};
		this._mouse = function(e) {
			var mouseMove = function(e) {
				var v = s.xy2val(e.pageX, e.pageY);
				if (v == s.cv) return;
				if (s.cH && (s.cH(v) === false)) return;
				s.change(v);
				s._draw();
			};
			mouseMove(e);
			k.c.d.bind("mousemove.k", mouseMove).bind("keyup.k", function(e) {
				if (e.keyCode === 27) {
					k.c.d.unbind("mouseup.k mousemove.k keyup.k");
					if (s.eH && (s.eH() === false)) return;
					s.cancel();
				}
			}).bind("mouseup.k", function(e) {
				k.c.d.unbind('mousemove.k mouseup.k keyup.k');
				if (s.rH && (s.rH(s.cv) === false)) return;
				s.val(s.cv);
			});
			return this;
		};
		this._xy = function() {
			var o = this.$c.offset();
			this.x = o.left;
			this.y = o.top;
			return this;
		};
		this._listen = function() {
			if (!this.o.readOnly) {
				this.$c.bind("mousedown", function(e) {
					e.preventDefault();
					s._xy()._mouse(e);
				}).bind("touchstart", function(e) {
					e.preventDefault();
					s._xy()._touch(e);
				});
				this.listen();
			} else {
				this.$.attr('readonly', 'readonly');
			}
			return this;
		};
		this._configure = function() {
			if (this.o.draw) this.dH = this.o.draw;
			if (this.o.change) this.cH = this.o.change;
			if (this.o.cancel) this.eH = this.o.cancel;
			if (this.o.release) this.rH = this.o.release;
			if (this.o.displayPrevious) {
				this.pColor = this.h2rgba(this.o.fgColor, "0.4");
				this.fgColor = this.h2rgba(this.o.fgColor, "0.6");
			} else {
				this.fgColor = this.o.fgColor;
			}
			return this;
		};
		this._clear = function() {
			this.$c[0].width = this.$c[0].width;
		};
		this.listen = function() {};
		this.extend = function() {};
		this.init = function() {};
		this.change = function(v) {};
		this.val = function(v) {};
		this.xy2val = function(x, y) {};
		this.draw = function() {};
		this.clear = function() {
			this._clear();
		};
		this.h2rgba = function(h, a) {
			var rgb;
			h = h.substring(1, 7)
			rgb = [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
			return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
		};
		this.copy = function(f, t) {
			for (var i in f) {
				t[i] = f[i];
			}
		};
	};
	k.Dial = function() {
		k.o.call(this);
		this.startAngle = null;
		this.xy = null;
		this.radius = null;
		this.lineWidth = null;
		this.cursorExt = null;
		this.w2 = null;
		this.PI2 = 2 * Math.PI;
		this.extend = function() {
			this.o = $.extend({
				bgColor: this.$.data('bgcolor') || '#EEEEEE',
				angleOffset: this.$.data('angleoffset') || 0,
				angleArc: this.$.data('anglearc') || 360,
				inline: true
			}, this.o);
		};
		this.val = function(v) {
			if (null != v) {
				this.cv = this.o.stopper ? max(min(v, this.o.max), this.o.min) : v;
				this.v = this.cv;
				this.$.val(this.v);
				this._draw();
			} else {
				return this.v;
			}
		};
		this.xy2val = function(x, y) {
			var a, ret;
			a = Math.atan2(x - (this.x + this.w2), -(y - this.y - this.w2)) - this.angleOffset;
			if (this.angleArc != this.PI2 && (a < 0) && (a > -0.5)) {
				a = 0;
			} else if (a < 0) {
				a += this.PI2;
			}
			ret = ~~(0.5 + (a * (this.o.max - this.o.min) / this.angleArc)) +
				this.o.min;
			this.o.stopper && (ret = max(min(ret, this.o.max), this.o.min));
			return ret;
		};
		this.listen = function() {
			var s = this,
				mw = function(e) {
					e.preventDefault();
					var ori = e.originalEvent,
						deltaX = ori.detail || ori.wheelDeltaX,
						deltaY = ori.detail || ori.wheelDeltaY,
						v = parseInt(s.$.val() || s.o.min) + (deltaX > 0 || deltaY > 0 ? 1 : deltaX < 0 || deltaY < 0 ? -1 : 0);
					if (s.cH && (s.cH(v) === false)) return;
					s.val(v);
				},
				kval, to, m = 1,
				kv = {
					37: -1,
					38: 1,
					39: 1,
					40: -1
				};
			this.$.bind("keydown", function(e) {
				var kc = e.keyCode;
				if (kc >= 96 && kc <= 105) {
					kc = e.keyCode = kc - 48;
				}
				kval = parseInt(String.fromCharCode(kc));
				if (isNaN(kval)) {
					(kc !== 13) && (kc !== 8) && (kc !== 9) && (kc !== 189) && e.preventDefault();
					if ($.inArray(kc, [37, 38, 39, 40]) > -1) {
						e.preventDefault();
						var v = parseInt(s.$.val()) + kv[kc] * m;
						s.o.stopper && (v = max(min(v, s.o.max), s.o.min));
						s.change(v);
						s._draw();
						to = window.setTimeout(function() {
							m *= 2;
						}, 30);
					}
				}
			}).bind("keyup", function(e) {
				if (isNaN(kval)) {
					if (to) {
						window.clearTimeout(to);
						to = null;
						m = 1;
						s.val(s.$.val());
					}
				} else {
					(s.$.val() > s.o.max && s.$.val(s.o.max)) || (s.$.val() < s.o.min && s.$.val(s.o.min));
				}
			});
			this.$c.bind("mousewheel DOMMouseScroll", mw);
			this.$.bind("mousewheel DOMMouseScroll", mw)
		};
		this.init = function() {
			if (this.v < this.o.min || this.v > this.o.max) this.v = this.o.min;
			this.$.val(this.v);
			this.w2 = this.o.width / 2;
			this.cursorExt = this.o.cursor / 100;
			this.xy = this.w2;
			this.lineWidth = this.xy * this.o.thickness;
			this.radius = this.xy - this.lineWidth / 2;
			this.o.angleOffset && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset);
			this.o.angleArc && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc);
			this.angleOffset = this.o.angleOffset * Math.PI / 180;
			this.angleArc = this.o.angleArc * Math.PI / 180;
			this.startAngle = 1.5 * Math.PI + this.angleOffset;
			this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;
			var s = max(String(Math.abs(this.o.max)).length, String(Math.abs(this.o.min)).length, 2) + 2;
			this.o.displayInput && this.i.css({
				'width': ((this.o.width / 2 + 4) >> 0) + 'px',
				'height': ((this.o.width / 3) >> 0) + 'px',
				'position': 'absolute',
				'vertical-align': 'middle',
				'margin-top': ((this.o.width / 3) >> 0) + 'px',
				'margin-left': '-' + ((this.o.width * 3 / 4 + 2) >> 0) + 'px',
				'border': 0,
				'background': 'none',
				'font': '300 26px Arial',
				'text-align': 'center',
				'color': this.o.fgColor,
				'padding': '0px',
				'-webkit-appearance': 'none'
			}) || this.i.css({
				'width': '0px',
				'visibility': 'hidden'
			});
		};
		this.change = function(v) {
			this.cv = v;
			this.$.val(v);
		};
		this.angle = function(v) {
			return (v - this.o.min) * this.angleArc / (this.o.max - this.o.min);
		};
		this.draw = function() {
			var c = this.g,
				a = this.angle(this.cv),
				sat = this.startAngle,
				eat = sat + a,
				sa, ea, r = 1;
			c.lineWidth = this.lineWidth;
			this.o.cursor && (sat = eat - this.cursorExt) && (eat = eat + this.cursorExt);
			c.beginPath();
			c.strokeStyle = this.o.bgColor;
			c.arc(this.xy, this.xy, this.radius, this.endAngle, this.startAngle, true);
			c.stroke();
			if (this.o.displayPrevious) {
				ea = this.startAngle + this.angle(this.v);
				sa = this.startAngle;
				this.o.cursor && (sa = ea - this.cursorExt) && (ea = ea + this.cursorExt);
				c.beginPath();
				c.strokeStyle = this.pColor;
				c.arc(this.xy, this.xy, this.radius, sa, ea, false);
				c.stroke();
				r = (this.cv == this.v);
			}
			c.beginPath();
			c.strokeStyle = r ? this.o.fgColor : this.fgColor;
			c.arc(this.xy, this.xy, this.radius, sat, eat, false);
			c.stroke();
		};
		this.cancel = function() {
			this.val(this.v);
		};
	};
	$.fn.dial = $.fn.knob = function(o) {
		return this.each(function() {
			var d = new k.Dial();
			d.o = o;
			d.$ = $(this);
			d.run();
		}).parent();
	};
})(jQuery);

function ThemePageBuilder() {
	var ux_ts = new ThemeIsotope;
	var ux_pb = this;
	var theme_win = jQuery(window);
	var player_wrap = jQuery("#jquery_jplayer");

	ux_ts.init();

	//pb init
	this.init = function() {

		//Pagebuild: Reload page for some special moduel when window resize e.g. Testimenials, Fullwidth wrap
		var screen_size = ux_pb.getSizeName();

		//Call Lightbox
		if (jQuery('.lightbox').length) {
			jQuery('.lightbox').attr("data-lightbox", "image-1");
		}

		//Pagebuild: Liquid List
		var _moudle_liquidlist = jQuery('.moudle .isotope-liquid-list');
		if (_moudle_liquidlist.length) {
			ux_pb.liquidlist();
		}

		var _moudle_liquidimage = jQuery('.moudle .liquid_list_image');
		if (_moudle_liquidimage.length) {
			_moudle_liquidimage.each(function() {
				jQuery(this).css('cursor', 'pointer');
				ux_pb.liquidclick(jQuery(this));
			})
		}

		//Pagebuild: Liquid Responsive
		var _moudle_liquid_list = jQuery('.moudle .isotope-liquid-list');
		if (_moudle_liquid_list.length) {
			ux_pb.liquidresponsive();
			theme_win.on("debouncedresize", ux_pb.liquidresponsive);
		}

		//Portfolio: mouseover mask
		if (jQuery('.mask-hover').length) {
			jQuery(' .mask-hover ').each(function() {
				jQuery(this).find('.mask-hover-inn').hoverdir();
			});
		}

		$(".isotope.isotope_fade").css('display', 'block');
		$(".pagenums").css('display', 'block');
	}

	//Pagebuild: Liquid Responsive
	this.liquidresponsive = function() {
		var _moudle_liquid_list = jQuery('.moudle .isotope-liquid-list');
		_moudle_liquid_list.each(function() {
			var liquid_width = jQuery(this).width();
			if (liquid_width < 480) {
				jQuery('head').append('<style>.liquid-more-icon i{ display:none; }</style>');
			}
		});
	}

	//Pagebuild: Liquid Column
	this.liquidcolumn = function(_this_isotope_item) {
		var _target = false;
		var _this_parents = _this_isotope_item.parents('.isotope-liquid-list');
		var _isotope_item = _this_parents.find('isotope-item');
		var _this_isotope_num = _this_isotope_item.data('num');
		var _this_size = _this_parents.data('size');
		var _this_width = _this_parents.data('width');
		var _column = _this_parents.width() / ux_ts.getUnitWidth(_this_size, _this_parents) / 2,
			_column = parseInt(_column);
		var _base_num = _this_isotope_num % _column;

		switch (_column) {
			case 5:
				if (_this_size == 'small' && _this_width == 'width8') {
					if (_base_num % 3 == 0) {
						_target = _this_isotope_num + 2;
					}
					if (_base_num % 4 == 0) {
						_target = _this_isotope_num + 1;
					}
				}
				break;

			case 4:
				if ((_this_size == 'small' && _this_width == 'width8') || (_this_size == 'medium' && _this_width == 'width8')) {
					if (_base_num % 2 == 0) {
						_target = _this_isotope_num + 3;
					}
					if (_base_num % 3 == 0) {
						_target = _this_isotope_num + 2;
					}
					if (_base_num % 4 == 0) {
						_target = _this_isotope_num + 1;
					}
				}
				if ((_this_size == 'small' && _this_width == 'width6') || (_this_size == 'medium' && _this_width == 'width6')) {
					if (_base_num % 3 == 0) {
						_target = _this_isotope_num + 2;
					}
				}
				break;

			case 3:
				if ((_this_size == 'small' && _this_width == 'width8') || (_this_size == 'small' && _this_width == 'width6') || (_this_size == 'medium' && _this_width == 'width8') || (_this_size == 'medium' && _this_width == 'width6') || (_this_size == 'large' && _this_width == 'width6')) {
					if (_base_num % 2 == 0) {
						_target = _this_isotope_num + 2;
					}
					if (_base_num % 3 == 0) {
						_target = _this_isotope_num + 1;
					}
				}
				if ((_this_size == 'small' && _this_width == 'width8') || _this_size == 'medium' && _this_width == 'width8') {
					_this_isotope_item.removeClass('width8');
					_this_isotope_item.addClass('width6');
				}
				break;

			case 2:
				if ((_this_size == 'medium' && _this_width == 'width8') || (_this_size == 'medium' && _this_width == 'width6') || (_this_size == 'medium' && _this_width == 'width4') || (_this_size == 'large' && _this_width == 'width6') || (_this_size == 'large' && _this_width == 'width4')) {
					if (_base_num % 2 == 0) {
						_target = _this_isotope_num + 1;
					}
				}
				if (_this_size == 'medium' && _this_width == 'width8') {
					_this_isotope_item.removeClass('width8');
					_this_isotope_item.addClass('width4');
				}
				if (_this_size == 'medium' && _this_width == 'width6') {
					_this_isotope_item.removeClass('width6');
					_this_isotope_item.addClass('width4');
				}

				if (_this_size == 'large' && _this_width == 'width6') {
					_this_isotope_item.removeClass('width6');
					_this_isotope_item.addClass('width2');
				}
				break;
		}

		return _target;
	}

	//Pagebuild: Liquid Ajax
	this.liquidajax = function(_this) {
		var _this_parents = _this.parents('.isotope-liquid-list');
		var _isotope_item = _this_parents.find('.isotope-item');
		var _isotope_length = _this_parents.find('.isotope-item').length;
		var _this_isotope_item = _this.parents('.isotope-item');
		var _this_liquid_inside = _this.parents('.liquid_inside');
		var _this_liquid_item = _this_liquid_inside.find('.liquid-item');
		var _this_liquid_loading = _this_liquid_inside.next('.liquid-loading-wrap');
		var _this_liquid_hide = _this_liquid_loading.find('.liquid-hide');
		var _this_post_id = _this.attr('data-postid');
		var _this_type = _this.attr('data-type');
		var _this_block_words = _this_parents.attr('data-words');
		var _this_show_social = _this_parents.attr('data-social');
		var _this_image_ratio = _this_parents.attr('data-ratio');
		var _this_width = _this_parents.attr('data-width');
		var _this_space = _this_parents.attr('data-space');
		var _this_size = _this_parents.attr('data-size');

		var _this_liquid_expand, _this_post_social, _this_liquid_close;
		var _target = ux_pb.liquidcolumn(_this_isotope_item);

		if (_this_type == 'magazine') {
			_this_liquid_hide.html(_this_liquid_item.clone());
		}

		_this_liquid_inside.hide(0, function() {
			_this_liquid_loading.fadeIn(500);
		});

		setTimeout(function() {

			var content = $(".albumDetailBrick").first().clone();
			_this_isotope_item.append(content);
			_this_liquid_expand = _this_isotope_item.find('.liquid-expand-wrap');
			_this_liquid_close = _this_liquid_expand.find('.liquid-item-close');
			_this_isotope_item.removeClass('width2').addClass(_this_width);

			_this_isotope_item.imagesLoaded(function() {
				if (_target) {
					var _isotope_item = _this_parents.find('.isotope-item[data-num=' + _target + ']');
					if (_isotope_item.length == 0) {
						_this_parents.find('.isotope-item[data-num=' + _isotope_length + ']').after(_this_isotope_item);
					} else {
						_this_parents.find('.isotope-item[data-num=' + _target + ']').after(_this_isotope_item);
					}
					_this_parents.isotope('appended', _this_isotope_item);
				}
				_this_liquid_loading.hide(0, function() {
					ux_pb.liquidremove(_this_isotope_item, 'other');
					ux_ts.setWidths(_this_size, _this_parents);
					_this_liquid_expand.fadeIn(300);
					//_this_parents.isotope('reLayout');
					_this_parents.isotope({
						masonry: {
							columnWidth: ux_ts.getUnitWidth(_this_size, _this_parents)
						}
					});
					jQuery('.liquid_handler').removeClass('liquid_handler');

					setTimeout(function() {
						var _html_top = jQuery('html').css('margin-top');
						_this_space = _this_space.replace('px', '');
						_html_top = _html_top.replace('px', '');
						_offset_top = _this_isotope_item.offset().top
						jQuery('html,body').animate({
							scrollTop: _offset_top - _this_space - _html_top
						}, 500);
					}, 1000);
				});
			});

			_this_liquid_close.click(function() {
				ux_pb.liquidremove(_this_isotope_item, 'this');
			});

		});
	}

	//Pagebuild: Liquid Remove
	this.liquidremove = function(_this_isotope_item, _mode) {
		var _this_parents = _this_isotope_item.parents('.isotope-liquid-list');
		var _this_width = _this_parents.attr('data-width');
		var _this_size = _this_parents.attr('data-size');
		var _this_space = _this_parents.attr('data-space');
		var _this_isotope_num = _this_isotope_item.attr('data-num');
		var _isotope_item = _this_parents.find('.isotope-item');
		var _target;

		_isotope_item.each(function(index, element) {
			var _this = jQuery(this);
			var _this_num = _this.attr('data-num');
			var _this_liquid_inside = _this.find('.liquid_inside');
			var _this_liquid_expand = _this.find('.liquid-expand-wrap');

			switch (_mode) {
				case 'this':
					if (_this_isotope_num == _this_num) {
						jQuery(this).removeClass(_this_width).addClass('width2');

						_this_liquid_expand.fadeOut(100, function() {
							_this_liquid_inside.fadeIn(300);
							_this_liquid_inside.css('overflow', 'visible');
							_this_liquid_expand.remove();
							ux_ts.setWidths(_this_size, _this_parents);
							if (_this_isotope_num > 1) {
								_target = _this_isotope_num - 1;
								_this_parents.find('.isotope-item[data-num=' + _target + ']').after(_this_isotope_item);
							} else if (_this_isotope_num == 1) {
								_target = _this_isotope_num + 1;
								_this_parents.find('.isotope-item[data-num=' + _target + ']').before(_this_isotope_item);
							}
							_this_parents.isotope('appended', _this_isotope_item);
							_this_parents.isotope('reLayout');

							setTimeout(function() {
								var _html_top = jQuery('html').css('margin-top');
								_this_space = _this_space.replace('px', '');
								_html_top = _html_top.replace('px', '');
								_offset_top = _this.offset().top
								jQuery('html,body').animate({
									scrollTop: _offset_top - _this_space - _html_top
								}, 500);
							}, 1000);
						});
					}
					break;

				case 'other':
					if (_this_isotope_num != _this_num) {
						if (_this_liquid_expand.length > 0) {
							_this.removeClass(_this_width).addClass('width2');
							_this_liquid_expand.fadeOut(100, function() {
								_this_liquid_inside.fadeIn(300);
								_this_liquid_inside.css('overflow', 'visible');
								_this_liquid_expand.remove();
								if (_this_num > 1) {
									_target = _this_num - 1;
									_this_parents.find('.isotope-item[data-num=' + _target + ']').after(_this);
								} else if (_this_num == 1) {
									_target = _this_num + 1;
									_this_parents.find('.isotope-item[data-num=' + _target + ']').before(_this);
								}
								_this_parents.isotope('appended', _this);
								_this_parents.isotope('reLayout');
							});
						}
					}
					break;
			}
		});
	}

	//Pagebuild: Liquid Click
	this.liquidclick = function(el) {
		el.click(function() {
			var _this = jQuery(this);
			player_wrap.jPlayer("stop");
			if (angular.element('#albumContainer').length) {
				angular.element('#albumContainer').scope().selectAlbum(_this.attr("data-postid"));
			}

			var _this_liquid_handler = jQuery('.liquid_handler');
			if (_this_liquid_handler.length == 0) {
				_this.addClass('liquid_handler');
				ux_pb.liquidajax(_this);
			}
			return false;
		});
	}

	//Pagebuild: Liquid List
	this.liquidlist = function() {
		var _moudle_liquidlist = jQuery('.moudle .isotope-liquid-list');
		_moudle_liquidlist.each(function(i, element) {
			var _this = jQuery(this);
			var _isotope_item = _this.find('.isotope-item');

			_isotope_item.each(function(index, element) {
				jQuery(this).attr('data-num', index + 1);
			});

		});
	}

	this.getSizeName = function() {
		var screen_size = '',
			screen_w = jQuery(window).width();

		if (screen_w > 1170) {
			screen_size = "desktop_wide";
		} else if (screen_w > 960 && screen_w < 1169) {
			screen_size = "desktop";
		} else if (screen_w > 768 && screen_w < 959) {
			screen_size = "tablet";
		} else if (screen_w > 480 && screen_w < 767) {
			screen_size = "mobile";
		} else if (screen_w < 479) {
			screen_size = "mobile_portrait";
		}
		return screen_size;
	}
}

function ThemeIsotope() {
	var ux_ts = this;
	var theme_win = jQuery(window);

	//ts init
	this.init = function() {
		//ThemeIsotope: isotope list double width
		var _isotope_width4 = jQuery('.isotope .width4');
		if (_isotope_width4.length) {
			ux_ts.isotopewidth4();
		}

		//ThemeIsotope: Run isotope
		$allcontainer = jQuery('.container-fluid.main');

		//ThemeIsotope: Call isotope
		var _isotope = jQuery('.isotope');
		if (_isotope.length) {
			ux_ts.callisotope();
		}

		//ThemeIsotope: isotope filter
		var _filters = jQuery('.filters');
		if (_filters.length) {
			ux_ts.isotopefilters();
		}

		//win smartresize
		theme_win.smartresize(function() {
			ux_ts.refresh();
		}).resize();

		theme_win.load(function() {
			ux_ts.refresh();
		});
	}

	this.refresh = function() {
		var _isotope = jQuery('.isotope');
		if (_isotope.length) {
			_isotope.each(function(index, element) {
				var _this = jQuery(this),
					image_size = jQuery(this).data('size');

				ux_ts.setWidths(image_size, _this);
				_this.isotope({
					masonry: {
						columnWidth: ux_ts.getUnitWidth(image_size, _this)
					}
				});
			})
		}
	}

	//ThemeIsotope: isotope list double width
	this.isotopewidth4 = function() {
		var _isotope_width4 = jQuery('.isotope .width4');
		_isotope_width4.each(function(index, element) {
			var width = jQuery(this).find('.fade_wrap').width();
			jQuery(this).find('img').width(width);
		});
	}

	//ThemeIsotope: isotope list responsive
	this.getUnitWidth = function(size, container) {
		var width;
		switch (size) {
			case 'medium':
				if (container.width() <= 320) {
					width = Math.floor(container.width());
				} else if (container.width() >= 321 && container.width() <= 480) {
					width = Math.floor(container.width() / 2);
				} else if (container.width() >= 481 && container.width() <= 768) {
					width = Math.floor(container.width() / 4);
				} else if (container.width() >= 769 && container.width() <= 979) {
					width = Math.floor(container.width() / 6);
				} else if (container.width() >= 980 && container.width() <= 1200) {
					width = Math.floor(container.width() / 8);
				} else if (container.width() >= 1201 && container.width() <= 1600) {
					width = Math.floor(container.width() / 8);
				} else if (container.width() >= 1601 && container.width() <= 1824) {
					width = Math.floor(container.width() / 10);
				} else if (container.width() >= 1825) {
					width = Math.floor(container.width() / 12);
				}
				break;

			case 'large':
				if (container.width() <= 320) {
					width = Math.floor(container.width() / 2);
				} else if (container.width() >= 321 && container.width() <= 480) {
					width = Math.floor(container.width() / 2);
				} else if (container.width() >= 481 && container.width() <= 768) {
					width = Math.floor(container.width() / 4);
				} else if (container.width() >= 769 && container.width() <= 979) {
					width = Math.floor(container.width() / 4);
				} else if (container.width() >= 980 && container.width() <= 1200) {
					width = Math.floor(container.width() / 6);
				} else if (container.width() >= 1201 && container.width() <= 1600) {
					width = Math.floor(container.width() / 6);
				} else if (container.width() >= 1601 && container.width() <= 1824) {
					width = Math.floor(container.width() / 10);
				} else if (container.width() >= 1825) {
					width = Math.floor(container.width() / 12);
				}
				break;

			case 'small':
				if (container.width() <= 320) {
					width = Math.floor(container.width() / 2);
				} else if (container.width() >= 321 && container.width() <= 480) {
					width = Math.floor(container.width() / 2);
				} else if (container.width() >= 481 && container.width() <= 768) {
					width = Math.floor(container.width() / 6);
				} else if (container.width() >= 769 && container.width() <= 979) {
					width = Math.floor(container.width() / 8);
				} else if (container.width() >= 980 && container.width() <= 1200) {
					width = Math.floor(container.width() / 12);
				} else if (container.width() >= 1201 && container.width() <= 1600) {
					width = Math.floor(container.width() / 10);
				} else if (container.width() >= 1601 && container.width() <= 1824) {
					width = Math.floor(container.width() / 10);
				} else if (container.width() >= 1825) {
					width = Math.floor(container.width() / 12);
				}
				break;

			case 'brick':
				if (container.width() > 1440) {
					width = Math.floor(container.width() / 4);
				} else if (container.width() > 1365) {
					width = Math.floor(container.width() / 4);
				} else if (container.width() > 1279) {
					width = Math.floor(container.width() / 3);
				} else if (container.width() > 900) {
					width = Math.floor(container.width() / 3);
				} else if (container.width() > 767) {
					width = Math.floor(container.width() / 2);
				} else if (container.width() > 479) {
					width = Math.floor(container.width() / 2);
				} else {
					width = Math.floor(container.width() / 1);
				}
				break;
		}
		return width;
	}

	this.setWidths = function(size, container) {
		var unitWidth = ux_ts.getUnitWidth(size, container) - 0;
		container.children(":not(.width2)").css({
			width: unitWidth
		});

		if (container.width() <= 480) {
			container.children(".width2").css({
				width: unitWidth * 1
			});
			container.children(".width4").css({
				width: unitWidth * 2
			});
			container.children(".width6").css({
				width: unitWidth * 2
			});
			container.children(".width8").css({
				width: unitWidth * 2
			});

			//brick
			container.children(".width-and-small").css({
				width: unitWidth * 1,
				height: unitWidth * 1
			});
			container.children(".width-and-big").css({
				width: unitWidth * 1,
				height: unitWidth * 1
			});
			container.children(".width-and-long").css({
				width: unitWidth * 1,
				height: unitWidth / 2
			});
			container.children(".width-and-height").css({
				width: unitWidth * 1,
				height: unitWidth * 2
			});
		}
		if (container.width() >= 481) {
			container.children(".width8").css({
				width: unitWidth * 8
			});
			container.children(".width6").css({
				width: unitWidth * 6
			});
			container.children(".width4").css({
				width: unitWidth * 4
			});
			container.children(".width2").css({
				width: unitWidth * 2
			});

			//brick --- thumb small
			container.children(".width-and-small").css({
				width: unitWidth * 1,
				height: unitWidth * 1
			});
			container.find(".width-and-small img").css({
				width: unitWidth * 1
			});

			//brick --- thumb big
			container.children(".width-and-big").css({
				width: unitWidth * 2,
				height: unitWidth * 2
			});
			container.find(".width-and-big img").css({
				width: unitWidth * 2,
			});

			//brick --- thumb long
			container.children(".width-and-long").css({
				width: unitWidth * 2,
				height: unitWidth * 1
			});
			container.find(".width-and-long img").css({
				width: unitWidth * 2
			});

			//brick --- thumb height
			container.children(".width-and-height").css({
				width: unitWidth * 1,
				height: unitWidth * 2
			});
			container.find(".width-and-height img").css({
				width: unitWidth * 1
			});

			//brick set height
			if (size == 'brick') {
				container.children().each(function() {
					var _this = jQuery(this);
					var _this_height = jQuery(this).height();

					if (Math.floor(_this.find('img').height()) < Math.floor(_this_height)) {
						_this.find('img').css({
							width: 'auto',
							height: _this_height
						});
					}
				});
			}

		} else {
			container.children(".width2").css({
				width: unitWidth
			});
		}
	}

	//ThemeIsotope: Call isotope
	this.callisotope = function() {
		var _isotope = jQuery('.isotope');

		_isotope.each(function(index, element) {
			var _this = jQuery(this);
			var image_size = _this.data('size');

			if (image_size != 'brick') {
				ux_ts.setWidths(image_size, _this);
			}

			if (_this.is('.masonry')) {
				_this.isotope({
					animationEngine: 'css',
					//resizable: false,
					masonry: {
						columnWidth: ux_ts.getUnitWidth(image_size, _this)
					}
				});
			} else if (_this.is('.grid_list')) {
				_this.isotope({
					layoutMode: 'fitRows',
					animationEngine: 'css',
					//resizable: false,
					masonry: {
						columnWidth: ux_ts.getUnitWidth(image_size, _this)
					}
				});
			}

			_this.addClass('isotope_fade');
			setTimeout(function() {
				progressbar();
			}, 500);
			_this.siblings('#isotope-load').fadeOut(300);
		});
	}

	//ThemeIsotope: isotope filter
	this.isotopefilters = function() {
		var _filters = jQuery('.filters');
		_filters.delegate('a', 'click', function() {
			$container = jQuery(this).parent().parent().parent().next().find('.isotope');
			jQuery(this).parent().parent().find('li').removeClass('active');
			jQuery(this).parent().addClass('active');
			var selector = jQuery(this).attr('data-filter');
			$container.isotope({
				filter: selector
			});
			return false;
		});

		if (_filters.find('.filter-floating-triggle').length) {

			_filters.find('ul').contents().filter(function() {
				return this.nodeType === 3;
			}).remove();

		}
	}
}

var s4 = function() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

var guid = function() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

function progressbar() {
	$(".progress-wrap").each(function() {
		var me = jQuery(this);
		moveProgressBar(me);
	});

	jQuery(window).resize(function() {
		jQuery(".progress-wrap").each(function() {
			var me = jQuery(this);
			moveProgressBar(me);
		});
	});
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

function collage() {
	setTimeout(function() {
		$('.Collage').collagePlus({
			'targetHeight': 300,
			'effect': "effect-1"
		});

		$('.Collage').css('visibility', 'visible');
		$('#isotope-load').fadeOut();
	}, 800);
}