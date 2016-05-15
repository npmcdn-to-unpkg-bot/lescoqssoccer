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
(function(window,$,undefined){'use strict';var document=window.document;var Modernizr=window.Modernizr;var capitalize=function(str){return str.charAt(0).toUpperCase()+str.slice(1)};var prefixes='Moz Webkit O Ms'.split(' ');var getStyleProperty=function(propName){var style=document.documentElement.style,prefixed;if(typeof style[propName]==='string'){return propName}propName=capitalize(propName);for(var i=0,len=prefixes.length;i<len;i++){prefixed=prefixes[i]+propName;if(typeof style[prefixed]==='string'){return prefixed}}};var transformProp=getStyleProperty('transform'),transitionProp=getStyleProperty('transitionProperty');var tests={csstransforms:function(){return!!transformProp},csstransforms3d:function(){var test=!!getStyleProperty('perspective');if(test){var vendorCSSPrefixes=' -o- -moz- -ms- -webkit- -khtml- '.split(' '),mediaQuery='@media ('+vendorCSSPrefixes.join('transform-3d),(')+'modernizr)',$style=$('<style>'+mediaQuery+'{#modernizr{height:3px}}</style>').appendTo('head'),$div=$('<div id="modernizr" />').appendTo('html');test=$div.height()===3;$div.remove();$style.remove()}return test},csstransitions:function(){return!!transitionProp}};var testName;if(Modernizr){for(testName in tests){if(!Modernizr.hasOwnProperty(testName)){Modernizr.addTest(testName,tests[testName])}}}else{Modernizr=window.Modernizr={_version:'1.6ish: miniModernizr for Isotope'};var classes=' ';var result;for(testName in tests){result=tests[testName]();Modernizr[testName]=result;classes+=' '+(result?'':'no-')+testName}$('html').addClass(classes)}if(Modernizr.csstransforms){var transformFnNotations=Modernizr.csstransforms3d?{translate:function(position){return'translate3d('+position[0]+'px, '+position[1]+'px, 0) '},scale:function(scale){return'scale3d('+scale+', '+scale+', 1) '}}:{translate:function(position){return'translate('+position[0]+'px, '+position[1]+'px) '},scale:function(scale){return'scale('+scale+') '}};var setIsoTransform=function(elem,name,value){var data=$.data(elem,'isoTransform')||{},newData={},fnName,transformObj={},transformValue;newData[name]=value;$.extend(data,newData);for(fnName in data){transformValue=data[fnName];transformObj[fnName]=transformFnNotations[fnName](transformValue)}var translateFn=transformObj.translate||'',scaleFn=transformObj.scale||'',valueFns=translateFn+scaleFn;$.data(elem,'isoTransform',data);elem.style[transformProp]=valueFns};$.cssNumber.scale=true;$.cssHooks.scale={set:function(elem,value){setIsoTransform(elem,'scale',value)},get:function(elem,computed){var transform=$.data(elem,'isoTransform');return transform&&transform.scale?transform.scale:1}};$.fx.step.scale=function(fx){$.cssHooks.scale.set(fx.elem,fx.now+fx.unit)};$.cssNumber.translate=true;$.cssHooks.translate={set:function(elem,value){setIsoTransform(elem,'translate',value)},get:function(elem,computed){var transform=$.data(elem,'isoTransform');return transform&&transform.translate?transform.translate:[0,0]}}}var transitionEndEvent,transitionDurProp;if(Modernizr.csstransitions){transitionEndEvent={WebkitTransitionProperty:'webkitTransitionEnd',MozTransitionProperty:'transitionend',OTransitionProperty:'oTransitionEnd otransitionend',transitionProperty:'transitionend'}[transitionProp];transitionDurProp=getStyleProperty('transitionDuration')}var $event=$.event,dispatchMethod=$.event.handle?'handle':'dispatch',resizeTimeout;$event.special.smartresize={setup:function(){$(this).bind("resize",$event.special.smartresize.handler)},teardown:function(){$(this).unbind("resize",$event.special.smartresize.handler)},handler:function(event,execAsap){var context=this,args=arguments;event.type="smartresize";if(resizeTimeout){clearTimeout(resizeTimeout)}resizeTimeout=setTimeout(function(){$event[dispatchMethod].apply(context,args)},execAsap==="execAsap"?0:100)}};$.fn.smartresize=function(fn){return fn?this.bind("smartresize",fn):this.trigger("smartresize",["execAsap"])};$.Isotope=function(options,element,callback){this.element=$(element);this._create(options);this._init(callback)};var isoContainerStyles=['width','height'];var $window=$(window);$.Isotope.settings={resizable:true,layoutMode:'masonry',containerClass:'isotope',itemClass:'isotope-item',hiddenClass:'isotope-hidden',hiddenStyle:{opacity:0,scale:0.001},visibleStyle:{opacity:1,scale:1},containerStyle:{position:'relative',overflow:'hidden'},animationEngine:'best-available',animationOptions:{queue:false,duration:800},sortBy:'original-order',sortAscending:true,resizesContainer:true,transformsEnabled:true,itemPositionDataEnabled:false};$.Isotope.prototype={_create:function(options){this.options=$.extend({},$.Isotope.settings,options);this.styleQueue=[];this.elemCount=0;var elemStyle=this.element[0].style;this.originalStyle={};var containerStyles=isoContainerStyles.slice(0);for(var prop in this.options.containerStyle){containerStyles.push(prop)}for(var i=0,len=containerStyles.length;i<len;i++){prop=containerStyles[i];this.originalStyle[prop]=elemStyle[prop]||''}this.element.css(this.options.containerStyle);this._updateAnimationEngine();this._updateUsingTransforms();var originalOrderSorter={'original-order':function($elem,instance){instance.elemCount++;return instance.elemCount},random:function(){return Math.random()}};this.options.getSortData=$.extend(this.options.getSortData,originalOrderSorter);this.reloadItems();this.offset={left:parseInt((this.element.css('padding-left')||0),10),top:parseInt((this.element.css('padding-top')||0),10)};var instance=this;setTimeout(function(){instance.element.addClass(instance.options.containerClass)},0);if(this.options.resizable){$window.bind('smartresize.isotope',function(){instance.resize()})}this.element.delegate('.'+this.options.hiddenClass,'click',function(){return false})},_getAtoms:function($elems){var selector=this.options.itemSelector,$atoms=selector?$elems.filter(selector).add($elems.find(selector)):$elems,atomStyle={position:'absolute'};$atoms=$atoms.filter(function(i,atom){return atom.nodeType===1});if(this.usingTransforms){atomStyle.left=0;atomStyle.top=0}$atoms.css(atomStyle).addClass(this.options.itemClass);this.updateSortData($atoms,true);return $atoms},_init:function(callback){this.$filteredAtoms=this._filter(this.$allAtoms);this._sort();this.reLayout(callback)},option:function(opts){if($.isPlainObject(opts)){this.options=$.extend(true,this.options,opts);var updateOptionFn;for(var optionName in opts){updateOptionFn='_update'+capitalize(optionName);if(this[updateOptionFn]){this[updateOptionFn]()}}}},_updateAnimationEngine:function(){var animationEngine=this.options.animationEngine.toLowerCase().replace(/[ _\-]/g,'');var isUsingJQueryAnimation;switch(animationEngine){case'css':case'none':isUsingJQueryAnimation=false;break;case'jquery':isUsingJQueryAnimation=true;break;default:isUsingJQueryAnimation=!Modernizr.csstransitions}this.isUsingJQueryAnimation=isUsingJQueryAnimation;this._updateUsingTransforms()},_updateTransformsEnabled:function(){this._updateUsingTransforms()},_updateUsingTransforms:function(){var usingTransforms=this.usingTransforms=this.options.transformsEnabled&&Modernizr.csstransforms&&Modernizr.csstransitions&&!this.isUsingJQueryAnimation;if(!usingTransforms){delete this.options.hiddenStyle.scale;delete this.options.visibleStyle.scale}this.getPositionStyles=usingTransforms?this._translate:this._positionAbs},_filter:function($atoms){var filter=this.options.filter===''?'*':this.options.filter;if(!filter){return $atoms}var hiddenClass=this.options.hiddenClass,hiddenSelector='.'+hiddenClass,$hiddenAtoms=$atoms.filter(hiddenSelector),$atomsToShow=$hiddenAtoms;if(filter!=='*'){$atomsToShow=$hiddenAtoms.filter(filter);var $atomsToHide=$atoms.not(hiddenSelector).not(filter).addClass(hiddenClass);this.styleQueue.push({$el:$atomsToHide,style:this.options.hiddenStyle})}this.styleQueue.push({$el:$atomsToShow,style:this.options.visibleStyle});$atomsToShow.removeClass(hiddenClass);return $atoms.filter(filter)},updateSortData:function($atoms,isIncrementingElemCount){var instance=this,getSortData=this.options.getSortData,$this,sortData;$atoms.each(function(){$this=$(this);sortData={};for(var key in getSortData){if(!isIncrementingElemCount&&key==='original-order'){sortData[key]=$.data(this,'isotope-sort-data')[key]}else{sortData[key]=getSortData[key]($this,instance)}}$.data(this,'isotope-sort-data',sortData)})},_sort:function(){var sortBy=this.options.sortBy,getSorter=this._getSorter,sortDir=this.options.sortAscending?1:-1,sortFn=function(alpha,beta){var a=getSorter(alpha,sortBy),b=getSorter(beta,sortBy);if(a===b&&sortBy!=='original-order'){a=getSorter(alpha,'original-order');b=getSorter(beta,'original-order')}return((a>b)?1:(a<b)?-1:0)*sortDir};this.$filteredAtoms.sort(sortFn)},_getSorter:function(elem,sortBy){return $.data(elem,'isotope-sort-data')[sortBy]},_translate:function(x,y){return{translate:[x,y]}},_positionAbs:function(x,y){return{left:x,top:y}},_pushPosition:function($elem,x,y){x=Math.round(x+this.offset.left);y=Math.round(y+this.offset.top);var position=this.getPositionStyles(x,y);this.styleQueue.push({$el:$elem,style:position});if(this.options.itemPositionDataEnabled){$elem.data('isotope-item-position',{x:x,y:y})}},layout:function($elems,callback){var layoutMode=this.options.layoutMode;this['_'+layoutMode+'Layout']($elems);if(this.options.resizesContainer){var containerStyle=this['_'+layoutMode+'GetContainerSize']();this.styleQueue.push({$el:this.element,style:containerStyle})}this._processStyleQueue($elems,callback);this.isLaidOut=true},_processStyleQueue:function($elems,callback){var styleFn=!this.isLaidOut?'css':(this.isUsingJQueryAnimation?'animate':'css'),animOpts=this.options.animationOptions,onLayout=this.options.onLayout,objStyleFn,processor,triggerCallbackNow,callbackFn;processor=function(i,obj){obj.$el[styleFn](obj.style,animOpts)};if(this._isInserting&&this.isUsingJQueryAnimation){processor=function(i,obj){objStyleFn=obj.$el.hasClass('no-transition')?'css':styleFn;obj.$el[objStyleFn](obj.style,animOpts)}}else if(callback||onLayout||animOpts.complete){var isCallbackTriggered=false,callbacks=[callback,onLayout,animOpts.complete],instance=this;triggerCallbackNow=true;callbackFn=function(){if(isCallbackTriggered){return}var hollaback;for(var i=0,len=callbacks.length;i<len;i++){hollaback=callbacks[i];if(typeof hollaback==='function'){hollaback.call(instance.element,$elems,instance)}}isCallbackTriggered=true};if(this.isUsingJQueryAnimation&&styleFn==='animate'){animOpts.complete=callbackFn;triggerCallbackNow=false}else if(Modernizr.csstransitions){var i=0,firstItem=this.styleQueue[0],testElem=firstItem&&firstItem.$el,styleObj;while(!testElem||!testElem.length){styleObj=this.styleQueue[i++];if(!styleObj){return}testElem=styleObj.$el}var duration=parseFloat(getComputedStyle(testElem[0])[transitionDurProp]);if(duration>0){processor=function(i,obj){obj.$el[styleFn](obj.style,animOpts).one(transitionEndEvent,callbackFn)};triggerCallbackNow=false}}}$.each(this.styleQueue,processor);if(triggerCallbackNow){callbackFn()}this.styleQueue=[]},resize:function(){if(this['_'+this.options.layoutMode+'ResizeChanged']()){this.reLayout()}},reLayout:function(callback){this['_'+this.options.layoutMode+'Reset']();this.layout(this.$filteredAtoms,callback)},addItems:function($content,callback){var $newAtoms=this._getAtoms($content);this.$allAtoms=this.$allAtoms.add($newAtoms);if(callback){callback($newAtoms)}},insert:function($content,callback){this.element.append($content);var instance=this;this.addItems($content,function($newAtoms){var $newFilteredAtoms=instance._filter($newAtoms);instance._addHideAppended($newFilteredAtoms);instance._sort();instance.reLayout();instance._revealAppended($newFilteredAtoms,callback)})},appended:function($content,callback){var instance=this;this.addItems($content,function($newAtoms){instance._addHideAppended($newAtoms);instance.layout($newAtoms);instance._revealAppended($newAtoms,callback)})},_addHideAppended:function($newAtoms){this.$filteredAtoms=this.$filteredAtoms.add($newAtoms);$newAtoms.addClass('no-transition');this._isInserting=true;this.styleQueue.push({$el:$newAtoms,style:this.options.hiddenStyle})},_revealAppended:function($newAtoms,callback){var instance=this;setTimeout(function(){$newAtoms.removeClass('no-transition');instance.styleQueue.push({$el:$newAtoms,style:instance.options.visibleStyle});instance._isInserting=false;instance._processStyleQueue($newAtoms,callback)},10)},reloadItems:function(){this.$allAtoms=this._getAtoms(this.element.children())},remove:function($content,callback){this.$allAtoms=this.$allAtoms.not($content);this.$filteredAtoms=this.$filteredAtoms.not($content);var instance=this;var removeContent=function(){$content.remove();if(callback){callback.call(instance.element)}};if($content.filter(':not(.'+this.options.hiddenClass+')').length){this.styleQueue.push({$el:$content,style:this.options.hiddenStyle});this._sort();this.reLayout(removeContent)}else{removeContent()}},shuffle:function(callback){this.updateSortData(this.$allAtoms);this.options.sortBy='random';this._sort();this.reLayout(callback)},destroy:function(){var usingTransforms=this.usingTransforms;var options=this.options;this.$allAtoms.removeClass(options.hiddenClass+' '+options.itemClass).each(function(){var style=this.style;style.position='';style.top='';style.left='';style.opacity='';if(usingTransforms){style[transformProp]=''}});var elemStyle=this.element[0].style;for(var prop in this.originalStyle){elemStyle[prop]=this.originalStyle[prop]}this.element.unbind('.isotope').undelegate('.'+options.hiddenClass,'click').removeClass(options.containerClass).removeData('isotope');$window.unbind('.isotope')},_getSegments:function(isRows){var namespace=this.options.layoutMode,measure=isRows?'rowHeight':'columnWidth',size=isRows?'height':'width',segmentsName=isRows?'rows':'cols',containerSize=this.element[size](),segments,segmentSize=this.options[namespace]&&this.options[namespace][measure]||this.$filteredAtoms['outer'+capitalize(size)](true)||containerSize;segments=Math.floor(containerSize/segmentSize);segments=Math.max(segments,1);this[namespace][segmentsName]=segments;this[namespace][measure]=segmentSize},_checkIfSegmentsChanged:function(isRows){var namespace=this.options.layoutMode,segmentsName=isRows?'rows':'cols',prevSegments=this[namespace][segmentsName];this._getSegments(isRows);return(this[namespace][segmentsName]!==prevSegments)},_masonryReset:function(){this.masonry={};this._getSegments();var i=this.masonry.cols;this.masonry.colYs=[];while(i--){this.masonry.colYs.push(0)}},_masonryLayout:function($elems){var instance=this,props=instance.masonry;$elems.each(function(){var $this=$(this),colSpan=Math.ceil($this.outerWidth(true)/props.columnWidth);colSpan=Math.min(colSpan,props.cols);if(colSpan===1){instance._masonryPlaceBrick($this,props.colYs)}else{var groupCount=props.cols+1-colSpan,groupY=[],groupColY,i;for(i=0;i<groupCount;i++){groupColY=props.colYs.slice(i,i+colSpan);groupY[i]=Math.max.apply(Math,groupColY)}instance._masonryPlaceBrick($this,groupY)}})},_masonryPlaceBrick:function($brick,setY){var minimumY=Math.min.apply(Math,setY),shortCol=0;for(var i=0,len=setY.length;i<len;i++){if(setY[i]===minimumY){shortCol=i;break}}var x=this.masonry.columnWidth*shortCol,y=minimumY;this._pushPosition($brick,x,y);var setHeight=minimumY+$brick.outerHeight(true),setSpan=this.masonry.cols+1-len;for(i=0;i<setSpan;i++){this.masonry.colYs[shortCol+i]=setHeight}},_masonryGetContainerSize:function(){var containerHeight=Math.max.apply(Math,this.masonry.colYs);return{height:containerHeight}},_masonryResizeChanged:function(){return this._checkIfSegmentsChanged()},_fitRowsReset:function(){this.fitRows={x:0,y:0,height:0}},_fitRowsLayout:function($elems){var instance=this,containerWidth=this.element.width(),props=this.fitRows;$elems.each(function(){var $this=$(this),atomW=$this.outerWidth(true),atomH=$this.outerHeight(true);if(props.x!==0&&atomW+props.x>containerWidth){props.x=0;props.y=props.height}instance._pushPosition($this,props.x,props.y);props.height=Math.max(props.y+atomH,props.height);props.x+=atomW})},_fitRowsGetContainerSize:function(){return{height:this.fitRows.height}},_fitRowsResizeChanged:function(){return true},_cellsByRowReset:function(){this.cellsByRow={index:0};this._getSegments();this._getSegments(true)},_cellsByRowLayout:function($elems){var instance=this,props=this.cellsByRow;$elems.each(function(){var $this=$(this),col=props.index%props.cols,row=Math.floor(props.index/props.cols),x=(col+0.5)*props.columnWidth-$this.outerWidth(true)/2,y=(row+0.5)*props.rowHeight-$this.outerHeight(true)/2;instance._pushPosition($this,x,y);props.index++})},_cellsByRowGetContainerSize:function(){return{height:Math.ceil(this.$filteredAtoms.length/this.cellsByRow.cols)*this.cellsByRow.rowHeight+this.offset.top}},_cellsByRowResizeChanged:function(){return this._checkIfSegmentsChanged()},_straightDownReset:function(){this.straightDown={y:0}},_straightDownLayout:function($elems){var instance=this;$elems.each(function(i){var $this=$(this);instance._pushPosition($this,0,instance.straightDown.y);instance.straightDown.y+=$this.outerHeight(true)})},_straightDownGetContainerSize:function(){return{height:this.straightDown.y}},_straightDownResizeChanged:function(){return true},_masonryHorizontalReset:function(){this.masonryHorizontal={};this._getSegments(true);var i=this.masonryHorizontal.rows;this.masonryHorizontal.rowXs=[];while(i--){this.masonryHorizontal.rowXs.push(0)}},_masonryHorizontalLayout:function($elems){var instance=this,props=instance.masonryHorizontal;$elems.each(function(){var $this=$(this),rowSpan=Math.ceil($this.outerHeight(true)/props.rowHeight);rowSpan=Math.min(rowSpan,props.rows);if(rowSpan===1){instance._masonryHorizontalPlaceBrick($this,props.rowXs)}else{var groupCount=props.rows+1-rowSpan,groupX=[],groupRowX,i;for(i=0;i<groupCount;i++){groupRowX=props.rowXs.slice(i,i+rowSpan);groupX[i]=Math.max.apply(Math,groupRowX)}instance._masonryHorizontalPlaceBrick($this,groupX)}})},_masonryHorizontalPlaceBrick:function($brick,setX){var minimumX=Math.min.apply(Math,setX),smallRow=0;for(var i=0,len=setX.length;i<len;i++){if(setX[i]===minimumX){smallRow=i;break}}var x=minimumX,y=this.masonryHorizontal.rowHeight*smallRow;this._pushPosition($brick,x,y);var setWidth=minimumX+$brick.outerWidth(true),setSpan=this.masonryHorizontal.rows+1-len;for(i=0;i<setSpan;i++){this.masonryHorizontal.rowXs[smallRow+i]=setWidth}},_masonryHorizontalGetContainerSize:function(){var containerWidth=Math.max.apply(Math,this.masonryHorizontal.rowXs);return{width:containerWidth}},_masonryHorizontalResizeChanged:function(){return this._checkIfSegmentsChanged(true)},_fitColumnsReset:function(){this.fitColumns={x:0,y:0,width:0}},_fitColumnsLayout:function($elems){var instance=this,containerHeight=this.element.height(),props=this.fitColumns;$elems.each(function(){var $this=$(this),atomW=$this.outerWidth(true),atomH=$this.outerHeight(true);if(props.y!==0&&atomH+props.y>containerHeight){props.x=props.width;props.y=0}instance._pushPosition($this,props.x,props.y);props.width=Math.max(props.x+atomW,props.width);props.y+=atomH})},_fitColumnsGetContainerSize:function(){return{width:this.fitColumns.width}},_fitColumnsResizeChanged:function(){return true},_cellsByColumnReset:function(){this.cellsByColumn={index:0};this._getSegments();this._getSegments(true)},_cellsByColumnLayout:function($elems){var instance=this,props=this.cellsByColumn;$elems.each(function(){var $this=$(this),col=Math.floor(props.index/props.rows),row=props.index%props.rows,x=(col+0.5)*props.columnWidth-$this.outerWidth(true)/2,y=(row+0.5)*props.rowHeight-$this.outerHeight(true)/2;instance._pushPosition($this,x,y);props.index++})},_cellsByColumnGetContainerSize:function(){return{width:Math.ceil(this.$filteredAtoms.length/this.cellsByColumn.rows)*this.cellsByColumn.columnWidth}},_cellsByColumnResizeChanged:function(){return this._checkIfSegmentsChanged(true)},_straightAcrossReset:function(){this.straightAcross={x:0}},_straightAcrossLayout:function($elems){var instance=this;$elems.each(function(i){var $this=$(this);instance._pushPosition($this,instance.straightAcross.x,0);instance.straightAcross.x+=$this.outerWidth(true)})},_straightAcrossGetContainerSize:function(){return{width:this.straightAcross.x}},_straightAcrossResizeChanged:function(){return true}};$.fn.getOutOfHere=function(callback){var $this=this,$images=$this.find('img').add($this.filter('img')),len=$images.length,blank='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',loaded=[];function triggerCallback(){callback.call($this,$images)}function imgLoaded(event){var img=event.target;if(img.src!==blank&&$.inArray(img,loaded)===-1){loaded.push(img);if(--len<=0){setTimeout(triggerCallback);$images.unbind('.imagesLoaded',imgLoaded)}}}if(!len){triggerCallback()}$images.bind('load.imagesLoaded error.imagesLoaded',imgLoaded).each(function(){var src=this.src;this.src=blank;this.src=src});return $this};var logError=function(message){if(window.console){window.console.error(message)}};$.fn.isotope=function(options,callback){if(typeof options==='string'){var args=Array.prototype.slice.call(arguments,1);this.each(function(){var instance=$.data(this,'isotope');if(!instance){logError("cannot call methods on isotope prior to initialization; attempted to call method '"+options+"'");return}if(!$.isFunction(instance[options])||options.charAt(0)==="_"){logError("no such method '"+options+"' for isotope instance");return}instance[options].apply(instance,args)})}else{this.each(function(){var instance=$.data(this,'isotope');if(instance){instance.option(options);instance._init(callback)}else{$.data(this,'isotope',new $.Isotope(options,this,callback))}})}return this}})(window,jQuery);

/*! modernizr 3.3.1 (Custom Build) | MIT *
 * http://modernizr.com/download/?-cssanimations-cssfilters-inlinesvg-svgfilters-touchevents-prefixed-prefixes-setclasses-shiv-teststyles !
 */
!function(e,t,n){function r(e,t){return typeof e===t}function o(){var e,t,n,o,i,a,s;for(var l in C)if(C.hasOwnProperty(l)){if(e=[],t=C[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=r(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)a=e[i],s=a.split("."),1===s.length?Modernizr[s[0]]=o:(!Modernizr[s[0]]||Modernizr[s[0]]instanceof Boolean||(Modernizr[s[0]]=new Boolean(Modernizr[s[0]])),Modernizr[s[0]][s[1]]=o),y.push((o?"":"no-")+s.join("-"))}}function i(e){var t=x.className,n=Modernizr._config.classPrefix||"";if(b&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),b?x.className.baseVal=t:x.className=t)}function a(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function s(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):b?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function l(){var e=t.body;return e||(e=s(b?"svg":"body"),e.fake=!0),e}function u(e,n,r,o){var i,a,u,c,f="modernizr",d=s("div"),p=l();if(parseInt(r,10))for(;r--;)u=s("div"),u.id=o?o[r]:f+(r+1),d.appendChild(u);return i=s("style"),i.type="text/css",i.id="s"+f,(p.fake?p:d).appendChild(i),p.appendChild(d),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(t.createTextNode(e)),d.id=f,p.fake&&(p.style.background="",p.style.overflow="hidden",c=x.style.overflow,x.style.overflow="hidden",x.appendChild(p)),a=n(d,e),p.fake?(p.parentNode.removeChild(p),x.style.overflow=c,x.offsetHeight):d.parentNode.removeChild(d),!!a}function c(e,t){return!!~(""+e).indexOf(t)}function f(e,t){return function(){return e.apply(t,arguments)}}function d(e,t,n){var o;for(var i in e)if(e[i]in t)return n===!1?e[i]:(o=t[e[i]],r(o,"function")?f(o,n||t):o);return!1}function p(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function m(t,r){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(p(t[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+p(t[o])+":"+r+")");return i=i.join(" or "),u("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function h(e,t,o,i){function l(){f&&(delete k.style,delete k.modElem)}if(i=r(i,"undefined")?!1:i,!r(o,"undefined")){var u=m(e,o);if(!r(u,"undefined"))return u}for(var f,d,p,h,v,g=["modernizr","tspan"];!k.style;)f=!0,k.modElem=s(g.shift()),k.style=k.modElem.style;for(p=e.length,d=0;p>d;d++)if(h=e[d],v=k.style[h],c(h,"-")&&(h=a(h)),k.style[h]!==n){if(i||r(o,"undefined"))return l(),"pfx"==t?h:!0;try{k.style[h]=o}catch(y){}if(k.style[h]!=v)return l(),"pfx"==t?h:!0}return l(),!1}function v(e,t,n,o,i){var a=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+j.join(a+" ")+a).split(" ");return r(t,"string")||r(t,"undefined")?h(s,t,o,i):(s=(e+" "+F.join(a+" ")+a).split(" "),d(s,t,n))}function g(e,t,r){return v(e,n,n,t,r)}var y=[],C=[],S={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){C.push({name:e,fn:t,options:n})},addAsyncTest:function(e){C.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=S,Modernizr=new Modernizr,Modernizr.addTest("svgfilters",function(){var t=!1;try{t="SVGFEColorMatrixElement"in e&&2==SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE}catch(n){}return t});var E=S._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];S._prefixes=E;var x=t.documentElement,b="svg"===x.nodeName.toLowerCase();b||!function(e,t){function n(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function r(){var e=C.elements;return"string"==typeof e?e.split(" "):e}function o(e,t){var n=C.elements;"string"!=typeof n&&(n=n.join(" ")),"string"!=typeof e&&(e=e.join(" ")),C.elements=n+" "+e,u(t)}function i(e){var t=y[e[v]];return t||(t={},g++,e[v]=g,y[g]=t),t}function a(e,n,r){if(n||(n=t),f)return n.createElement(e);r||(r=i(n));var o;return o=r.cache[e]?r.cache[e].cloneNode():h.test(e)?(r.cache[e]=r.createElem(e)).cloneNode():r.createElem(e),!o.canHaveChildren||m.test(e)||o.tagUrn?o:r.frag.appendChild(o)}function s(e,n){if(e||(e=t),f)return e.createDocumentFragment();n=n||i(e);for(var o=n.frag.cloneNode(),a=0,s=r(),l=s.length;l>a;a++)o.createElement(s[a]);return o}function l(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return C.shivMethods?a(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+r().join().replace(/[\w\-:]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(C,t.frag)}function u(e){e||(e=t);var r=i(e);return!C.shivCSS||c||r.hasCSS||(r.hasCSS=!!n(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),f||l(e,r),e}var c,f,d="3.7.3",p=e.html5||{},m=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,h=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,v="_html5shiv",g=0,y={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",c="hidden"in e,f=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(n){c=!0,f=!0}}();var C={elements:p.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:d,shivCSS:p.shivCSS!==!1,supportsUnknownElements:f,shivMethods:p.shivMethods!==!1,type:"default",shivDocument:u,createElement:a,createDocumentFragment:s,addElements:o};e.html5=C,u(t),"object"==typeof module&&module.exports&&(module.exports=C)}("undefined"!=typeof e?e:this,t),Modernizr.addTest("inlinesvg",function(){var e=s("div");return e.innerHTML="<svg/>","http://www.w3.org/2000/svg"==("undefined"!=typeof SVGRect&&e.firstChild&&e.firstChild.namespaceURI)});var w="CSS"in e&&"supports"in e.CSS,_="supportsCSS"in e;Modernizr.addTest("supports",w||_);var T=S.testStyles=u;Modernizr.addTest("touchevents",function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch)n=!0;else{var r=["@media (",E.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");T(r,function(e){n=9===e.offsetTop})}return n});var N="Moz O ms Webkit",j=S._config.usePrefixes?N.split(" "):[];S._cssomPrefixes=j;var z=function(t){var r,o=E.length,i=e.CSSRule;if("undefined"==typeof i)return n;if(!t)return!1;if(t=t.replace(/^@/,""),r=t.replace(/-/g,"_").toUpperCase()+"_RULE",r in i)return"@"+t;for(var a=0;o>a;a++){var s=E[a],l=s.toUpperCase()+"_"+r;if(l in i)return"@-"+s.toLowerCase()+"-"+t}return!1};S.atRule=z;var F=S._config.usePrefixes?N.toLowerCase().split(" "):[];S._domPrefixes=F;var M={elem:s("modernizr")};Modernizr._q.push(function(){delete M.elem});var k={style:M.elem.style};Modernizr._q.unshift(function(){delete k.style}),S.testAllProps=v;S.prefixed=function(e,t,n){return 0===e.indexOf("@")?z(e):(-1!=e.indexOf("-")&&(e=a(e)),t?v(e,t,n):v(e,"pfx"))};S.testAllProps=g,Modernizr.addTest("cssanimations",g("animationName","a",!0)),Modernizr.addTest("cssfilters",function(){if(Modernizr.supports)return g("filter","blur(2px)");var e=s("a");return e.style.cssText=E.join("filter:blur(2px); "),!!e.style.length&&(t.documentMode===n||t.documentMode>9)}),o(),i(y),delete S.addTest,delete S.addAsyncTest;for(var P=0;P<Modernizr._q.length;P++)Modernizr._q[P]();e.Modernizr=Modernizr}(window,document);

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

(function($){var $event=$.event,$special,resizeTimeout;$special=$event.special.debouncedresize={setup:function(){$(this).on("resize",$special.handler);},teardown:function(){$(this).off("resize",$special.handler);},handler:function(event,execAsap){var context=this,args=arguments,dispatch=function(){event.type="debouncedresize";$event.dispatch.apply(context,args);};if(resizeTimeout){clearTimeout(resizeTimeout);}
execAsap?dispatch():resizeTimeout=setTimeout(dispatch,$special.threshold);},threshold:150};})(jQuery);

/*!
 * jCarousel Lite - v1.8.5 - 2013-05-20
 * http://kswedberg.github.com/jquery-carousel-lite/
 * Copyright (c) 2013 Karl Swedberg
 * Licensed MIT (http://kswedberg.github.com/jquery-carousel-lite/blob/master/LICENSE-MIT)
 */

(function(e){function t(e,t){return t.autoStop&&(t.circular?t.autoStop:Math.min(e,t.autoStop))}function i(e){this.id&&(this.id+=e)}e.jCarouselLite={version:"1.8.5",curr:0},e.fn.jCarouselLite=function(a){var s=e.extend(!0,{},e.fn.jCarouselLite.defaults,a),n=Math.ceil,l=Math.abs;return this.each(function(){function a(){return X.slice(H).slice(0,P)}function o(t,i){if(g)return!1;i=i||{};var n=H,l=t>H,o=i.speed||s.speed,r=i.offset||0;return s.beforeStart&&s.beforeStart.call(w,a(),l),X.removeClass(s.activeClass),s.circular?(t>H&&t>Y-P?(H%=z,t=H+(i.auto?O:s.scroll),T.css(j,-H*p.liSize-r)):H>t&&0>t&&(H+=z,t+=z,T.css(j,-H*p.liSize-r)),H=t+t%1):(0>t?t=0:t>Y-N&&(t=Y-N),H=t,0===H&&s.first&&s.first.call(this,a(),l),H===Y-N&&s.last&&s.last.call(this,a(),l),s.btnPrev&&s.$btnPrev.toggleClass(s.btnDisabledClass,0===H),s.btnNext&&s.$btnNext.toggleClass(s.btnDisabledClass,H===Y-N)),F(H,G),e.jCarouselLite.curr=H,n!==H||i.force?(g=!0,m[j]=-(H*p.liSize),T.animate(m,o,s.easing,function(){s.afterEnd&&s.afterEnd.call(w,a(),l),g=!1}),X.eq(H).addClass(s.activeClass),H):(s.afterEnd&&s.afterEnd.call(w,a(),l),H)}var r,c,u,d,v,f,h,b="ontouchend"in document,p={div:{},ul:{},li:{}},C=!0,g=!1,j=s.vertical?"top":"left",m={},S=s.vertical?"height":"width",A=s.vertical?"outerHeight":"outerWidth",x=this,w=e(this),T=w.find("ul").eq(0),D=T.children("li"),z=D.length,y=s.visible,P=n(y),N=Math.floor(y),$=Math.min(s.start,z-1),L=1,E=0,G={},M={},W={},q=s.vertical?"y":"x",I=s.vertical?"x":"y",k=s.init.call(this,s,D);if(k!==!1){w.data("dirjc",L),w.data(j+"jc",w.css(j)),s.circular&&(r=D.slice(z-P).clone(!0).each(i),c=D.slice(0,P).clone(!0).each(i),T.prepend(r).append(c),$+=P,E=P);var F=function(t,i){t=n(t);var a,l=(t-E)%z,o=l+N;return i.go&&(a=e(s.btnGo),a.removeClass(s.activeClass).removeClass(s.visibleClass),a.eq(l).addClass(s.activeClass),a.slice(l,l+N).addClass(s.visibleClass),o>a.length&&a.slice(0,o-a.length).addClass(s.visibleClass)),i.pager&&(u.removeClass(s.activeClass),u.eq(n(l/y)).addClass(s.activeClass)),l},X=T.children("li"),Y=X.length,H=$;e.jCarouselLite.curr=H;var Q=function(e){var t,i,a;return e?(p.div[S]="",p.li={width:"",height:""},p):(t=X[A](!0),i=t*Y,a=t*y,p.div[S]=a+"px",p.ul[S]=i+"px",p.ul[j]=-(H*t)+"px",p.li={width:X.width(),height:X.height()},p.liSize=t,p)},B=function(t){var i,a,n={div:{visibility:"visible",position:"relative",zIndex:2,left:"0"},ul:{margin:"0",padding:"0",position:"relative",listStyleType:"none",zIndex:1},li:{overflow:s.vertical?"hidden":"visible","float":s.vertical?"none":"left"}};t&&(i=Q(!0),w.css(i.div),T.css(i.ul),X.css(i.li)),i=Q(),s.autoCSS&&C&&(e.extend(!0,i,n),C=!1),s.autoWidth&&(a=parseInt(w.css(S),10),p.liSize=a/s.visible,i.li[S]=p.liSize-(X[A](!0)-parseInt(X.css(S),10)),i.ul[S]=p.liSize*Y+"px",i.ul[j]=-(H*p.liSize)+"px",i.div[S]=a),s.autoCSS&&(X.css(i.li),T.css(i.ul),w.css(i.div))};B();var J=0,K=t(z,s),O="number"==typeof s.auto?s.auto:s.scroll,R=function(){x.setAutoAdvance=setTimeout(function(){(!K||K>J)&&(L=w.data("dirjc"),o(H+L*O,{auto:!0}),J++,R())},s.timeout)};if(e.each(["btnPrev","btnNext"],function(t,i){s[i]&&(s["$"+i]=e.isFunction(s[i])?s[i].call(w[0]):e(s[i]),s["$"+i].bind("click.jc",function(e){e.preventDefault();var i=0===t?H-s.scroll:H+s.scroll;return s.directional&&w.data("dirjc",t?1:-1),o(i)}))}),s.circular||(s.btnPrev&&0===$&&s.$btnPrev.addClass(s.btnDisabledClass),s.btnNext&&$+N>=Y&&s.$btnNext.addClass(s.btnDisabledClass)),s.btnGo&&(e.each(s.btnGo,function(t,i){e(i).bind("click.jc",function(e){return e.preventDefault(),o(s.circular?y+t:t)})}),G.go=1),s.autoPager){d=n(z/y),u=[];for(var U=0;d>U;U++)u.push('<li><a href="#">'+(U+1)+"</a></li>");u.length>1&&(u=e("<ul>"+u.join("")+"</ul>").appendTo(s.autoPager).find("li"),u.find("a").each(function(t){e(this).bind("click.jc",function(e){e.preventDefault();var i=t*y;return s.circular&&(i+=y),o(i)})}),G.pager=1)}F($,G),s.mouseWheel&&w.mousewheel&&w.bind("mousewheel.jc",function(e,t){return t>0?o(H-s.scroll):o(H+s.scroll)}),s.pause&&s.auto&&!b&&w.bind("mouseenter.jc",function(){w.trigger("pauseCarousel.jc")}).bind("mouseleave.jc",function(){w.trigger("resumeCarousel.jc")}),s.auto&&R(),e.jCarouselLite.vis=a,w.bind("go.jc",function(e,t,i){t===void 0&&(t="+=1");var a="string"==typeof t&&/(\+=|-=)(\d+)/.exec(t);a?t="-="===a[1]?H-1*a[2]:H+1*a[2]:t+=$,o(t,i)}).bind("startCarousel.jc",function(){clearTimeout(x.setAutoAdvance),x.setAutoAdvance=void 0,w.trigger("go","+="+s.scroll),R(),w.removeData("pausedjc").removeData("stoppedjc")}).bind("resumeCarousel.jc",function(e,t){if(!x.setAutoAdvance){clearTimeout(x.setAutoAdvance),x.setAutoAdvance=void 0;var i=w.data("stoppedjc");(t||!i)&&(R(),w.removeData("pausedjc"),i&&w.removeData("stoppedjc"))}}).bind("pauseCarousel.jc",function(){clearTimeout(x.setAutoAdvance),x.setAutoAdvance=void 0,w.data("pausedjc",!0)}).bind("stopCarousel.jc",function(){clearTimeout(x.setAutoAdvance),x.setAutoAdvance=void 0,w.data("stoppedjc",!0)}).bind("refreshCarousel.jc",function(){B(s.autoCSS)}).bind("endCarousel.jc",function(){x.setAutoAdvance&&(clearTimeout(x.setAutoAdvance),x.setAutoAdvance=void 0),s.btnPrev&&s.$btnPrev.addClass(s.btnDisabledClass).unbind(".jc"),s.btnNext&&s.$btnNext.addClass(s.btnDisabledClass).unbind(".jc"),s.btnGo&&e.each(s.btnGo,function(t,i){e(i).unbind(".jc")}),s.circular&&(X.slice(0,P).remove(),X.slice(-P).remove()),e.each([j+"jc","pausedjc","stoppedjc","dirjc"],function(e,t){w.removeData(t)}),w.unbind(".jc")}),h={touchstart:function(e){W.x=0,W.y=0,M.x=e.targetTouches[0].pageX,M.y=e.targetTouches[0].pageY,M[j]=parseFloat(T.css(j)),M.time=+new Date},touchmove:function(e){var t=e.targetTouches.length;1===t?(e.preventDefault(),W.x=e.targetTouches[0].pageX,W.y=e.targetTouches[0].pageY,m[j]=M[j]+(W[q]-M[q]),T.css(m)):W=M},touchend:function(){if(W.x){var e=M[q]-W[q],t=l(e),i=t>s.swipeThresholds[q],a=l(M[I]-W[I])<s.swipeThresholds[I],n=+new Date-M.time,o=s.swipeThresholds.time>n,r=e>0?"+=":"-=",c=r+s.scroll,u={force:!0};o&&i&&a?u.speed=s.speed/2:!o&&p.liSize/2>t||!i||o&&!a?c="+=0":!o&&t>p.liSize/2&&(c=Math.round(t/p.liSize),c=r+(c>s.visible?s.visible:c),u.offset=e),w.trigger("go.jc",[c,u]),W={}}}},b&&s.swipe&&w.bind("touchstart touchmove touchend",function(e){e=e.originalEvent,h[e.type](e)}),s.responsive&&(f=s.autoCSS,e(window).bind("resize",function(){f&&(T.width(2*T.width()),f=!1),clearTimeout(v),v=setTimeout(function(){w.trigger("refreshCarousel.jc"),f=s.autoCSS},100)}))}}),this},e.fn.jCarouselLite.defaults={btnPrev:null,btnNext:null,btnGo:null,autoPager:null,btnDisabledClass:"disabled",activeClass:"active",visibleClass:"vis",mouseWheel:!1,speed:200,easing:null,timeout:4e3,auto:!1,directional:!1,autoStop:!1,pause:!0,vertical:!1,circular:!0,visible:3,start:0,scroll:1,autoCSS:!0,responsive:!1,autoWidth:!1,swipe:!0,swipeThresholds:{x:80,y:120,time:150},init:function(){},first:null,last:null,beforeStart:null,afterEnd:null}})(jQuery);

/*
 *	jQuery carouFredSel 6.2.1
 *	Demo's and documentation:
 *	caroufredsel.dev7studios.com
 *
 *	Copyright (c) 2013 Fred Heusschen
 *	www.frebsite.nl
 *
 *	Dual licensed under the MIT and GPL licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


(function($){function sc_setScroll(a,b,c){return"transition"==c.transition&&"swing"==b&&(b="ease"),{anims:[],duration:a,orgDuration:a,easing:b,startTime:getTime()}}function sc_startScroll(a,b){for(var c=0,d=a.anims.length;d>c;c++){var e=a.anims[c];e&&e[0][b.transition](e[1],a.duration,a.easing,e[2])}}function sc_stopScroll(a,b){is_boolean(b)||(b=!0),is_object(a.pre)&&sc_stopScroll(a.pre,b);for(var c=0,d=a.anims.length;d>c;c++){var e=a.anims[c];e[0].stop(!0),b&&(e[0].css(e[1]),is_function(e[2])&&e[2]())}is_object(a.post)&&sc_stopScroll(a.post,b)}function sc_afterScroll(a,b,c){switch(b&&b.remove(),c.fx){case"fade":case"crossfade":case"cover-fade":case"uncover-fade":a.css("opacity",1),a.css("filter","")}}function sc_fireCallbacks(a,b,c,d,e){if(b[c]&&b[c].call(a,d),e[c].length)for(var f=0,g=e[c].length;g>f;f++)e[c][f].call(a,d);return[]}function sc_fireQueue(a,b,c){return b.length&&(a.trigger(cf_e(b[0][0],c),b[0][1]),b.shift()),b}function sc_hideHiddenItems(a){a.each(function(){var a=$(this);a.data("_cfs_isHidden",a.is(":hidden")).hide()})}function sc_showHiddenItems(a){a&&a.each(function(){var a=$(this);a.data("_cfs_isHidden")||a.show()})}function sc_clearTimers(a){return a.auto&&clearTimeout(a.auto),a.progress&&clearInterval(a.progress),a}function sc_mapCallbackArguments(a,b,c,d,e,f,g){return{width:g.width,height:g.height,items:{old:a,skipped:b,visible:c},scroll:{items:d,direction:e,duration:f}}}function sc_getDuration(a,b,c,d){var e=a.duration;return"none"==a.fx?0:("auto"==e?e=b.scroll.duration/b.scroll.items*c:10>e&&(e=d/e),1>e?0:("fade"==a.fx&&(e/=2),Math.round(e)))}function nv_showNavi(a,b,c){var d=is_number(a.items.minimum)?a.items.minimum:a.items.visible+1;if("show"==b||"hide"==b)var e=b;else if(d>b){debug(c,"Not enough items ("+b+" total, "+d+" needed): Hiding navigation.");var e="hide"}else var e="show";var f="show"==e?"removeClass":"addClass",g=cf_c("hidden",c);a.auto.button&&a.auto.button[e]()[f](g),a.prev.button&&a.prev.button[e]()[f](g),a.next.button&&a.next.button[e]()[f](g),a.pagination.container&&a.pagination.container[e]()[f](g)}function nv_enableNavi(a,b,c){if(!a.circular&&!a.infinite){var d="removeClass"==b||"addClass"==b?b:!1,e=cf_c("disabled",c);if(a.auto.button&&d&&a.auto.button[d](e),a.prev.button){var f=d||0==b?"addClass":"removeClass";a.prev.button[f](e)}if(a.next.button){var f=d||b==a.items.visible?"addClass":"removeClass";a.next.button[f](e)}}}function go_getObject(a,b){return is_function(b)?b=b.call(a):is_undefined(b)&&(b={}),b}function go_getItemsObject(a,b){return b=go_getObject(a,b),is_number(b)?b={visible:b}:"variable"==b?b={visible:b,width:b,height:b}:is_object(b)||(b={}),b}function go_getScrollObject(a,b){return b=go_getObject(a,b),is_number(b)?b=50>=b?{items:b}:{duration:b}:is_string(b)?b={easing:b}:is_object(b)||(b={}),b}function go_getNaviObject(a,b){if(b=go_getObject(a,b),is_string(b)){var c=cf_getKeyCode(b);b=-1==c?$(b):c}return b}function go_getAutoObject(a,b){return b=go_getNaviObject(a,b),is_jquery(b)?b={button:b}:is_boolean(b)?b={play:b}:is_number(b)&&(b={timeoutDuration:b}),b.progress&&(is_string(b.progress)||is_jquery(b.progress))&&(b.progress={bar:b.progress}),b}function go_complementAutoObject(a,b){return is_function(b.button)&&(b.button=b.button.call(a)),is_string(b.button)&&(b.button=$(b.button)),is_boolean(b.play)||(b.play=!0),is_number(b.delay)||(b.delay=0),is_undefined(b.pauseOnEvent)&&(b.pauseOnEvent=!0),is_boolean(b.pauseOnResize)||(b.pauseOnResize=!0),is_number(b.timeoutDuration)||(b.timeoutDuration=10>b.duration?2500:5*b.duration),b.progress&&(is_function(b.progress.bar)&&(b.progress.bar=b.progress.bar.call(a)),is_string(b.progress.bar)&&(b.progress.bar=$(b.progress.bar)),b.progress.bar?(is_function(b.progress.updater)||(b.progress.updater=$.fn.carouFredSel.progressbarUpdater),is_number(b.progress.interval)||(b.progress.interval=50)):b.progress=!1),b}function go_getPrevNextObject(a,b){return b=go_getNaviObject(a,b),is_jquery(b)?b={button:b}:is_number(b)&&(b={key:b}),b}function go_complementPrevNextObject(a,b){return is_function(b.button)&&(b.button=b.button.call(a)),is_string(b.button)&&(b.button=$(b.button)),is_string(b.key)&&(b.key=cf_getKeyCode(b.key)),b}function go_getPaginationObject(a,b){return b=go_getNaviObject(a,b),is_jquery(b)?b={container:b}:is_boolean(b)&&(b={keys:b}),b}function go_complementPaginationObject(a,b){return is_function(b.container)&&(b.container=b.container.call(a)),is_string(b.container)&&(b.container=$(b.container)),is_number(b.items)||(b.items=!1),is_boolean(b.keys)||(b.keys=!1),is_function(b.anchorBuilder)||is_false(b.anchorBuilder)||(b.anchorBuilder=$.fn.carouFredSel.pageAnchorBuilder),is_number(b.deviation)||(b.deviation=0),b}function go_getSwipeObject(a,b){return is_function(b)&&(b=b.call(a)),is_undefined(b)&&(b={onTouch:!1}),is_true(b)?b={onTouch:b}:is_number(b)&&(b={items:b}),b}function go_complementSwipeObject(a,b){return is_boolean(b.onTouch)||(b.onTouch=!0),is_boolean(b.onMouse)||(b.onMouse=!1),is_object(b.options)||(b.options={}),is_boolean(b.options.triggerOnTouchEnd)||(b.options.triggerOnTouchEnd=!1),b}function go_getMousewheelObject(a,b){return is_function(b)&&(b=b.call(a)),is_true(b)?b={}:is_number(b)?b={items:b}:is_undefined(b)&&(b=!1),b}function go_complementMousewheelObject(a,b){return b}function gn_getItemIndex(a,b,c,d,e){if(is_string(a)&&(a=$(a,e)),is_object(a)&&(a=$(a,e)),is_jquery(a)?(a=e.children().index(a),is_boolean(c)||(c=!1)):is_boolean(c)||(c=!0),is_number(a)||(a=0),is_number(b)||(b=0),c&&(a+=d.first),a+=b,d.total>0){for(;a>=d.total;)a-=d.total;for(;0>a;)a+=d.total}return a}function gn_getVisibleItemsPrev(a,b,c){for(var d=0,e=0,f=c;f>=0;f--){var g=a.eq(f);if(d+=g.is(":visible")?g[b.d.outerWidth](!0):0,d>b.maxDimension)return e;0==f&&(f=a.length),e++}}function gn_getVisibleItemsPrevFilter(a,b,c){return gn_getItemsPrevFilter(a,b.items.filter,b.items.visibleConf.org,c)}function gn_getScrollItemsPrevFilter(a,b,c,d){return gn_getItemsPrevFilter(a,b.items.filter,d,c)}function gn_getItemsPrevFilter(a,b,c,d){for(var e=0,f=0,g=d,h=a.length;g>=0;g--){if(f++,f==h)return f;var i=a.eq(g);if(i.is(b)&&(e++,e==c))return f;0==g&&(g=h)}}function gn_getVisibleOrg(a,b){return b.items.visibleConf.org||a.children().slice(0,b.items.visible).filter(b.items.filter).length}function gn_getVisibleItemsNext(a,b,c){for(var d=0,e=0,f=c,g=a.length-1;g>=f;f++){var h=a.eq(f);if(d+=h.is(":visible")?h[b.d.outerWidth](!0):0,d>b.maxDimension)return e;if(e++,e==g+1)return e;f==g&&(f=-1)}}function gn_getVisibleItemsNextTestCircular(a,b,c,d){var e=gn_getVisibleItemsNext(a,b,c);return b.circular||c+e>d&&(e=d-c),e}function gn_getVisibleItemsNextFilter(a,b,c){return gn_getItemsNextFilter(a,b.items.filter,b.items.visibleConf.org,c,b.circular)}function gn_getScrollItemsNextFilter(a,b,c,d){return gn_getItemsNextFilter(a,b.items.filter,d+1,c,b.circular)-1}function gn_getItemsNextFilter(a,b,c,d){for(var f=0,g=0,h=d,i=a.length-1;i>=h;h++){if(g++,g>=i)return g;var j=a.eq(h);if(j.is(b)&&(f++,f==c))return g;h==i&&(h=-1)}}function gi_getCurrentItems(a,b){return a.slice(0,b.items.visible)}function gi_getOldItemsPrev(a,b,c){return a.slice(c,b.items.visibleConf.old+c)}function gi_getNewItemsPrev(a,b){return a.slice(0,b.items.visible)}function gi_getOldItemsNext(a,b){return a.slice(0,b.items.visibleConf.old)}function gi_getNewItemsNext(a,b,c){return a.slice(c,b.items.visible+c)}function sz_storeMargin(a,b,c){b.usePadding&&(is_string(c)||(c="_cfs_origCssMargin"),a.each(function(){var a=$(this),d=parseInt(a.css(b.d.marginRight),10);is_number(d)||(d=0),a.data(c,d)}))}function sz_resetMargin(a,b,c){if(b.usePadding){var d=is_boolean(c)?c:!1;is_number(c)||(c=0),sz_storeMargin(a,b,"_cfs_tempCssMargin"),a.each(function(){var a=$(this);a.css(b.d.marginRight,d?a.data("_cfs_tempCssMargin"):c+a.data("_cfs_origCssMargin"))})}}function sz_storeOrigCss(a){a.each(function(){var a=$(this);a.data("_cfs_origCss",a.attr("style")||"")})}function sz_restoreOrigCss(a){a.each(function(){var a=$(this);a.attr("style",a.data("_cfs_origCss")||"")})}function sz_setResponsiveSizes(a,b){var d=(a.items.visible,a.items[a.d.width]),e=a[a.d.height],f=is_percentage(e);b.each(function(){var b=$(this),c=d-ms_getPaddingBorderMargin(b,a,"Width");b[a.d.width](c),f&&b[a.d.height](ms_getPercentage(c,e))})}function sz_setSizes(a,b){var c=a.parent(),d=a.children(),e=gi_getCurrentItems(d,b),f=cf_mapWrapperSizes(ms_getSizes(e,b,!0),b,!1);if(c.css(f),b.usePadding){var g=b.padding,h=g[b.d[1]];b.align&&0>h&&(h=0);var i=e.last();i.css(b.d.marginRight,i.data("_cfs_origCssMargin")+h),a.css(b.d.top,g[b.d[0]]),a.css(b.d.left,g[b.d[3]])}return a.css(b.d.width,f[b.d.width]+2*ms_getTotalSize(d,b,"width")),a.css(b.d.height,ms_getLargestSize(d,b,"height")),f}function ms_getSizes(a,b,c){return[ms_getTotalSize(a,b,"width",c),ms_getLargestSize(a,b,"height",c)]}function ms_getLargestSize(a,b,c,d){return is_boolean(d)||(d=!1),is_number(b[b.d[c]])&&d?b[b.d[c]]:is_number(b.items[b.d[c]])?b.items[b.d[c]]:(c=c.toLowerCase().indexOf("width")>-1?"outerWidth":"outerHeight",ms_getTrueLargestSize(a,b,c))}function ms_getTrueLargestSize(a,b,c){for(var d=0,e=0,f=a.length;f>e;e++){var g=a.eq(e),h=g.is(":visible")?g[b.d[c]](!0):0;h>d&&(d=h)}return d}function ms_getTotalSize(a,b,c,d){if(is_boolean(d)||(d=!1),is_number(b[b.d[c]])&&d)return b[b.d[c]];if(is_number(b.items[b.d[c]]))return b.items[b.d[c]]*a.length;for(var e=c.toLowerCase().indexOf("width")>-1?"outerWidth":"outerHeight",f=0,g=0,h=a.length;h>g;g++){var i=a.eq(g);f+=i.is(":visible")?i[b.d[e]](!0):0}return f}function ms_getParentSize(a,b,c){var d=a.is(":visible");d&&a.hide();var e=a.parent()[b.d[c]]();return d&&a.show(),e}function ms_getMaxDimension(a,b){return is_number(a[a.d.width])?a[a.d.width]:b}function ms_hasVariableSizes(a,b,c){for(var d=!1,e=!1,f=0,g=a.length;g>f;f++){var h=a.eq(f),i=h.is(":visible")?h[b.d[c]](!0):0;d===!1?d=i:d!=i&&(e=!0),0==d&&(e=!0)}return e}function ms_getPaddingBorderMargin(a,b,c){return a[b.d["outer"+c]](!0)-a[b.d[c.toLowerCase()]]()}function ms_getPercentage(a,b){if(is_percentage(b)){if(b=parseInt(b.slice(0,-1),10),!is_number(b))return a;a*=b/100}return a}function cf_e(a,b,c,d,e){return is_boolean(c)||(c=!0),is_boolean(d)||(d=!0),is_boolean(e)||(e=!1),c&&(a=b.events.prefix+a),d&&(a=a+"."+b.events.namespace),d&&e&&(a+=b.serialNumber),a}function cf_c(a,b){return is_string(b.classnames[a])?b.classnames[a]:a}function cf_mapWrapperSizes(a,b,c){is_boolean(c)||(c=!0);var d=b.usePadding&&c?b.padding:[0,0,0,0],e={};return e[b.d.width]=a[0]+d[1]+d[3],e[b.d.height]=a[1]+d[0]+d[2],e}function cf_sortParams(a,b){for(var c=[],d=0,e=a.length;e>d;d++)for(var f=0,g=b.length;g>f;f++)if(b[f].indexOf(typeof a[d])>-1&&is_undefined(c[f])){c[f]=a[d];break}return c}function cf_getPadding(a){if(is_undefined(a))return[0,0,0,0];if(is_number(a))return[a,a,a,a];if(is_string(a)&&(a=a.split("px").join("").split("em").join("").split(" ")),!is_array(a))return[0,0,0,0];for(var b=0;4>b;b++)a[b]=parseInt(a[b],10);switch(a.length){case 0:return[0,0,0,0];case 1:return[a[0],a[0],a[0],a[0]];case 2:return[a[0],a[1],a[0],a[1]];case 3:return[a[0],a[1],a[2],a[1]];default:return[a[0],a[1],a[2],a[3]]}}function cf_getAlignPadding(a,b){var c=is_number(b[b.d.width])?Math.ceil(b[b.d.width]-ms_getTotalSize(a,b,"width")):0;switch(b.align){case"left":return[0,c];case"right":return[c,0];case"center":default:return[Math.ceil(c/2),Math.floor(c/2)]}}function cf_getDimensions(a){for(var b=[["width","innerWidth","outerWidth","height","innerHeight","outerHeight","left","top","marginRight",0,1,2,3],["height","innerHeight","outerHeight","width","innerWidth","outerWidth","top","left","marginBottom",3,2,1,0]],c=b[0].length,d="right"==a.direction||"left"==a.direction?0:1,e={},f=0;c>f;f++)e[b[0][f]]=b[d][f];return e}function cf_getAdjust(a,b,c,d){var e=a;if(is_function(c))e=c.call(d,e);else if(is_string(c)){var f=c.split("+"),g=c.split("-");if(g.length>f.length)var h=!0,i=g[0],j=g[1];else var h=!1,i=f[0],j=f[1];switch(i){case"even":e=1==a%2?a-1:a;break;case"odd":e=0==a%2?a-1:a;break;default:e=a}j=parseInt(j,10),is_number(j)&&(h&&(j=-j),e+=j)}return(!is_number(e)||1>e)&&(e=1),e}function cf_getItemsAdjust(a,b,c,d){return cf_getItemAdjustMinMax(cf_getAdjust(a,b,c,d),b.items.visibleConf)}function cf_getItemAdjustMinMax(a,b){return is_number(b.min)&&b.min>a&&(a=b.min),is_number(b.max)&&a>b.max&&(a=b.max),1>a&&(a=1),a}function cf_getSynchArr(a){is_array(a)||(a=[[a]]),is_array(a[0])||(a=[a]);for(var b=0,c=a.length;c>b;b++)is_string(a[b][0])&&(a[b][0]=$(a[b][0])),is_boolean(a[b][1])||(a[b][1]=!0),is_boolean(a[b][2])||(a[b][2]=!0),is_number(a[b][3])||(a[b][3]=0);return a}function cf_getKeyCode(a){return"right"==a?39:"left"==a?37:"up"==a?38:"down"==a?40:-1}function cf_setCookie(a,b,c){if(a){var d=b.triggerHandler(cf_e("currentPosition",c));$.fn.carouFredSel.cookie.set(a,d)}}function cf_getCookie(a){var b=$.fn.carouFredSel.cookie.get(a);return""==b?0:b}function in_mapCss(a,b){for(var c={},d=0,e=b.length;e>d;d++)c[b[d]]=a.css(b[d]);return c}function in_complementItems(a,b,c,d){return is_object(a.visibleConf)||(a.visibleConf={}),is_object(a.sizesConf)||(a.sizesConf={}),0==a.start&&is_number(d)&&(a.start=d),is_object(a.visible)?(a.visibleConf.min=a.visible.min,a.visibleConf.max=a.visible.max,a.visible=!1):is_string(a.visible)?("variable"==a.visible?a.visibleConf.variable=!0:a.visibleConf.adjust=a.visible,a.visible=!1):is_function(a.visible)&&(a.visibleConf.adjust=a.visible,a.visible=!1),is_string(a.filter)||(a.filter=c.filter(":hidden").length>0?":visible":"*"),a[b.d.width]||(b.responsive?(debug(!0,"Set a "+b.d.width+" for the items!"),a[b.d.width]=ms_getTrueLargestSize(c,b,"outerWidth")):a[b.d.width]=ms_hasVariableSizes(c,b,"outerWidth")?"variable":c[b.d.outerWidth](!0)),a[b.d.height]||(a[b.d.height]=ms_hasVariableSizes(c,b,"outerHeight")?"variable":c[b.d.outerHeight](!0)),a.sizesConf.width=a.width,a.sizesConf.height=a.height,a}function in_complementVisibleItems(a,b){return"variable"==a.items[a.d.width]&&(a.items.visibleConf.variable=!0),a.items.visibleConf.variable||(is_number(a[a.d.width])?a.items.visible=Math.floor(a[a.d.width]/a.items[a.d.width]):(a.items.visible=Math.floor(b/a.items[a.d.width]),a[a.d.width]=a.items.visible*a.items[a.d.width],a.items.visibleConf.adjust||(a.align=!1)),("Infinity"==a.items.visible||1>a.items.visible)&&(debug(!0,'Not a valid number of visible items: Set to "variable".'),a.items.visibleConf.variable=!0)),a}function in_complementPrimarySize(a,b,c){return"auto"==a&&(a=ms_getTrueLargestSize(c,b,"outerWidth")),a}function in_complementSecondarySize(a,b,c){return"auto"==a&&(a=ms_getTrueLargestSize(c,b,"outerHeight")),a||(a=b.items[b.d.height]),a}function in_getAlignPadding(a,b){var c=cf_getAlignPadding(gi_getCurrentItems(b,a),a);return a.padding[a.d[1]]=c[1],a.padding[a.d[3]]=c[0],a}function in_getResponsiveValues(a,b){var d=cf_getItemAdjustMinMax(Math.ceil(a[a.d.width]/a.items[a.d.width]),a.items.visibleConf);d>b.length&&(d=b.length);var e=Math.floor(a[a.d.width]/d);return a.items.visible=d,a.items[a.d.width]=e,a[a.d.width]=d*e,a}function bt_pauseOnHoverConfig(a){if(is_string(a))var b=a.indexOf("immediate")>-1?!0:!1,c=a.indexOf("resume")>-1?!0:!1;else var b=c=!1;return[b,c]}function bt_mousesheelNumber(a){return is_number(a)?a:null}function is_null(a){return null===a}function is_undefined(a){return is_null(a)||a===void 0||""===a||"undefined"===a}function is_array(a){return a instanceof Array}function is_jquery(a){return a instanceof jQuery}function is_object(a){return(a instanceof Object||"object"==typeof a)&&!is_null(a)&&!is_jquery(a)&&!is_array(a)&&!is_function(a)}function is_number(a){return(a instanceof Number||"number"==typeof a)&&!isNaN(a)}function is_string(a){return(a instanceof String||"string"==typeof a)&&!is_undefined(a)&&!is_true(a)&&!is_false(a)}function is_function(a){return a instanceof Function||"function"==typeof a}function is_boolean(a){return a instanceof Boolean||"boolean"==typeof a||is_true(a)||is_false(a)}function is_true(a){return a===!0||"true"===a}function is_false(a){return a===!1||"false"===a}function is_percentage(a){return is_string(a)&&"%"==a.slice(-1)}function getTime(){return(new Date).getTime()}function deprecated(a,b){debug(!0,a+" is DEPRECATED, support for it will be removed. Use "+b+" instead.")}function debug(a,b){if(!is_undefined(window.console)&&!is_undefined(window.console.log)){if(is_object(a)){var c=" ("+a.selector+")";a=a.debug}else var c="";if(!a)return!1;b=is_string(b)?"carouFredSel"+c+": "+b:["carouFredSel"+c+":",b],window.console.log(b)}return!1}$.fn.carouFredSel||($.fn.caroufredsel=$.fn.carouFredSel=function(options,configs){if(0==this.length)return debug(!0,'No element found for "'+this.selector+'".'),this;if(this.length>1)return this.each(function(){$(this).carouFredSel(options,configs)});var $cfs=this,$tt0=this[0],starting_position=!1;$cfs.data("_cfs_isCarousel")&&(starting_position=$cfs.triggerHandler("_cfs_triggerEvent","currentPosition"),$cfs.trigger("_cfs_triggerEvent",["destroy",!0]));var FN={};FN._init=function(a,b,c){a=go_getObject($tt0,a),a.items=go_getItemsObject($tt0,a.items),a.scroll=go_getScrollObject($tt0,a.scroll),a.auto=go_getAutoObject($tt0,a.auto),a.prev=go_getPrevNextObject($tt0,a.prev),a.next=go_getPrevNextObject($tt0,a.next),a.pagination=go_getPaginationObject($tt0,a.pagination),a.swipe=go_getSwipeObject($tt0,a.swipe),a.mousewheel=go_getMousewheelObject($tt0,a.mousewheel),b&&(opts_orig=$.extend(!0,{},$.fn.carouFredSel.defaults,a)),opts=$.extend(!0,{},$.fn.carouFredSel.defaults,a),opts.d=cf_getDimensions(opts),crsl.direction="up"==opts.direction||"left"==opts.direction?"next":"prev";var d=$cfs.children(),e=ms_getParentSize($wrp,opts,"width");if(is_true(opts.cookie)&&(opts.cookie="caroufredsel_cookie_"+conf.serialNumber),opts.maxDimension=ms_getMaxDimension(opts,e),opts.items=in_complementItems(opts.items,opts,d,c),opts[opts.d.width]=in_complementPrimarySize(opts[opts.d.width],opts,d),opts[opts.d.height]=in_complementSecondarySize(opts[opts.d.height],opts,d),opts.responsive&&(is_percentage(opts[opts.d.width])||(opts[opts.d.width]="100%")),is_percentage(opts[opts.d.width])&&(crsl.upDateOnWindowResize=!0,crsl.primarySizePercentage=opts[opts.d.width],opts[opts.d.width]=ms_getPercentage(e,crsl.primarySizePercentage),opts.items.visible||(opts.items.visibleConf.variable=!0)),opts.responsive?(opts.usePadding=!1,opts.padding=[0,0,0,0],opts.align=!1,opts.items.visibleConf.variable=!1):(opts.items.visible||(opts=in_complementVisibleItems(opts,e)),opts[opts.d.width]||(!opts.items.visibleConf.variable&&is_number(opts.items[opts.d.width])&&"*"==opts.items.filter?(opts[opts.d.width]=opts.items.visible*opts.items[opts.d.width],opts.align=!1):opts[opts.d.width]="variable"),is_undefined(opts.align)&&(opts.align=is_number(opts[opts.d.width])?"center":!1),opts.items.visibleConf.variable&&(opts.items.visible=gn_getVisibleItemsNext(d,opts,0))),"*"==opts.items.filter||opts.items.visibleConf.variable||(opts.items.visibleConf.org=opts.items.visible,opts.items.visible=gn_getVisibleItemsNextFilter(d,opts,0)),opts.items.visible=cf_getItemsAdjust(opts.items.visible,opts,opts.items.visibleConf.adjust,$tt0),opts.items.visibleConf.old=opts.items.visible,opts.responsive)opts.items.visibleConf.min||(opts.items.visibleConf.min=opts.items.visible),opts.items.visibleConf.max||(opts.items.visibleConf.max=opts.items.visible),opts=in_getResponsiveValues(opts,d,e);else switch(opts.padding=cf_getPadding(opts.padding),"top"==opts.align?opts.align="left":"bottom"==opts.align&&(opts.align="right"),opts.align){case"center":case"left":case"right":"variable"!=opts[opts.d.width]&&(opts=in_getAlignPadding(opts,d),opts.usePadding=!0);break;default:opts.align=!1,opts.usePadding=0==opts.padding[0]&&0==opts.padding[1]&&0==opts.padding[2]&&0==opts.padding[3]?!1:!0}is_number(opts.scroll.duration)||(opts.scroll.duration=500),is_undefined(opts.scroll.items)&&(opts.scroll.items=opts.responsive||opts.items.visibleConf.variable||"*"!=opts.items.filter?"visible":opts.items.visible),opts.auto=$.extend(!0,{},opts.scroll,opts.auto),opts.prev=$.extend(!0,{},opts.scroll,opts.prev),opts.next=$.extend(!0,{},opts.scroll,opts.next),opts.pagination=$.extend(!0,{},opts.scroll,opts.pagination),opts.auto=go_complementAutoObject($tt0,opts.auto),opts.prev=go_complementPrevNextObject($tt0,opts.prev),opts.next=go_complementPrevNextObject($tt0,opts.next),opts.pagination=go_complementPaginationObject($tt0,opts.pagination),opts.swipe=go_complementSwipeObject($tt0,opts.swipe),opts.mousewheel=go_complementMousewheelObject($tt0,opts.mousewheel),opts.synchronise&&(opts.synchronise=cf_getSynchArr(opts.synchronise)),opts.auto.onPauseStart&&(opts.auto.onTimeoutStart=opts.auto.onPauseStart,deprecated("auto.onPauseStart","auto.onTimeoutStart")),opts.auto.onPausePause&&(opts.auto.onTimeoutPause=opts.auto.onPausePause,deprecated("auto.onPausePause","auto.onTimeoutPause")),opts.auto.onPauseEnd&&(opts.auto.onTimeoutEnd=opts.auto.onPauseEnd,deprecated("auto.onPauseEnd","auto.onTimeoutEnd")),opts.auto.pauseDuration&&(opts.auto.timeoutDuration=opts.auto.pauseDuration,deprecated("auto.pauseDuration","auto.timeoutDuration"))},FN._build=function(){$cfs.data("_cfs_isCarousel",!0);var a=$cfs.children(),b=in_mapCss($cfs,["textAlign","float","position","top","right","bottom","left","zIndex","width","height","marginTop","marginRight","marginBottom","marginLeft"]),c="relative";switch(b.position){case"absolute":case"fixed":c=b.position}"parent"==conf.wrapper?sz_storeOrigCss($wrp):$wrp.css(b),$wrp.css({overflow:"hidden",position:c}),sz_storeOrigCss($cfs),$cfs.data("_cfs_origCssZindex",b.zIndex),$cfs.css({textAlign:"left","float":"none",position:"absolute",top:0,right:"auto",bottom:"auto",left:0,marginTop:0,marginRight:0,marginBottom:0,marginLeft:0}),sz_storeMargin(a,opts),sz_storeOrigCss(a),opts.responsive&&sz_setResponsiveSizes(opts,a)},FN._bind_events=function(){FN._unbind_events(),$cfs.bind(cf_e("stop",conf),function(a,b){return a.stopPropagation(),crsl.isStopped||opts.auto.button&&opts.auto.button.addClass(cf_c("stopped",conf)),crsl.isStopped=!0,opts.auto.play&&(opts.auto.play=!1,$cfs.trigger(cf_e("pause",conf),b)),!0}),$cfs.bind(cf_e("finish",conf),function(a){return a.stopPropagation(),crsl.isScrolling&&sc_stopScroll(scrl),!0}),$cfs.bind(cf_e("pause",conf),function(a,b,c){if(a.stopPropagation(),tmrs=sc_clearTimers(tmrs),b&&crsl.isScrolling){scrl.isStopped=!0;var d=getTime()-scrl.startTime;scrl.duration-=d,scrl.pre&&(scrl.pre.duration-=d),scrl.post&&(scrl.post.duration-=d),sc_stopScroll(scrl,!1)}if(crsl.isPaused||crsl.isScrolling||c&&(tmrs.timePassed+=getTime()-tmrs.startTime),crsl.isPaused||opts.auto.button&&opts.auto.button.addClass(cf_c("paused",conf)),crsl.isPaused=!0,opts.auto.onTimeoutPause){var e=opts.auto.timeoutDuration-tmrs.timePassed,f=100-Math.ceil(100*e/opts.auto.timeoutDuration);opts.auto.onTimeoutPause.call($tt0,f,e)}return!0}),$cfs.bind(cf_e("play",conf),function(a,b,c,d){a.stopPropagation(),tmrs=sc_clearTimers(tmrs);var e=[b,c,d],f=["string","number","boolean"],g=cf_sortParams(e,f);if(b=g[0],c=g[1],d=g[2],"prev"!=b&&"next"!=b&&(b=crsl.direction),is_number(c)||(c=0),is_boolean(d)||(d=!1),d&&(crsl.isStopped=!1,opts.auto.play=!0),!opts.auto.play)return a.stopImmediatePropagation(),debug(conf,"Carousel stopped: Not scrolling.");crsl.isPaused&&opts.auto.button&&(opts.auto.button.removeClass(cf_c("stopped",conf)),opts.auto.button.removeClass(cf_c("paused",conf))),crsl.isPaused=!1,tmrs.startTime=getTime();var h=opts.auto.timeoutDuration+c;return dur2=h-tmrs.timePassed,perc=100-Math.ceil(100*dur2/h),opts.auto.progress&&(tmrs.progress=setInterval(function(){var a=getTime()-tmrs.startTime+tmrs.timePassed,b=Math.ceil(100*a/h);opts.auto.progress.updater.call(opts.auto.progress.bar[0],b)},opts.auto.progress.interval)),tmrs.auto=setTimeout(function(){opts.auto.progress&&opts.auto.progress.updater.call(opts.auto.progress.bar[0],100),opts.auto.onTimeoutEnd&&opts.auto.onTimeoutEnd.call($tt0,perc,dur2),crsl.isScrolling?$cfs.trigger(cf_e("play",conf),b):$cfs.trigger(cf_e(b,conf),opts.auto)},dur2),opts.auto.onTimeoutStart&&opts.auto.onTimeoutStart.call($tt0,perc,dur2),!0}),$cfs.bind(cf_e("resume",conf),function(a){return a.stopPropagation(),scrl.isStopped?(scrl.isStopped=!1,crsl.isPaused=!1,crsl.isScrolling=!0,scrl.startTime=getTime(),sc_startScroll(scrl,conf)):$cfs.trigger(cf_e("play",conf)),!0}),$cfs.bind(cf_e("prev",conf)+" "+cf_e("next",conf),function(a,b,c,d,e){if(a.stopPropagation(),crsl.isStopped||$cfs.is(":hidden"))return a.stopImmediatePropagation(),debug(conf,"Carousel stopped or hidden: Not scrolling.");var f=is_number(opts.items.minimum)?opts.items.minimum:opts.items.visible+1;if(f>itms.total)return a.stopImmediatePropagation(),debug(conf,"Not enough items ("+itms.total+" total, "+f+" needed): Not scrolling.");var g=[b,c,d,e],h=["object","number/string","function","boolean"],i=cf_sortParams(g,h);b=i[0],c=i[1],d=i[2],e=i[3];var j=a.type.slice(conf.events.prefix.length);if(is_object(b)||(b={}),is_function(d)&&(b.onAfter=d),is_boolean(e)&&(b.queue=e),b=$.extend(!0,{},opts[j],b),b.conditions&&!b.conditions.call($tt0,j))return a.stopImmediatePropagation(),debug(conf,'Callback "conditions" returned false.');if(!is_number(c)){if("*"!=opts.items.filter)c="visible";else for(var k=[c,b.items,opts[j].items],i=0,l=k.length;l>i;i++)if(is_number(k[i])||"page"==k[i]||"visible"==k[i]){c=k[i];break}switch(c){case"page":return a.stopImmediatePropagation(),$cfs.triggerHandler(cf_e(j+"Page",conf),[b,d]);case"visible":opts.items.visibleConf.variable||"*"!=opts.items.filter||(c=opts.items.visible)}}if(scrl.isStopped)return $cfs.trigger(cf_e("resume",conf)),$cfs.trigger(cf_e("queue",conf),[j,[b,c,d]]),a.stopImmediatePropagation(),debug(conf,"Carousel resumed scrolling.");if(b.duration>0&&crsl.isScrolling)return b.queue&&("last"==b.queue&&(queu=[]),("first"!=b.queue||0==queu.length)&&$cfs.trigger(cf_e("queue",conf),[j,[b,c,d]])),a.stopImmediatePropagation(),debug(conf,"Carousel currently scrolling.");if(tmrs.timePassed=0,$cfs.trigger(cf_e("slide_"+j,conf),[b,c]),opts.synchronise)for(var m=opts.synchronise,n=[b,c],o=0,l=m.length;l>o;o++){var p=j;m[o][2]||(p="prev"==p?"next":"prev"),m[o][1]||(n[0]=m[o][0].triggerHandler("_cfs_triggerEvent",["configuration",p])),n[1]=c+m[o][3],m[o][0].trigger("_cfs_triggerEvent",["slide_"+p,n])}return!0}),$cfs.bind(cf_e("slide_prev",conf),function(a,b,c){a.stopPropagation();var d=$cfs.children();if(!opts.circular&&0==itms.first)return opts.infinite&&$cfs.trigger(cf_e("next",conf),itms.total-1),a.stopImmediatePropagation();if(sz_resetMargin(d,opts),!is_number(c)){if(opts.items.visibleConf.variable)c=gn_getVisibleItemsPrev(d,opts,itms.total-1);else if("*"!=opts.items.filter){var e=is_number(b.items)?b.items:gn_getVisibleOrg($cfs,opts);c=gn_getScrollItemsPrevFilter(d,opts,itms.total-1,e)}else c=opts.items.visible;c=cf_getAdjust(c,opts,b.items,$tt0)}if(opts.circular||itms.total-c<itms.first&&(c=itms.total-itms.first),opts.items.visibleConf.old=opts.items.visible,opts.items.visibleConf.variable){var f=cf_getItemsAdjust(gn_getVisibleItemsNext(d,opts,itms.total-c),opts,opts.items.visibleConf.adjust,$tt0);f>=opts.items.visible+c&&itms.total>c&&(c++,f=cf_getItemsAdjust(gn_getVisibleItemsNext(d,opts,itms.total-c),opts,opts.items.visibleConf.adjust,$tt0)),opts.items.visible=f}else if("*"!=opts.items.filter){var f=gn_getVisibleItemsNextFilter(d,opts,itms.total-c);opts.items.visible=cf_getItemsAdjust(f,opts,opts.items.visibleConf.adjust,$tt0)}if(sz_resetMargin(d,opts,!0),0==c)return a.stopImmediatePropagation(),debug(conf,"0 items to scroll: Not scrolling.");for(debug(conf,"Scrolling "+c+" items backward."),itms.first+=c;itms.first>=itms.total;)itms.first-=itms.total;opts.circular||(0==itms.first&&b.onEnd&&b.onEnd.call($tt0,"prev"),opts.infinite||nv_enableNavi(opts,itms.first,conf)),$cfs.children().slice(itms.total-c,itms.total).prependTo($cfs),itms.total<opts.items.visible+c&&$cfs.children().slice(0,opts.items.visible+c-itms.total).clone(!0).appendTo($cfs);var d=$cfs.children(),g=gi_getOldItemsPrev(d,opts,c),h=gi_getNewItemsPrev(d,opts),i=d.eq(c-1),j=g.last(),k=h.last();sz_resetMargin(d,opts);var l=0,m=0;if(opts.align){var n=cf_getAlignPadding(h,opts);l=n[0],m=n[1]}var o=0>l?opts.padding[opts.d[3]]:0,p=!1,q=$();if(c>opts.items.visible&&(q=d.slice(opts.items.visibleConf.old,c),"directscroll"==b.fx)){var r=opts.items[opts.d.width];p=q,i=k,sc_hideHiddenItems(p),opts.items[opts.d.width]="variable"}var s=!1,t=ms_getTotalSize(d.slice(0,c),opts,"width"),u=cf_mapWrapperSizes(ms_getSizes(h,opts,!0),opts,!opts.usePadding),v=0,w={},x={},y={},z={},A={},B={},C={},D=sc_getDuration(b,opts,c,t);switch(b.fx){case"cover":case"cover-fade":v=ms_getTotalSize(d.slice(0,opts.items.visible),opts,"width")}p&&(opts.items[opts.d.width]=r),sz_resetMargin(d,opts,!0),m>=0&&sz_resetMargin(j,opts,opts.padding[opts.d[1]]),l>=0&&sz_resetMargin(i,opts,opts.padding[opts.d[3]]),opts.align&&(opts.padding[opts.d[1]]=m,opts.padding[opts.d[3]]=l),B[opts.d.left]=-(t-o),C[opts.d.left]=-(v-o),x[opts.d.left]=u[opts.d.width];var E=function(){},F=function(){},G=function(){},H=function(){},I=function(){},J=function(){},K=function(){},L=function(){},M=function(){},N=function(){},O=function(){};switch(b.fx){case"crossfade":case"cover":case"cover-fade":case"uncover":case"uncover-fade":s=$cfs.clone(!0).appendTo($wrp)}switch(b.fx){case"crossfade":case"uncover":case"uncover-fade":s.children().slice(0,c).remove(),s.children().slice(opts.items.visibleConf.old).remove();break;case"cover":case"cover-fade":s.children().slice(opts.items.visible).remove(),s.css(C)}if($cfs.css(B),scrl=sc_setScroll(D,b.easing,conf),w[opts.d.left]=opts.usePadding?opts.padding[opts.d[3]]:0,("variable"==opts[opts.d.width]||"variable"==opts[opts.d.height])&&(E=function(){$wrp.css(u)},F=function(){scrl.anims.push([$wrp,u])}),opts.usePadding){switch(k.not(i).length&&(y[opts.d.marginRight]=i.data("_cfs_origCssMargin"),0>l?i.css(y):(K=function(){i.css(y)},L=function(){scrl.anims.push([i,y])})),b.fx){case"cover":case"cover-fade":s.children().eq(c-1).css(y)}k.not(j).length&&(z[opts.d.marginRight]=j.data("_cfs_origCssMargin"),G=function(){j.css(z)},H=function(){scrl.anims.push([j,z])}),m>=0&&(A[opts.d.marginRight]=k.data("_cfs_origCssMargin")+opts.padding[opts.d[1]],I=function(){k.css(A)},J=function(){scrl.anims.push([k,A])})}O=function(){$cfs.css(w)};var P=opts.items.visible+c-itms.total;N=function(){if(P>0&&($cfs.children().slice(itms.total).remove(),g=$($cfs.children().slice(itms.total-(opts.items.visible-P)).get().concat($cfs.children().slice(0,P).get()))),sc_showHiddenItems(p),opts.usePadding){var a=$cfs.children().eq(opts.items.visible+c-1);a.css(opts.d.marginRight,a.data("_cfs_origCssMargin"))}};var Q=sc_mapCallbackArguments(g,q,h,c,"prev",D,u);switch(M=function(){sc_afterScroll($cfs,s,b),crsl.isScrolling=!1,clbk.onAfter=sc_fireCallbacks($tt0,b,"onAfter",Q,clbk),queu=sc_fireQueue($cfs,queu,conf),crsl.isPaused||$cfs.trigger(cf_e("play",conf))},crsl.isScrolling=!0,tmrs=sc_clearTimers(tmrs),clbk.onBefore=sc_fireCallbacks($tt0,b,"onBefore",Q,clbk),b.fx){case"none":$cfs.css(w),E(),G(),I(),K(),O(),N(),M();break;case"fade":scrl.anims.push([$cfs,{opacity:0},function(){E(),G(),I(),K(),O(),N(),scrl=sc_setScroll(D,b.easing,conf),scrl.anims.push([$cfs,{opacity:1},M]),sc_startScroll(scrl,conf)}]);break;case"crossfade":$cfs.css({opacity:0}),scrl.anims.push([s,{opacity:0}]),scrl.anims.push([$cfs,{opacity:1},M]),F(),G(),I(),K(),O(),N();break;case"cover":scrl.anims.push([s,w,function(){G(),I(),K(),O(),N(),M()}]),F();break;case"cover-fade":scrl.anims.push([$cfs,{opacity:0}]),scrl.anims.push([s,w,function(){G(),I(),K(),O(),N(),M()}]),F();break;case"uncover":scrl.anims.push([s,x,M]),F(),G(),I(),K(),O(),N();break;case"uncover-fade":$cfs.css({opacity:0}),scrl.anims.push([$cfs,{opacity:1}]),scrl.anims.push([s,x,M]),F(),G(),I(),K(),O(),N();break;default:scrl.anims.push([$cfs,w,function(){N(),M()}]),F(),H(),J(),L()}return sc_startScroll(scrl,conf),cf_setCookie(opts.cookie,$cfs,conf),$cfs.trigger(cf_e("updatePageStatus",conf),[!1,u]),!0
}),$cfs.bind(cf_e("slide_next",conf),function(a,b,c){a.stopPropagation();var d=$cfs.children();if(!opts.circular&&itms.first==opts.items.visible)return opts.infinite&&$cfs.trigger(cf_e("prev",conf),itms.total-1),a.stopImmediatePropagation();if(sz_resetMargin(d,opts),!is_number(c)){if("*"!=opts.items.filter){var e=is_number(b.items)?b.items:gn_getVisibleOrg($cfs,opts);c=gn_getScrollItemsNextFilter(d,opts,0,e)}else c=opts.items.visible;c=cf_getAdjust(c,opts,b.items,$tt0)}var f=0==itms.first?itms.total:itms.first;if(!opts.circular){if(opts.items.visibleConf.variable)var g=gn_getVisibleItemsNext(d,opts,c),e=gn_getVisibleItemsPrev(d,opts,f-1);else var g=opts.items.visible,e=opts.items.visible;c+g>f&&(c=f-e)}if(opts.items.visibleConf.old=opts.items.visible,opts.items.visibleConf.variable){for(var g=cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(d,opts,c,f),opts,opts.items.visibleConf.adjust,$tt0);opts.items.visible-c>=g&&itms.total>c;)c++,g=cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(d,opts,c,f),opts,opts.items.visibleConf.adjust,$tt0);opts.items.visible=g}else if("*"!=opts.items.filter){var g=gn_getVisibleItemsNextFilter(d,opts,c);opts.items.visible=cf_getItemsAdjust(g,opts,opts.items.visibleConf.adjust,$tt0)}if(sz_resetMargin(d,opts,!0),0==c)return a.stopImmediatePropagation(),debug(conf,"0 items to scroll: Not scrolling.");for(debug(conf,"Scrolling "+c+" items forward."),itms.first-=c;0>itms.first;)itms.first+=itms.total;opts.circular||(itms.first==opts.items.visible&&b.onEnd&&b.onEnd.call($tt0,"next"),opts.infinite||nv_enableNavi(opts,itms.first,conf)),itms.total<opts.items.visible+c&&$cfs.children().slice(0,opts.items.visible+c-itms.total).clone(!0).appendTo($cfs);var d=$cfs.children(),h=gi_getOldItemsNext(d,opts),i=gi_getNewItemsNext(d,opts,c),j=d.eq(c-1),k=h.last(),l=i.last();sz_resetMargin(d,opts);var m=0,n=0;if(opts.align){var o=cf_getAlignPadding(i,opts);m=o[0],n=o[1]}var p=!1,q=$();if(c>opts.items.visibleConf.old&&(q=d.slice(opts.items.visibleConf.old,c),"directscroll"==b.fx)){var r=opts.items[opts.d.width];p=q,j=k,sc_hideHiddenItems(p),opts.items[opts.d.width]="variable"}var s=!1,t=ms_getTotalSize(d.slice(0,c),opts,"width"),u=cf_mapWrapperSizes(ms_getSizes(i,opts,!0),opts,!opts.usePadding),v=0,w={},x={},y={},z={},A={},B=sc_getDuration(b,opts,c,t);switch(b.fx){case"uncover":case"uncover-fade":v=ms_getTotalSize(d.slice(0,opts.items.visibleConf.old),opts,"width")}p&&(opts.items[opts.d.width]=r),opts.align&&0>opts.padding[opts.d[1]]&&(opts.padding[opts.d[1]]=0),sz_resetMargin(d,opts,!0),sz_resetMargin(k,opts,opts.padding[opts.d[1]]),opts.align&&(opts.padding[opts.d[1]]=n,opts.padding[opts.d[3]]=m),A[opts.d.left]=opts.usePadding?opts.padding[opts.d[3]]:0;var C=function(){},D=function(){},E=function(){},F=function(){},G=function(){},H=function(){},I=function(){},J=function(){},K=function(){};switch(b.fx){case"crossfade":case"cover":case"cover-fade":case"uncover":case"uncover-fade":s=$cfs.clone(!0).appendTo($wrp),s.children().slice(opts.items.visibleConf.old).remove()}switch(b.fx){case"crossfade":case"cover":case"cover-fade":$cfs.css("zIndex",1),s.css("zIndex",0)}if(scrl=sc_setScroll(B,b.easing,conf),w[opts.d.left]=-t,x[opts.d.left]=-v,0>m&&(w[opts.d.left]+=m),("variable"==opts[opts.d.width]||"variable"==opts[opts.d.height])&&(C=function(){$wrp.css(u)},D=function(){scrl.anims.push([$wrp,u])}),opts.usePadding){var L=l.data("_cfs_origCssMargin");n>=0&&(L+=opts.padding[opts.d[1]]),l.css(opts.d.marginRight,L),j.not(k).length&&(z[opts.d.marginRight]=k.data("_cfs_origCssMargin")),E=function(){k.css(z)},F=function(){scrl.anims.push([k,z])};var M=j.data("_cfs_origCssMargin");m>0&&(M+=opts.padding[opts.d[3]]),y[opts.d.marginRight]=M,G=function(){j.css(y)},H=function(){scrl.anims.push([j,y])}}K=function(){$cfs.css(A)};var N=opts.items.visible+c-itms.total;J=function(){N>0&&$cfs.children().slice(itms.total).remove();var a=$cfs.children().slice(0,c).appendTo($cfs).last();if(N>0&&(i=gi_getCurrentItems(d,opts)),sc_showHiddenItems(p),opts.usePadding){if(itms.total<opts.items.visible+c){var b=$cfs.children().eq(opts.items.visible-1);b.css(opts.d.marginRight,b.data("_cfs_origCssMargin")+opts.padding[opts.d[1]])}a.css(opts.d.marginRight,a.data("_cfs_origCssMargin"))}};var O=sc_mapCallbackArguments(h,q,i,c,"next",B,u);switch(I=function(){$cfs.css("zIndex",$cfs.data("_cfs_origCssZindex")),sc_afterScroll($cfs,s,b),crsl.isScrolling=!1,clbk.onAfter=sc_fireCallbacks($tt0,b,"onAfter",O,clbk),queu=sc_fireQueue($cfs,queu,conf),crsl.isPaused||$cfs.trigger(cf_e("play",conf))},crsl.isScrolling=!0,tmrs=sc_clearTimers(tmrs),clbk.onBefore=sc_fireCallbacks($tt0,b,"onBefore",O,clbk),b.fx){case"none":$cfs.css(w),C(),E(),G(),K(),J(),I();break;case"fade":scrl.anims.push([$cfs,{opacity:0},function(){C(),E(),G(),K(),J(),scrl=sc_setScroll(B,b.easing,conf),scrl.anims.push([$cfs,{opacity:1},I]),sc_startScroll(scrl,conf)}]);break;case"crossfade":$cfs.css({opacity:0}),scrl.anims.push([s,{opacity:0}]),scrl.anims.push([$cfs,{opacity:1},I]),D(),E(),G(),K(),J();break;case"cover":$cfs.css(opts.d.left,$wrp[opts.d.width]()),scrl.anims.push([$cfs,A,I]),D(),E(),G(),J();break;case"cover-fade":$cfs.css(opts.d.left,$wrp[opts.d.width]()),scrl.anims.push([s,{opacity:0}]),scrl.anims.push([$cfs,A,I]),D(),E(),G(),J();break;case"uncover":scrl.anims.push([s,x,I]),D(),E(),G(),K(),J();break;case"uncover-fade":$cfs.css({opacity:0}),scrl.anims.push([$cfs,{opacity:1}]),scrl.anims.push([s,x,I]),D(),E(),G(),K(),J();break;default:scrl.anims.push([$cfs,w,function(){K(),J(),I()}]),D(),F(),H()}return sc_startScroll(scrl,conf),cf_setCookie(opts.cookie,$cfs,conf),$cfs.trigger(cf_e("updatePageStatus",conf),[!1,u]),!0}),$cfs.bind(cf_e("slideTo",conf),function(a,b,c,d,e,f,g){a.stopPropagation();var h=[b,c,d,e,f,g],i=["string/number/object","number","boolean","object","string","function"],j=cf_sortParams(h,i);return e=j[3],f=j[4],g=j[5],b=gn_getItemIndex(j[0],j[1],j[2],itms,$cfs),0==b?!1:(is_object(e)||(e=!1),"prev"!=f&&"next"!=f&&(f=opts.circular?itms.total/2>=b?"next":"prev":0==itms.first||itms.first>b?"next":"prev"),"prev"==f&&(b=itms.total-b),$cfs.trigger(cf_e(f,conf),[e,b,g]),!0)}),$cfs.bind(cf_e("prevPage",conf),function(a,b,c){a.stopPropagation();var d=$cfs.triggerHandler(cf_e("currentPage",conf));return $cfs.triggerHandler(cf_e("slideToPage",conf),[d-1,b,"prev",c])}),$cfs.bind(cf_e("nextPage",conf),function(a,b,c){a.stopPropagation();var d=$cfs.triggerHandler(cf_e("currentPage",conf));return $cfs.triggerHandler(cf_e("slideToPage",conf),[d+1,b,"next",c])}),$cfs.bind(cf_e("slideToPage",conf),function(a,b,c,d,e){a.stopPropagation(),is_number(b)||(b=$cfs.triggerHandler(cf_e("currentPage",conf)));var f=opts.pagination.items||opts.items.visible,g=Math.ceil(itms.total/f)-1;return 0>b&&(b=g),b>g&&(b=0),$cfs.triggerHandler(cf_e("slideTo",conf),[b*f,0,!0,c,d,e])}),$cfs.bind(cf_e("jumpToStart",conf),function(a,b){if(a.stopPropagation(),b=b?gn_getItemIndex(b,0,!0,itms,$cfs):0,b+=itms.first,0!=b){if(itms.total>0)for(;b>itms.total;)b-=itms.total;$cfs.prepend($cfs.children().slice(b,itms.total))}return!0}),$cfs.bind(cf_e("synchronise",conf),function(a,b){if(a.stopPropagation(),b)b=cf_getSynchArr(b);else{if(!opts.synchronise)return debug(conf,"No carousel to synchronise.");b=opts.synchronise}for(var c=$cfs.triggerHandler(cf_e("currentPosition",conf)),d=!0,e=0,f=b.length;f>e;e++)b[e][0].triggerHandler(cf_e("slideTo",conf),[c,b[e][3],!0])||(d=!1);return d}),$cfs.bind(cf_e("queue",conf),function(a,b,c){return a.stopPropagation(),is_function(b)?b.call($tt0,queu):is_array(b)?queu=b:is_undefined(b)||queu.push([b,c]),queu}),$cfs.bind(cf_e("insertItem",conf),function(a,b,c,d,e){a.stopPropagation();var f=[b,c,d,e],g=["string/object","string/number/object","boolean","number"],h=cf_sortParams(f,g);if(b=h[0],c=h[1],d=h[2],e=h[3],is_object(b)&&!is_jquery(b)?b=$(b):is_string(b)&&(b=$(b)),!is_jquery(b)||0==b.length)return debug(conf,"Not a valid object.");is_undefined(c)&&(c="end"),sz_storeMargin(b,opts),sz_storeOrigCss(b);var i=c,j="before";"end"==c?d?(0==itms.first?(c=itms.total-1,j="after"):(c=itms.first,itms.first+=b.length),0>c&&(c=0)):(c=itms.total-1,j="after"):c=gn_getItemIndex(c,e,d,itms,$cfs);var k=$cfs.children().eq(c);return k.length?k[j](b):(debug(conf,"Correct insert-position not found! Appending item to the end."),$cfs.append(b)),"end"==i||d||itms.first>c&&(itms.first+=b.length),itms.total=$cfs.children().length,itms.first>=itms.total&&(itms.first-=itms.total),$cfs.trigger(cf_e("updateSizes",conf)),$cfs.trigger(cf_e("linkAnchors",conf)),!0}),$cfs.bind(cf_e("removeItem",conf),function(a,b,c,d){a.stopPropagation();var e=[b,c,d],f=["string/number/object","boolean","number"],g=cf_sortParams(e,f);if(b=g[0],c=g[1],d=g[2],b instanceof $&&b.length>1)return i=$(),b.each(function(){var e=$cfs.trigger(cf_e("removeItem",conf),[$(this),c,d]);e&&(i=i.add(e))}),i;if(is_undefined(b)||"end"==b)i=$cfs.children().last();else{b=gn_getItemIndex(b,d,c,itms,$cfs);var i=$cfs.children().eq(b);i.length&&itms.first>b&&(itms.first-=i.length)}return i&&i.length&&(i.detach(),itms.total=$cfs.children().length,$cfs.trigger(cf_e("updateSizes",conf))),i}),$cfs.bind(cf_e("onBefore",conf)+" "+cf_e("onAfter",conf),function(a,b){a.stopPropagation();var c=a.type.slice(conf.events.prefix.length);return is_array(b)&&(clbk[c]=b),is_function(b)&&clbk[c].push(b),clbk[c]}),$cfs.bind(cf_e("currentPosition",conf),function(a,b){if(a.stopPropagation(),0==itms.first)var c=0;else var c=itms.total-itms.first;return is_function(b)&&b.call($tt0,c),c}),$cfs.bind(cf_e("currentPage",conf),function(a,b){a.stopPropagation();var e,c=opts.pagination.items||opts.items.visible,d=Math.ceil(itms.total/c-1);return e=0==itms.first?0:itms.first<itms.total%c?0:itms.first!=c||opts.circular?Math.round((itms.total-itms.first)/c):d,0>e&&(e=0),e>d&&(e=d),is_function(b)&&b.call($tt0,e),e}),$cfs.bind(cf_e("currentVisible",conf),function(a,b){a.stopPropagation();var c=gi_getCurrentItems($cfs.children(),opts);return is_function(b)&&b.call($tt0,c),c}),$cfs.bind(cf_e("slice",conf),function(a,b,c,d){if(a.stopPropagation(),0==itms.total)return!1;var e=[b,c,d],f=["number","number","function"],g=cf_sortParams(e,f);if(b=is_number(g[0])?g[0]:0,c=is_number(g[1])?g[1]:itms.total,d=g[2],b+=itms.first,c+=itms.first,items.total>0){for(;b>itms.total;)b-=itms.total;for(;c>itms.total;)c-=itms.total;for(;0>b;)b+=itms.total;for(;0>c;)c+=itms.total}var i,h=$cfs.children();return i=c>b?h.slice(b,c):$(h.slice(b,itms.total).get().concat(h.slice(0,c).get())),is_function(d)&&d.call($tt0,i),i}),$cfs.bind(cf_e("isPaused",conf)+" "+cf_e("isStopped",conf)+" "+cf_e("isScrolling",conf),function(a,b){a.stopPropagation();var c=a.type.slice(conf.events.prefix.length),d=crsl[c];return is_function(b)&&b.call($tt0,d),d}),$cfs.bind(cf_e("configuration",conf),function(e,a,b,c){e.stopPropagation();var reInit=!1;if(is_function(a))a.call($tt0,opts);else if(is_object(a))opts_orig=$.extend(!0,{},opts_orig,a),b!==!1?reInit=!0:opts=$.extend(!0,{},opts,a);else if(!is_undefined(a))if(is_function(b)){var val=eval("opts."+a);is_undefined(val)&&(val=""),b.call($tt0,val)}else{if(is_undefined(b))return eval("opts."+a);"boolean"!=typeof c&&(c=!0),eval("opts_orig."+a+" = b"),c!==!1?reInit=!0:eval("opts."+a+" = b")}if(reInit){sz_resetMargin($cfs.children(),opts),FN._init(opts_orig),FN._bind_buttons();var sz=sz_setSizes($cfs,opts);$cfs.trigger(cf_e("updatePageStatus",conf),[!0,sz])}return opts}),$cfs.bind(cf_e("linkAnchors",conf),function(a,b,c){return a.stopPropagation(),is_undefined(b)?b=$("body"):is_string(b)&&(b=$(b)),is_jquery(b)&&0!=b.length?(is_string(c)||(c="a.caroufredsel"),b.find(c).each(function(){var a=this.hash||"";a.length>0&&-1!=$cfs.children().index($(a))&&$(this).unbind("click").click(function(b){b.preventDefault(),$cfs.trigger(cf_e("slideTo",conf),a)})}),!0):debug(conf,"Not a valid object.")}),$cfs.bind(cf_e("updatePageStatus",conf),function(a,b){if(a.stopPropagation(),opts.pagination.container){var d=opts.pagination.items||opts.items.visible,e=Math.ceil(itms.total/d);b&&(opts.pagination.anchorBuilder&&(opts.pagination.container.children().remove(),opts.pagination.container.each(function(){for(var a=0;e>a;a++){var b=$cfs.children().eq(gn_getItemIndex(a*d,0,!0,itms,$cfs));$(this).append(opts.pagination.anchorBuilder.call(b[0],a+1))}})),opts.pagination.container.each(function(){$(this).children().unbind(opts.pagination.event).each(function(a){$(this).bind(opts.pagination.event,function(b){b.preventDefault(),$cfs.trigger(cf_e("slideTo",conf),[a*d,-opts.pagination.deviation,!0,opts.pagination])})})}));var f=$cfs.triggerHandler(cf_e("currentPage",conf))+opts.pagination.deviation;return f>=e&&(f=0),0>f&&(f=e-1),opts.pagination.container.each(function(){$(this).children().removeClass(cf_c("selected",conf)).eq(f).addClass(cf_c("selected",conf))}),!0}}),$cfs.bind(cf_e("updateSizes",conf),function(){var b=opts.items.visible,c=$cfs.children(),d=ms_getParentSize($wrp,opts,"width");if(itms.total=c.length,crsl.primarySizePercentage?(opts.maxDimension=d,opts[opts.d.width]=ms_getPercentage(d,crsl.primarySizePercentage)):opts.maxDimension=ms_getMaxDimension(opts,d),opts.responsive?(opts.items.width=opts.items.sizesConf.width,opts.items.height=opts.items.sizesConf.height,opts=in_getResponsiveValues(opts,c,d),b=opts.items.visible,sz_setResponsiveSizes(opts,c)):opts.items.visibleConf.variable?b=gn_getVisibleItemsNext(c,opts,0):"*"!=opts.items.filter&&(b=gn_getVisibleItemsNextFilter(c,opts,0)),!opts.circular&&0!=itms.first&&b>itms.first){if(opts.items.visibleConf.variable)var e=gn_getVisibleItemsPrev(c,opts,itms.first)-itms.first;else if("*"!=opts.items.filter)var e=gn_getVisibleItemsPrevFilter(c,opts,itms.first)-itms.first;else var e=opts.items.visible-itms.first;debug(conf,"Preventing non-circular: sliding "+e+" items backward."),$cfs.trigger(cf_e("prev",conf),e)}opts.items.visible=cf_getItemsAdjust(b,opts,opts.items.visibleConf.adjust,$tt0),opts.items.visibleConf.old=opts.items.visible,opts=in_getAlignPadding(opts,c);var f=sz_setSizes($cfs,opts);return $cfs.trigger(cf_e("updatePageStatus",conf),[!0,f]),nv_showNavi(opts,itms.total,conf),nv_enableNavi(opts,itms.first,conf),f}),$cfs.bind(cf_e("destroy",conf),function(a,b){return a.stopPropagation(),tmrs=sc_clearTimers(tmrs),$cfs.data("_cfs_isCarousel",!1),$cfs.trigger(cf_e("finish",conf)),b&&$cfs.trigger(cf_e("jumpToStart",conf)),sz_restoreOrigCss($cfs.children()),sz_restoreOrigCss($cfs),FN._unbind_events(),FN._unbind_buttons(),"parent"==conf.wrapper?sz_restoreOrigCss($wrp):$wrp.replaceWith($cfs),!0}),$cfs.bind(cf_e("debug",conf),function(){return debug(conf,"Carousel width: "+opts.width),debug(conf,"Carousel height: "+opts.height),debug(conf,"Item widths: "+opts.items.width),debug(conf,"Item heights: "+opts.items.height),debug(conf,"Number of items visible: "+opts.items.visible),opts.auto.play&&debug(conf,"Number of items scrolled automatically: "+opts.auto.items),opts.prev.button&&debug(conf,"Number of items scrolled backward: "+opts.prev.items),opts.next.button&&debug(conf,"Number of items scrolled forward: "+opts.next.items),conf.debug}),$cfs.bind("_cfs_triggerEvent",function(a,b,c){return a.stopPropagation(),$cfs.triggerHandler(cf_e(b,conf),c)})},FN._unbind_events=function(){$cfs.unbind(cf_e("",conf)),$cfs.unbind(cf_e("",conf,!1)),$cfs.unbind("_cfs_triggerEvent")},FN._bind_buttons=function(){if(FN._unbind_buttons(),nv_showNavi(opts,itms.total,conf),nv_enableNavi(opts,itms.first,conf),opts.auto.pauseOnHover){var a=bt_pauseOnHoverConfig(opts.auto.pauseOnHover);$wrp.bind(cf_e("mouseenter",conf,!1),function(){$cfs.trigger(cf_e("pause",conf),a)}).bind(cf_e("mouseleave",conf,!1),function(){$cfs.trigger(cf_e("resume",conf))})}if(opts.auto.button&&opts.auto.button.bind(cf_e(opts.auto.event,conf,!1),function(a){a.preventDefault();var b=!1,c=null;crsl.isPaused?b="play":opts.auto.pauseOnEvent&&(b="pause",c=bt_pauseOnHoverConfig(opts.auto.pauseOnEvent)),b&&$cfs.trigger(cf_e(b,conf),c)}),opts.prev.button&&(opts.prev.button.bind(cf_e(opts.prev.event,conf,!1),function(a){a.preventDefault(),$cfs.trigger(cf_e("prev",conf))}),opts.prev.pauseOnHover)){var a=bt_pauseOnHoverConfig(opts.prev.pauseOnHover);opts.prev.button.bind(cf_e("mouseenter",conf,!1),function(){$cfs.trigger(cf_e("pause",conf),a)}).bind(cf_e("mouseleave",conf,!1),function(){$cfs.trigger(cf_e("resume",conf))})}if(opts.next.button&&(opts.next.button.bind(cf_e(opts.next.event,conf,!1),function(a){a.preventDefault(),$cfs.trigger(cf_e("next",conf))}),opts.next.pauseOnHover)){var a=bt_pauseOnHoverConfig(opts.next.pauseOnHover);opts.next.button.bind(cf_e("mouseenter",conf,!1),function(){$cfs.trigger(cf_e("pause",conf),a)}).bind(cf_e("mouseleave",conf,!1),function(){$cfs.trigger(cf_e("resume",conf))})}if(opts.pagination.container&&opts.pagination.pauseOnHover){var a=bt_pauseOnHoverConfig(opts.pagination.pauseOnHover);opts.pagination.container.bind(cf_e("mouseenter",conf,!1),function(){$cfs.trigger(cf_e("pause",conf),a)}).bind(cf_e("mouseleave",conf,!1),function(){$cfs.trigger(cf_e("resume",conf))})}if((opts.prev.key||opts.next.key)&&$(document).bind(cf_e("keyup",conf,!1,!0,!0),function(a){var b=a.keyCode;b==opts.next.key&&(a.preventDefault(),$cfs.trigger(cf_e("next",conf))),b==opts.prev.key&&(a.preventDefault(),$cfs.trigger(cf_e("prev",conf)))}),opts.pagination.keys&&$(document).bind(cf_e("keyup",conf,!1,!0,!0),function(a){var b=a.keyCode;b>=49&&58>b&&(b=(b-49)*opts.items.visible,itms.total>=b&&(a.preventDefault(),$cfs.trigger(cf_e("slideTo",conf),[b,0,!0,opts.pagination])))}),$.fn.swipe){var b="ontouchstart"in window;if(b&&opts.swipe.onTouch||!b&&opts.swipe.onMouse){var c=$.extend(!0,{},opts.prev,opts.swipe),d=$.extend(!0,{},opts.next,opts.swipe),e=function(){$cfs.trigger(cf_e("prev",conf),[c])},f=function(){$cfs.trigger(cf_e("next",conf),[d])};switch(opts.direction){case"up":case"down":opts.swipe.options.swipeUp=f,opts.swipe.options.swipeDown=e;break;default:opts.swipe.options.swipeLeft=f,opts.swipe.options.swipeRight=e}crsl.swipe&&$cfs.swipe("destroy"),$wrp.swipe(opts.swipe.options),$wrp.css("cursor","move"),crsl.swipe=!0}}if($.fn.mousewheel&&opts.mousewheel){var g=$.extend(!0,{},opts.prev,opts.mousewheel),h=$.extend(!0,{},opts.next,opts.mousewheel);crsl.mousewheel&&$wrp.unbind(cf_e("mousewheel",conf,!1)),$wrp.bind(cf_e("mousewheel",conf,!1),function(a,b){a.preventDefault(),b>0?$cfs.trigger(cf_e("prev",conf),[g]):$cfs.trigger(cf_e("next",conf),[h])}),crsl.mousewheel=!0}if(opts.auto.play&&$cfs.trigger(cf_e("play",conf),opts.auto.delay),crsl.upDateOnWindowResize){var i=function(){$cfs.trigger(cf_e("finish",conf)),opts.auto.pauseOnResize&&!crsl.isPaused&&$cfs.trigger(cf_e("play",conf)),sz_resetMargin($cfs.children(),opts),$cfs.trigger(cf_e("updateSizes",conf))},j=$(window),k=null;if($.debounce&&"debounce"==conf.onWindowResize)k=$.debounce(200,i);else if($.throttle&&"throttle"==conf.onWindowResize)k=$.throttle(300,i);else{var l=0,m=0;k=function(){var a=j.width(),b=j.height();(a!=l||b!=m)&&(i(),l=a,m=b)}}j.bind(cf_e("resize",conf,!1,!0,!0),k)}},FN._unbind_buttons=function(){var b=(cf_e("",conf),cf_e("",conf,!1));ns3=cf_e("",conf,!1,!0,!0),$(document).unbind(ns3),$(window).unbind(ns3),$wrp.unbind(b),opts.auto.button&&opts.auto.button.unbind(b),opts.prev.button&&opts.prev.button.unbind(b),opts.next.button&&opts.next.button.unbind(b),opts.pagination.container&&(opts.pagination.container.unbind(b),opts.pagination.anchorBuilder&&opts.pagination.container.children().remove()),crsl.swipe&&($cfs.swipe("destroy"),$wrp.css("cursor","default"),crsl.swipe=!1),crsl.mousewheel&&(crsl.mousewheel=!1),nv_showNavi(opts,"hide",conf),nv_enableNavi(opts,"removeClass",conf)},is_boolean(configs)&&(configs={debug:configs});var crsl={direction:"next",isPaused:!0,isScrolling:!1,isStopped:!1,mousewheel:!1,swipe:!1},itms={total:$cfs.children().length,first:0},tmrs={auto:null,progress:null,startTime:getTime(),timePassed:0},scrl={isStopped:!1,duration:0,startTime:0,easing:"",anims:[]},clbk={onBefore:[],onAfter:[]},queu=[],conf=$.extend(!0,{},$.fn.carouFredSel.configs,configs),opts={},opts_orig=$.extend(!0,{},options),$wrp="parent"==conf.wrapper?$cfs.parent():$cfs.wrap("<"+conf.wrapper.element+' class="'+conf.wrapper.classname+'" />').parent();if(conf.selector=$cfs.selector,conf.serialNumber=$.fn.carouFredSel.serialNumber++,conf.transition=conf.transition&&$.fn.transition?"transition":"animate",FN._init(opts_orig,!0,starting_position),FN._build(),FN._bind_events(),FN._bind_buttons(),is_array(opts.items.start))var start_arr=opts.items.start;else{var start_arr=[];0!=opts.items.start&&start_arr.push(opts.items.start)}if(opts.cookie&&start_arr.unshift(parseInt(cf_getCookie(opts.cookie),10)),start_arr.length>0)for(var a=0,l=start_arr.length;l>a;a++){var s=start_arr[a];if(0!=s){if(s===!0){if(s=window.location.hash,1>s.length)continue}else"random"===s&&(s=Math.floor(Math.random()*itms.total));if($cfs.triggerHandler(cf_e("slideTo",conf),[s,0,!0,{fx:"none"}]))break}}var siz=sz_setSizes($cfs,opts),itm=gi_getCurrentItems($cfs.children(),opts);return opts.onCreate&&opts.onCreate.call($tt0,{width:siz.width,height:siz.height,items:itm}),$cfs.trigger(cf_e("updatePageStatus",conf),[!0,siz]),$cfs.trigger(cf_e("linkAnchors",conf)),conf.debug&&$cfs.trigger(cf_e("debug",conf)),$cfs},$.fn.carouFredSel.serialNumber=1,$.fn.carouFredSel.defaults={synchronise:!1,infinite:!0,circular:!0,responsive:!1,direction:"left",items:{start:0},scroll:{easing:"swing",duration:500,pauseOnHover:!1,event:"click",queue:!1}},$.fn.carouFredSel.configs={debug:!1,transition:!1,onWindowResize:"throttle",events:{prefix:"",namespace:"cfs"},wrapper:{element:"div",classname:"caroufredsel_wrapper"},classnames:{}},$.fn.carouFredSel.pageAnchorBuilder=function(a){return'<a href="#"><span>'+a+"</span></a>"},$.fn.carouFredSel.progressbarUpdater=function(a){$(this).css("width",a+"%")},$.fn.carouFredSel.cookie={get:function(a){a+="=";for(var b=document.cookie.split(";"),c=0,d=b.length;d>c;c++){for(var e=b[c];" "==e.charAt(0);)e=e.slice(1);if(0==e.indexOf(a))return e.slice(a.length)}return 0},set:function(a,b,c){var d="";if(c){var e=new Date;e.setTime(e.getTime()+1e3*60*60*24*c),d="; expires="+e.toGMTString()}document.cookie=a+"="+b+d+"; path=/"},remove:function(a){$.fn.carouFredSel.cookie.set(a,"",-1)}},$.extend($.easing,{quadratic:function(a){var b=a*a;return a*(-b*a+4*b-6*a+4)},cubic:function(a){return a*(4*a*a-9*a+6)},elastic:function(a){var b=a*a;return a*(33*b*b-106*b*a+126*b-67*a+15)}}))})(jQuery);

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
;(function($,window,undefined){'use strict';$.HoverDir=function(options,element){this.$el=$(element);this._init(options);};$.HoverDir.defaults={speed:300,easing:'ease',hoverDelay:0,inverse:false,hoverElem:'div'};$.HoverDir.prototype={_init:function(options){this.options=$.extend(true,{},$.HoverDir.defaults,options);this.transitionProp='all '+this.options.speed+'ms '+this.options.easing;this.support=Modernizr.csstransitions;this._loadEvents();},_loadEvents:function(){var self=this;this.$el.on('mouseenter.hoverdir, mouseleave.hoverdir',function(event){var $el=$(this),$hoverElem=$el.find(self.options.hoverElem),direction=self._getDir($el,{x:event.pageX,y:event.pageY}),styleCSS=self._getStyle(direction);if(event.type==='mouseenter'){$hoverElem.hide().css(styleCSS.from);clearTimeout(self.tmhover);self.tmhover=setTimeout(function(){$hoverElem.show(0,function(){var $el=$(this);if(self.support){$el.css('transition',self.transitionProp);}
self._applyAnimation($el,styleCSS.to,self.options.speed);});},self.options.hoverDelay);}
else{if(self.support){$hoverElem.css('transition',self.transitionProp);}
clearTimeout(self.tmhover);self._applyAnimation($hoverElem,styleCSS.from,self.options.speed);}});},_getDir:function($el,coordinates){var w=$el.width(),h=$el.height(),x=(coordinates.x-$el.offset().left-(w/2))*(w>h?(h/w):1),y=(coordinates.y-$el.offset().top-(h/2))*(h>w?(w/h):1),direction=Math.round((((Math.atan2(y,x)*(180/Math.PI))+180)/90)+3)%4;return direction;},_getStyle:function(direction){var fromStyle,toStyle,slideFromTop={left:'0px',top:'-100%'},slideFromBottom={left:'0px',top:'100%'},slideFromLeft={left:'-100%',top:'0px'},slideFromRight={left:'100%',top:'0px'},slideTop={top:'0px'},slideLeft={left:'0px'};switch(direction){case 0:fromStyle=!this.options.inverse?slideFromTop:slideFromBottom;toStyle=slideTop;break;case 1:fromStyle=!this.options.inverse?slideFromRight:slideFromLeft;toStyle=slideLeft;break;case 2:fromStyle=!this.options.inverse?slideFromBottom:slideFromTop;toStyle=slideTop;break;case 3:fromStyle=!this.options.inverse?slideFromLeft:slideFromRight;toStyle=slideLeft;break;};return{from:fromStyle,to:toStyle};},_applyAnimation:function(el,styleCSS,speed){$.fn.applyStyle=this.support?$.fn.css:$.fn.animate;el.stop().applyStyle(styleCSS,$.extend(true,[],{duration:speed+'ms'}));}};var logError=function(message){if(window.console){window.console.error(message);}};$.fn.hoverdir=function(options){var instance=$.data(this,'hoverdir');if(typeof options==='string'){var args=Array.prototype.slice.call(arguments,1);this.each(function(){if(!instance){logError("cannot call methods on hoverdir prior to initialization; "+"attempted to call method '"+options+"'");return;}
if(!$.isFunction(instance[options])||options.charAt(0)==="_"){logError("no such method '"+options+"' for hoverdir instance");return;}
instance[options].apply(instance,args);});}
else{this.each(function(){if(instance){instance._init();}
else{instance=$.data(this,'hoverdir',new $.HoverDir(options,this));}});}
return instance;};})(jQuery,window);

/*
	DoubleTapToGo - Touch device friendly
	AUTHOR: Osvaldas Valutis, www.osvaldas.info
*/
;(function(e,t,n,r){e.fn.doubleTapToGo=function(r){if(!("ontouchstart"in t)&&!navigator.msMaxTouchPoints&&!navigator.userAgent.toLowerCase().match(/windows phone os 7/i))return false;this.each(function(){var t=false;e(this).on("click",function(n){var r=e(this);if(r[0]!=t[0]){n.preventDefault();t=r}});e(n).on("click touchstart MSPointerDown",function(n){var r=true,i=e(n.target).parents();for(var s=0;s<i.length;s++)if(i[s]==t[0])r=false;if(r)t=false})});return this}})(jQuery,window,document);

/*!
 * jQuery imagesLoaded plugin v1.2.3
 * http://github.com/desandro/imagesloaded
 *
 * MIT License. by Paul Irish et al.
 */
;(function($, undefined) {

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

$.fn.imagesLoaded=function(callback){var $this=this,deferred=$.isFunction($.Deferred)?$.Deferred():0,hasNotify=$.isFunction(deferred.notify),$images=$this.find('img').add($this.filter('img')),len=$images.length,blank='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',loaded=[],proper=[],broken=[];function doneLoading(){var $proper=$(proper),$broken=$(broken);if(deferred){if(broken.length){deferred.reject($images,$proper,$broken)}else{deferred.resolve($images)}}if($.isFunction(callback)){callback.call($this,$images,$proper,$broken)}}function imgLoaded(event){if(event.target.src===blank||$.inArray(this,loaded)!==-1){return}loaded.push(this);if(event.type==='error'){broken.push(this)}else{proper.push(this)}$.data(this,'imagesLoaded',event.type);if(hasNotify){deferred.notify($images.length,loaded.length,proper.length,broken.length)}if(--len<=0){setTimeout(doneLoading);$images.unbind('.imagesLoaded',imgLoaded)}}if(!len){doneLoading()}$images.bind('load.imagesLoaded error.imagesLoaded',imgLoaded).each(function(){var cachedEvent=$.data(this,'imagesLoaded');if(cachedEvent){$(this).triggerHandler(cachedEvent);return}var src=this.src;this.src=blank;this.src=src});return deferred?deferred.promise($this):$this}})(jQuery);

// SmoothScroll for websites v1.2.1
// Licensed under the terms of the MIT license.

// People involved
//  - Balazs Galambosi (maintainer)
//  - Michael Herf     (Pulse Algorithm)

!function(){function e(){var e=!1;e&&c("keydown",r),v.keyboardSupport&&!e&&u("keydown",r)}function t(){if(document.body){var t=document.body,o=document.documentElement,n=window.innerHeight,r=t.scrollHeight;if(S=document.compatMode.indexOf("CSS")>=0?o:t,w=t,e(),x=!0,top!=self)y=!0;else if(r>n&&(t.offsetHeight<=n||o.offsetHeight<=n)){var a=!1,i=function(){a||o.scrollHeight==document.height||(a=!0,setTimeout(function(){o.style.height=document.height+"px",a=!1},500))};if(o.style.height="auto",setTimeout(i,10),S.offsetHeight<=n){var l=document.createElement("div");l.style.clear="both",t.appendChild(l)}}v.fixedBackground||b||(t.style.backgroundAttachment="scroll",o.style.backgroundAttachment="scroll")}}function o(e,t,o,n){if(n||(n=1e3),d(t,o),1!=v.accelerationMax){var r=+new Date,a=r-C;if(a<v.accelerationDelta){var i=(1+30/a)/2;i>1&&(i=Math.min(i,v.accelerationMax),t*=i,o*=i)}C=+new Date}if(M.push({x:t,y:o,lastX:0>t?.99:-.99,lastY:0>o?.99:-.99,start:+new Date}),!T){var l=e===document.body,u=function(){for(var r=+new Date,a=0,i=0,c=0;c<M.length;c++){var s=M[c],d=r-s.start,f=d>=v.animationTime,h=f?1:d/v.animationTime;v.pulseAlgorithm&&(h=p(h));var m=s.x*h-s.lastX>>0,w=s.y*h-s.lastY>>0;a+=m,i+=w,s.lastX+=m,s.lastY+=w,f&&(M.splice(c,1),c--)}l?window.scrollBy(a,i):(a&&(e.scrollLeft+=a),i&&(e.scrollTop+=i)),t||o||(M=[]),M.length?E(u,e,n/v.frameRate+1):T=!1};E(u,e,0),T=!0}}function n(e){x||t();var n=e.target,r=l(n);if(!r||e.defaultPrevented||s(w,"embed")||s(n,"embed")&&/\.pdf/i.test(n.src))return!0;var a=e.wheelDeltaX||0,i=e.wheelDeltaY||0;return a||i||(i=e.wheelDelta||0),!v.touchpadSupport&&f(i)?!0:(Math.abs(a)>1.2&&(a*=v.stepSize/120),Math.abs(i)>1.2&&(i*=v.stepSize/120),o(r,-a,-i),void e.preventDefault())}function r(e){var t=e.target,n=e.ctrlKey||e.altKey||e.metaKey||e.shiftKey&&e.keyCode!==H.spacebar;if(/input|textarea|select|embed/i.test(t.nodeName)||t.isContentEditable||e.defaultPrevented||n)return!0;if(s(t,"button")&&e.keyCode===H.spacebar)return!0;var r,a=0,i=0,u=l(w),c=u.clientHeight;switch(u==document.body&&(c=window.innerHeight),e.keyCode){case H.up:i=-v.arrowScroll;break;case H.down:i=v.arrowScroll;break;case H.spacebar:r=e.shiftKey?1:-1,i=-r*c*.9;break;case H.pageup:i=.9*-c;break;case H.pagedown:i=.9*c;break;case H.home:i=-u.scrollTop;break;case H.end:var d=u.scrollHeight-u.scrollTop-c;i=d>0?d+10:0;break;case H.left:a=-v.arrowScroll;break;case H.right:a=v.arrowScroll;break;default:return!0}o(u,a,i),e.preventDefault()}function a(e){w=e.target}function i(e,t){for(var o=e.length;o--;)z[N(e[o])]=t;return t}function l(e){var t=[],o=S.scrollHeight;do{var n=z[N(e)];if(n)return i(t,n);if(t.push(e),o===e.scrollHeight){if(!y||S.clientHeight+10<o)return i(t,document.body)}else if(e.clientHeight+10<e.scrollHeight&&(overflow=getComputedStyle(e,"").getPropertyValue("overflow-y"),"scroll"===overflow||"auto"===overflow))return i(t,e)}while(e=e.parentNode)}function u(e,t,o){window.addEventListener(e,t,o||!1)}function c(e,t,o){window.removeEventListener(e,t,o||!1)}function s(e,t){return(e.nodeName||"").toLowerCase()===t.toLowerCase()}function d(e,t){e=e>0?1:-1,t=t>0?1:-1,(k.x!==e||k.y!==t)&&(k.x=e,k.y=t,M=[],C=0)}function f(e){if(e){e=Math.abs(e),D.push(e),D.shift(),clearTimeout(A);var t=D[0]==D[1]&&D[1]==D[2],o=h(D[0],120)&&h(D[1],120)&&h(D[2],120);return!(t||o)}}function h(e,t){return Math.floor(e/t)==e/t}function m(e){var t,o,n;return e*=v.pulseScale,1>e?t=e-(1-Math.exp(-e)):(o=Math.exp(-1),e-=1,n=1-Math.exp(-e),t=o+n*(1-o)),t*v.pulseNormalize}function p(e){return e>=1?1:0>=e?0:(1==v.pulseNormalize&&(v.pulseNormalize/=m(1)),m(e))}var w,g={frameRate:150,animationTime:800,stepSize:120,pulseAlgorithm:!0,pulseScale:8,pulseNormalize:1,accelerationDelta:20,accelerationMax:1,keyboardSupport:!0,arrowScroll:50,touchpadSupport:!0,fixedBackground:!0,excluded:""},v=g,b=!1,y=!1,k={x:0,y:0},x=!1,S=document.documentElement,D=[120,120,120],H={left:37,up:38,right:39,down:40,spacebar:32,pageup:33,pagedown:34,end:35,home:36},v=g,M=[],T=!1,C=+new Date,z={};setInterval(function(){z={}},1e4);var A,N=function(){var e=0;return function(t){return t.uniqueID||(t.uniqueID=e++)}}(),E=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(e,t,o){window.setTimeout(e,o||1e3/60)}}(),K=/chrome/i.test(window.navigator.userAgent),L="onmousewheel"in document;L&&K&&(u("mousedown",a),u("mousewheel",n),u("load",t))}();


// Generated by CoffeeScript 1.6.2
/*
jQuery Waypoints - v2.0.4
Copyright (c) 2011-2014 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function(){var t=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++){if(e in this&&this[e]===t)return e}return-1},e=[].slice;(function(t,e){if(typeof define==="function"&&define.amd){return define("waypoints",["jquery"],function(n){return e(n,t)})}else{return e(t.jQuery,t)}})(this,function(n,r){var i,o,l,s,f,u,c,a,h,d,p,y,v,w,g,m;i=n(r);a=t.call(r,"ontouchstart")>=0;s={horizontal:{},vertical:{}};f=1;c={};u="waypoints-context-id";p="resize.waypoints";y="scroll.waypoints";v=1;w="waypoints-waypoint-ids";g="waypoint";m="waypoints";o=function(){function t(t){var e=this;this.$element=t;this.element=t[0];this.didResize=false;this.didScroll=false;this.id="context"+f++;this.oldScroll={x:t.scrollLeft(),y:t.scrollTop()};this.waypoints={horizontal:{},vertical:{}};this.element[u]=this.id;c[this.id]=this;t.bind(y,function(){var t;if(!(e.didScroll||a)){e.didScroll=true;t=function(){e.doScroll();return e.didScroll=false};return r.setTimeout(t,n[m].settings.scrollThrottle)}});t.bind(p,function(){var t;if(!e.didResize){e.didResize=true;t=function(){n[m]("refresh");return e.didResize=false};return r.setTimeout(t,n[m].settings.resizeThrottle)}})}t.prototype.doScroll=function(){var t,e=this;t={horizontal:{newScroll:this.$element.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.$element.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};if(a&&(!t.vertical.oldScroll||!t.vertical.newScroll)){n[m]("refresh")}n.each(t,function(t,r){var i,o,l;l=[];o=r.newScroll>r.oldScroll;i=o?r.forward:r.backward;n.each(e.waypoints[t],function(t,e){var n,i;if(r.oldScroll<(n=e.offset)&&n<=r.newScroll){return l.push(e)}else if(r.newScroll<(i=e.offset)&&i<=r.oldScroll){return l.push(e)}});l.sort(function(t,e){return t.offset-e.offset});if(!o){l.reverse()}return n.each(l,function(t,e){if(e.options.continuous||t===l.length-1){return e.trigger([i])}})});return this.oldScroll={x:t.horizontal.newScroll,y:t.vertical.newScroll}};t.prototype.refresh=function(){var t,e,r,i=this;r=n.isWindow(this.element);e=this.$element.offset();this.doScroll();t={horizontal:{contextOffset:r?0:e.left,contextScroll:r?0:this.oldScroll.x,contextDimension:this.$element.width(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:r?0:e.top,contextScroll:r?0:this.oldScroll.y,contextDimension:r?n[m]("viewportHeight"):this.$element.height(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};return n.each(t,function(t,e){return n.each(i.waypoints[t],function(t,r){var i,o,l,s,f;i=r.options.offset;l=r.offset;o=n.isWindow(r.element)?0:r.$element.offset()[e.offsetProp];if(n.isFunction(i)){i=i.apply(r.element)}else if(typeof i==="string"){i=parseFloat(i);if(r.options.offset.indexOf("%")>-1){i=Math.ceil(e.contextDimension*i/100)}}r.offset=o-e.contextOffset+e.contextScroll-i;if(r.options.onlyOnScroll&&l!=null||!r.enabled){return}if(l!==null&&l<(s=e.oldScroll)&&s<=r.offset){return r.trigger([e.backward])}else if(l!==null&&l>(f=e.oldScroll)&&f>=r.offset){return r.trigger([e.forward])}else if(l===null&&e.oldScroll>=r.offset){return r.trigger([e.forward])}})})};t.prototype.checkEmpty=function(){if(n.isEmptyObject(this.waypoints.horizontal)&&n.isEmptyObject(this.waypoints.vertical)){this.$element.unbind([p,y].join(" "));return delete c[this.id]}};return t}();l=function(){function t(t,e,r){var i,o;r=n.extend({},n.fn[g].defaults,r);if(r.offset==="bottom-in-view"){r.offset=function(){var t;t=n[m]("viewportHeight");if(!n.isWindow(e.element)){t=e.$element.height()}return t-n(this).outerHeight()}}this.$element=t;this.element=t[0];this.axis=r.horizontal?"horizontal":"vertical";this.callback=r.handler;this.context=e;this.enabled=r.enabled;this.id="waypoints"+v++;this.offset=null;this.options=r;e.waypoints[this.axis][this.id]=this;s[this.axis][this.id]=this;i=(o=this.element[w])!=null?o:[];i.push(this.id);this.element[w]=i}t.prototype.trigger=function(t){if(!this.enabled){return}if(this.callback!=null){this.callback.apply(this.element,t)}if(this.options.triggerOnce){return this.destroy()}};t.prototype.disable=function(){return this.enabled=false};t.prototype.enable=function(){this.context.refresh();return this.enabled=true};t.prototype.destroy=function(){delete s[this.axis][this.id];delete this.context.waypoints[this.axis][this.id];return this.context.checkEmpty()};t.getWaypointsByElement=function(t){var e,r;r=t[w];if(!r){return[]}e=n.extend({},s.horizontal,s.vertical);return n.map(r,function(t){return e[t]})};return t}();d={init:function(t,e){var r;if(e==null){e={}}if((r=e.handler)==null){e.handler=t}this.each(function(){var t,r,i,s;t=n(this);i=(s=e.context)!=null?s:n.fn[g].defaults.context;if(!n.isWindow(i)){i=t.closest(i)}i=n(i);r=c[i[0][u]];if(!r){r=new o(i)}return new l(t,r,e)});n[m]("refresh");return this},disable:function(){return d._invoke.call(this,"disable")},enable:function(){return d._invoke.call(this,"enable")},destroy:function(){return d._invoke.call(this,"destroy")},prev:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e>0){return t.push(n[e-1])}})},next:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e<n.length-1){return t.push(n[e+1])}})},_traverse:function(t,e,i){var o,l;if(t==null){t="vertical"}if(e==null){e=r}l=h.aggregate(e);o=[];this.each(function(){var e;e=n.inArray(this,l[t]);return i(o,e,l[t])});return this.pushStack(o)},_invoke:function(t){this.each(function(){var e;e=l.getWaypointsByElement(this);return n.each(e,function(e,n){n[t]();return true})});return this}};n.fn[g]=function(){var t,r;r=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(d[r]){return d[r].apply(this,t)}else if(n.isFunction(r)){return d.init.apply(this,arguments)}else if(n.isPlainObject(r)){return d.init.apply(this,[null,r])}else if(!r){return n.error("jQuery Waypoints needs a callback function or handler option.")}else{return n.error("The "+r+" method does not exist in jQuery Waypoints.")}};n.fn[g].defaults={context:r,continuous:true,enabled:true,horizontal:false,offset:0,triggerOnce:false};h={refresh:function(){return n.each(c,function(t,e){return e.refresh()})},viewportHeight:function(){var t;return(t=r.innerHeight)!=null?t:i.height()},aggregate:function(t){var e,r,i;e=s;if(t){e=(i=c[n(t)[0][u]])!=null?i.waypoints:void 0}if(!e){return[]}r={horizontal:[],vertical:[]};n.each(r,function(t,i){n.each(e[t],function(t,e){return i.push(e)});i.sort(function(t,e){return t.offset-e.offset});r[t]=n.map(i,function(t){return t.element});return r[t]=n.unique(r[t])});return r},above:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset<=t.oldScroll.y})},below:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset>t.oldScroll.y})},left:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset<=t.oldScroll.x})},right:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset>t.oldScroll.x})},enable:function(){return h._invoke("enable")},disable:function(){return h._invoke("disable")},destroy:function(){return h._invoke("destroy")},extendFn:function(t,e){return d[t]=e},_invoke:function(t){var e;e=n.extend({},s.vertical,s.horizontal);return n.each(e,function(e,n){n[t]();return true})},_filter:function(t,e,r){var i,o;i=c[n(t)[0][u]];if(!i){return[]}o=[];n.each(i.waypoints[e],function(t,e){if(r(i,e)){return o.push(e)}});o.sort(function(t,e){return t.offset-e.offset});return n.map(o,function(t){return t.element})}};n[m]=function(){var t,n;n=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(h[n]){return h[n].apply(null,t)}else{return h.aggregate.call(null,n)}};n[m].settings={resizeThrottle:100,scrollThrottle:30};return i.load(function(){return n[m]("refresh")})})}).call(this);

/*
 * jQuery FlexSlider v2.2.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */(function(e){e.flexslider=function(t,n){var r=e(t);r.vars=e.extend({},e.flexslider.defaults,n);var i=r.vars.namespace,s=window.navigator&&window.navigator.msPointerEnabled&&window.MSGesture,o=("ontouchstart"in window||s||window.DocumentTouch&&document instanceof DocumentTouch)&&r.vars.touch,u="click touchend MSPointerUp",a="",f,l=r.vars.direction==="vertical",c=r.vars.reverse,h=r.vars.itemWidth>0,p=r.vars.animation==="fade",d=r.vars.asNavFor!=="",v={},m=!0;e.data(t,"flexslider",r);v={init:function(){r.animating=!1;r.currentSlide=parseInt(r.vars.startAt?r.vars.startAt:0);isNaN(r.currentSlide)&&(r.currentSlide=0);r.animatingTo=r.currentSlide;r.atEnd=r.currentSlide===0||r.currentSlide===r.last;r.containerSelector=r.vars.selector.substr(0,r.vars.selector.search(" "));r.slides=e(r.vars.selector,r);r.container=e(r.containerSelector,r);r.count=r.slides.length;r.syncExists=e(r.vars.sync).length>0;r.vars.animation==="slide"&&(r.vars.animation="swing");r.prop=l?"top":"marginLeft";r.args={};r.manualPause=!1;r.stopped=!1;r.started=!1;r.startTimeout=null;r.transitions=!r.vars.video&&!p&&r.vars.useCSS&&function(){var e=document.createElement("div"),t=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var n in t)if(e.style[t[n]]!==undefined){r.pfx=t[n].replace("Perspective","").toLowerCase();r.prop="-"+r.pfx+"-transform";return!0}return!1}();r.vars.controlsContainer!==""&&(r.controlsContainer=e(r.vars.controlsContainer).length>0&&e(r.vars.controlsContainer));r.vars.manualControls!==""&&(r.manualControls=e(r.vars.manualControls).length>0&&e(r.vars.manualControls));if(r.vars.randomize){r.slides.sort(function(){return Math.round(Math.random())-.5});r.container.empty().append(r.slides)}r.doMath();r.setup("init");r.vars.controlNav&&v.controlNav.setup();r.vars.directionNav&&v.directionNav.setup();r.vars.keyboard&&(e(r.containerSelector).length===1||r.vars.multipleKeyboard)&&e(document).bind("keyup",function(e){var t=e.keyCode;if(!r.animating&&(t===39||t===37)){var n=t===39?r.getTarget("next"):t===37?r.getTarget("prev"):!1;r.flexAnimate(n,r.vars.pauseOnAction)}});r.vars.mousewheel&&r.bind("mousewheel",function(e,t,n,i){e.preventDefault();var s=t<0?r.getTarget("next"):r.getTarget("prev");r.flexAnimate(s,r.vars.pauseOnAction)});r.vars.pausePlay&&v.pausePlay.setup();r.vars.slideshow&&r.vars.pauseInvisible&&v.pauseInvisible.init();if(r.vars.slideshow){r.vars.pauseOnHover&&r.hover(function(){!r.manualPlay&&!r.manualPause&&r.pause()},function(){!r.manualPause&&!r.manualPlay&&!r.stopped&&r.play()});if(!r.vars.pauseInvisible||!v.pauseInvisible.isHidden())r.vars.initDelay>0?r.startTimeout=setTimeout(r.play,r.vars.initDelay):r.play()}d&&v.asNav.setup();o&&r.vars.touch&&v.touch();(!p||p&&r.vars.smoothHeight)&&e(window).bind("resize orientationchange focus",v.resize);r.find("img").attr("draggable","false");setTimeout(function(){r.vars.start(r)},200)},asNav:{setup:function(){r.asNav=!0;r.animatingTo=Math.floor(r.currentSlide/r.move);r.currentItem=r.currentSlide;r.slides.removeClass(i+"active-slide").eq(r.currentItem).addClass(i+"active-slide");if(!s)r.slides.click(function(t){t.preventDefault();var n=e(this),s=n.index(),o=n.offset().left-e(r).scrollLeft();if(o<=0&&n.hasClass(i+"active-slide"))r.flexAnimate(r.getTarget("prev"),!0);else if(!e(r.vars.asNavFor).data("flexslider").animating&&!n.hasClass(i+"active-slide")){r.direction=r.currentItem<s?"next":"prev";r.flexAnimate(s,r.vars.pauseOnAction,!1,!0,!0)}});else{t._slider=r;r.slides.each(function(){var t=this;t._gesture=new MSGesture;t._gesture.target=t;t.addEventListener("MSPointerDown",function(e){e.preventDefault();e.currentTarget._gesture&&e.currentTarget._gesture.addPointer(e.pointerId)},!1);t.addEventListener("MSGestureTap",function(t){t.preventDefault();var n=e(this),i=n.index();if(!e(r.vars.asNavFor).data("flexslider").animating&&!n.hasClass("active")){r.direction=r.currentItem<i?"next":"prev";r.flexAnimate(i,r.vars.pauseOnAction,!1,!0,!0)}})})}}},controlNav:{setup:function(){r.manualControls?v.controlNav.setupManual():v.controlNav.setupPaging()},setupPaging:function(){var t=r.vars.controlNav==="thumbnails"?"control-thumbs":"control-paging",n=1,s,o;r.controlNavScaffold=e('<ol class="'+i+"control-nav "+i+t+'"></ol>');if(r.pagingCount>1)for(var f=0;f<r.pagingCount;f++){o=r.slides.eq(f);s=r.vars.controlNav==="thumbnails"?'<img src="'+o.attr("data-thumb")+'"/>':"<a>"+n+"</a>";if("thumbnails"===r.vars.controlNav&&!0===r.vars.thumbCaptions){var l=o.attr("data-thumbcaption");""!=l&&undefined!=l&&(s+='<span class="'+i+'caption">'+l+"</span>")}r.controlNavScaffold.append("<li>"+s+"</li>");n++}r.controlsContainer?e(r.controlsContainer).append(r.controlNavScaffold):r.append(r.controlNavScaffold);v.controlNav.set();v.controlNav.active();r.controlNavScaffold.delegate("a, img",u,function(t){t.preventDefault();if(a===""||a===t.type){var n=e(this),s=r.controlNav.index(n);if(!n.hasClass(i+"active")){r.direction=s>r.currentSlide?"next":"prev";r.flexAnimate(s,r.vars.pauseOnAction)}}a===""&&(a=t.type);v.setToClearWatchedEvent()})},setupManual:function(){r.controlNav=r.manualControls;v.controlNav.active();r.controlNav.bind(u,function(t){t.preventDefault();if(a===""||a===t.type){var n=e(this),s=r.controlNav.index(n);if(!n.hasClass(i+"active")){s>r.currentSlide?r.direction="next":r.direction="prev";r.flexAnimate(s,r.vars.pauseOnAction)}}a===""&&(a=t.type);v.setToClearWatchedEvent()})},set:function(){var t=r.vars.controlNav==="thumbnails"?"img":"a";r.controlNav=e("."+i+"control-nav li "+t,r.controlsContainer?r.controlsContainer:r)},active:function(){r.controlNav.removeClass(i+"active").eq(r.animatingTo).addClass(i+"active")},update:function(t,n){r.pagingCount>1&&t==="add"?r.controlNavScaffold.append(e("<li><a>"+r.count+"</a></li>")):r.pagingCount===1?r.controlNavScaffold.find("li").remove():r.controlNav.eq(n).closest("li").remove();v.controlNav.set();r.pagingCount>1&&r.pagingCount!==r.controlNav.length?r.update(n,t):v.controlNav.active()}},directionNav:{setup:function(){var t=e('<ul class="'+i+'direction-nav"><li><a class="'+i+'prev" href="#">'+r.vars.prevText+'</a></li><li><a class="'+i+'next" href="#">'+r.vars.nextText+"</a></li></ul>");if(r.controlsContainer){e(r.controlsContainer).append(t);r.directionNav=e("."+i+"direction-nav li a",r.controlsContainer)}else{r.append(t);r.directionNav=e("."+i+"direction-nav li a",r)}v.directionNav.update();r.directionNav.bind(u,function(t){t.preventDefault();var n;if(a===""||a===t.type){n=e(this).hasClass(i+"next")?r.getTarget("next"):r.getTarget("prev");r.flexAnimate(n,r.vars.pauseOnAction)}a===""&&(a=t.type);v.setToClearWatchedEvent()})},update:function(){var e=i+"disabled";r.pagingCount===1?r.directionNav.addClass(e).attr("tabindex","-1"):r.vars.animationLoop?r.directionNav.removeClass(e).removeAttr("tabindex"):r.animatingTo===0?r.directionNav.removeClass(e).filter("."+i+"prev").addClass(e).attr("tabindex","-1"):r.animatingTo===r.last?r.directionNav.removeClass(e).filter("."+i+"next").addClass(e).attr("tabindex","-1"):r.directionNav.removeClass(e).removeAttr("tabindex")}},pausePlay:{setup:function(){var t=e('<div class="'+i+'pauseplay"><a></a></div>');if(r.controlsContainer){r.controlsContainer.append(t);r.pausePlay=e("."+i+"pauseplay a",r.controlsContainer)}else{r.append(t);r.pausePlay=e("."+i+"pauseplay a",r)}v.pausePlay.update(r.vars.slideshow?i+"pause":i+"play");r.pausePlay.bind(u,function(t){t.preventDefault();if(a===""||a===t.type)if(e(this).hasClass(i+"pause")){r.manualPause=!0;r.manualPlay=!1;r.pause()}else{r.manualPause=!1;r.manualPlay=!0;r.play()}a===""&&(a=t.type);v.setToClearWatchedEvent()})},update:function(e){e==="play"?r.pausePlay.removeClass(i+"pause").addClass(i+"play").html(r.vars.playText):r.pausePlay.removeClass(i+"play").addClass(i+"pause").html(r.vars.pauseText)}},touch:function(){var e,n,i,o,u,a,f=!1,d=0,v=0,m=0;if(!s){t.addEventListener("touchstart",g,!1);function g(s){if(r.animating)s.preventDefault();else if(window.navigator.msPointerEnabled||s.touches.length===1){r.pause();o=l?r.h:r.w;a=Number(new Date);d=s.touches[0].pageX;v=s.touches[0].pageY;i=h&&c&&r.animatingTo===r.last?0:h&&c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:h&&r.currentSlide===r.last?r.limit:h?(r.itemW+r.vars.itemMargin)*r.move*r.currentSlide:c?(r.last-r.currentSlide+r.cloneOffset)*o:(r.currentSlide+r.cloneOffset)*o;e=l?v:d;n=l?d:v;t.addEventListener("touchmove",y,!1);t.addEventListener("touchend",b,!1)}}function y(t){d=t.touches[0].pageX;v=t.touches[0].pageY;u=l?e-v:e-d;f=l?Math.abs(u)<Math.abs(d-n):Math.abs(u)<Math.abs(v-n);var s=500;if(!f||Number(new Date)-a>s){t.preventDefault();if(!p&&r.transitions){r.vars.animationLoop||(u/=r.currentSlide===0&&u<0||r.currentSlide===r.last&&u>0?Math.abs(u)/o+2:1);r.setProps(i+u,"setTouch")}}}function b(s){t.removeEventListener("touchmove",y,!1);if(r.animatingTo===r.currentSlide&&!f&&u!==null){var l=c?-u:u,h=l>0?r.getTarget("next"):r.getTarget("prev");r.canAdvance(h)&&(Number(new Date)-a<550&&Math.abs(l)>50||Math.abs(l)>o/2)?r.flexAnimate(h,r.vars.pauseOnAction):p||r.flexAnimate(r.currentSlide,r.vars.pauseOnAction,!0)}t.removeEventListener("touchend",b,!1);e=null;n=null;u=null;i=null}}else{t.style.msTouchAction="none";t._gesture=new MSGesture;t._gesture.target=t;t.addEventListener("MSPointerDown",w,!1);t._slider=r;t.addEventListener("MSGestureChange",E,!1);t.addEventListener("MSGestureEnd",S,!1);function w(e){e.stopPropagation();if(r.animating)e.preventDefault();else{r.pause();t._gesture.addPointer(e.pointerId);m=0;o=l?r.h:r.w;a=Number(new Date);i=h&&c&&r.animatingTo===r.last?0:h&&c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:h&&r.currentSlide===r.last?r.limit:h?(r.itemW+r.vars.itemMargin)*r.move*r.currentSlide:c?(r.last-r.currentSlide+r.cloneOffset)*o:(r.currentSlide+r.cloneOffset)*o}}function E(e){e.stopPropagation();var n=e.target._slider;if(!n)return;var r=-e.translationX,s=-e.translationY;m+=l?s:r;u=m;f=l?Math.abs(m)<Math.abs(-r):Math.abs(m)<Math.abs(-s);if(e.detail===e.MSGESTURE_FLAG_INERTIA){setImmediate(function(){t._gesture.stop()});return}if(!f||Number(new Date)-a>500){e.preventDefault();if(!p&&n.transitions){n.vars.animationLoop||(u=m/(n.currentSlide===0&&m<0||n.currentSlide===n.last&&m>0?Math.abs(m)/o+2:1));n.setProps(i+u,"setTouch")}}}function S(t){t.stopPropagation();var r=t.target._slider;if(!r)return;if(r.animatingTo===r.currentSlide&&!f&&u!==null){var s=c?-u:u,l=s>0?r.getTarget("next"):r.getTarget("prev");r.canAdvance(l)&&(Number(new Date)-a<550&&Math.abs(s)>50||Math.abs(s)>o/2)?r.flexAnimate(l,r.vars.pauseOnAction):p||r.flexAnimate(r.currentSlide,r.vars.pauseOnAction,!0)}e=null;n=null;u=null;i=null;m=0}}},resize:function(){if(!r.animating&&r.is(":visible")){h||r.doMath();if(p)v.smoothHeight();else if(h){r.slides.width(r.computedW);r.update(r.pagingCount);r.setProps()}else if(l){r.viewport.height(r.h);r.setProps(r.h,"setTotal")}else{r.vars.smoothHeight&&v.smoothHeight();r.newSlides.width(r.computedW);r.setProps(r.computedW,"setTotal")}}},smoothHeight:function(e){if(!l||p){var t=p?r:r.viewport;e?t.animate({height:r.slides.eq(r.animatingTo).height()},e):t.height(r.slides.eq(r.animatingTo).height())}},sync:function(t){var n=e(r.vars.sync).data("flexslider"),i=r.animatingTo;switch(t){case"animate":n.flexAnimate(i,r.vars.pauseOnAction,!1,!0);break;case"play":!n.playing&&!n.asNav&&n.play();break;case"pause":n.pause()}},pauseInvisible:{visProp:null,init:function(){var e=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var t=0;t<e.length;t++)e[t]+"Hidden"in document&&(v.pauseInvisible.visProp=e[t]+"Hidden");if(v.pauseInvisible.visProp){var n=v.pauseInvisible.visProp.replace(/[H|h]idden/,"")+"visibilitychange";document.addEventListener(n,function(){v.pauseInvisible.isHidden()?r.startTimeout?clearTimeout(r.startTimeout):r.pause():r.started?r.play():r.vars.initDelay>0?setTimeout(r.play,r.vars.initDelay):r.play()})}},isHidden:function(){return document[v.pauseInvisible.visProp]||!1}},setToClearWatchedEvent:function(){clearTimeout(f);f=setTimeout(function(){a=""},3e3)}};r.flexAnimate=function(t,n,s,u,a){!r.vars.animationLoop&&t!==r.currentSlide&&(r.direction=t>r.currentSlide?"next":"prev");d&&r.pagingCount===1&&(r.direction=r.currentItem<t?"next":"prev");if(!r.animating&&(r.canAdvance(t,a)||s)&&r.is(":visible")){if(d&&u){var f=e(r.vars.asNavFor).data("flexslider");r.atEnd=t===0||t===r.count-1;f.flexAnimate(t,!0,!1,!0,a);r.direction=r.currentItem<t?"next":"prev";f.direction=r.direction;if(Math.ceil((t+1)/r.visible)-1===r.currentSlide||t===0){r.currentItem=t;r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");return!1}r.currentItem=t;r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");t=Math.floor(t/r.visible)}r.animating=!0;r.animatingTo=t;n&&r.pause();r.vars.before(r);r.syncExists&&!a&&v.sync("animate");r.vars.controlNav&&v.controlNav.active();h||r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");r.atEnd=t===0||t===r.last;r.vars.directionNav&&v.directionNav.update();if(t===r.last){r.vars.end(r);r.vars.animationLoop||r.pause()}if(!p){var m=l?r.slides.filter(":first").height():r.computedW,g,y,b;if(h){g=r.vars.itemMargin;b=(r.itemW+g)*r.move*r.animatingTo;y=b>r.limit&&r.visible!==1?r.limit:b}else r.currentSlide===0&&t===r.count-1&&r.vars.animationLoop&&r.direction!=="next"?y=c?(r.count+r.cloneOffset)*m:0:r.currentSlide===r.last&&t===0&&r.vars.animationLoop&&r.direction!=="prev"?y=c?0:(r.count+1)*m:y=c?(r.count-1-t+r.cloneOffset)*m:(t+r.cloneOffset)*m;r.setProps(y,"",r.vars.animationSpeed);if(r.transitions){if(!r.vars.animationLoop||!r.atEnd){r.animating=!1;r.currentSlide=r.animatingTo}r.container.unbind("webkitTransitionEnd transitionend");r.container.bind("webkitTransitionEnd transitionend",function(){r.wrapup(m)})}else r.container.animate(r.args,r.vars.animationSpeed,r.vars.easing,function(){r.wrapup(m)})}else if(!o){r.slides.eq(r.currentSlide).css({zIndex:1}).animate({opacity:0},r.vars.animationSpeed,r.vars.easing);r.slides.eq(t).css({zIndex:2}).animate({opacity:1},r.vars.animationSpeed,r.vars.easing,r.wrapup)}else{r.slides.eq(r.currentSlide).css({opacity:0,zIndex:1});r.slides.eq(t).css({opacity:1,zIndex:2});r.wrapup(m)}r.vars.smoothHeight&&v.smoothHeight(r.vars.animationSpeed)}};r.wrapup=function(e){!p&&!h&&(r.currentSlide===0&&r.animatingTo===r.last&&r.vars.animationLoop?r.setProps(e,"jumpEnd"):r.currentSlide===r.last&&r.animatingTo===0&&r.vars.animationLoop&&r.setProps(e,"jumpStart"));r.animating=!1;r.currentSlide=r.animatingTo;r.vars.after(r)};r.animateSlides=function(){!r.animating&&m&&r.flexAnimate(r.getTarget("next"))};r.pause=function(){clearInterval(r.animatedSlides);r.animatedSlides=null;r.playing=!1;r.vars.pausePlay&&v.pausePlay.update("play");r.syncExists&&v.sync("pause")};r.play=function(){r.playing&&clearInterval(r.animatedSlides);r.animatedSlides=r.animatedSlides||setInterval(r.animateSlides,r.vars.slideshowSpeed);r.started=r.playing=!0;r.vars.pausePlay&&v.pausePlay.update("pause");r.syncExists&&v.sync("play")};r.stop=function(){r.pause();r.stopped=!0};r.canAdvance=function(e,t){var n=d?r.pagingCount-1:r.last;return t?!0:d&&r.currentItem===r.count-1&&e===0&&r.direction==="prev"?!0:d&&r.currentItem===0&&e===r.pagingCount-1&&r.direction!=="next"?!1:e===r.currentSlide&&!d?!1:r.vars.animationLoop?!0:r.atEnd&&r.currentSlide===0&&e===n&&r.direction!=="next"?!1:r.atEnd&&r.currentSlide===n&&e===0&&r.direction==="next"?!1:!0};r.getTarget=function(e){r.direction=e;return e==="next"?r.currentSlide===r.last?0:r.currentSlide+1:r.currentSlide===0?r.last:r.currentSlide-1};r.setProps=function(e,t,n){var i=function(){var n=e?e:(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo,i=function(){if(h)return t==="setTouch"?e:c&&r.animatingTo===r.last?0:c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:r.animatingTo===r.last?r.limit:n;switch(t){case"setTotal":return c?(r.count-1-r.currentSlide+r.cloneOffset)*e:(r.currentSlide+r.cloneOffset)*e;case"setTouch":return c?e:e;case"jumpEnd":return c?e:r.count*e;case"jumpStart":return c?r.count*e:e;default:return e}}();return i*-1+"px"}();if(r.transitions){i=l?"translate3d(0,"+i+",0)":"translate3d("+i+",0,0)";n=n!==undefined?n/1e3+"s":"0s";r.container.css("-"+r.pfx+"-transition-duration",n)}r.args[r.prop]=i;(r.transitions||n===undefined)&&r.container.css(r.args)};r.setup=function(t){if(!p){var n,s;if(t==="init"){r.viewport=e('<div class="'+i+'viewport"></div>').css({overflow:"hidden",position:"relative"}).appendTo(r).append(r.container);r.cloneCount=0;r.cloneOffset=0;if(c){s=e.makeArray(r.slides).reverse();r.slides=e(s);r.container.empty().append(r.slides)}}if(r.vars.animationLoop&&!h){r.cloneCount=2;r.cloneOffset=1;t!=="init"&&r.container.find(".clone").remove();r.container.append(r.slides.first().clone().addClass("clone").attr("aria-hidden","true")).prepend(r.slides.last().clone().addClass("clone").attr("aria-hidden","true"))}r.newSlides=e(r.vars.selector,r);n=c?r.count-1-r.currentSlide+r.cloneOffset:r.currentSlide+r.cloneOffset;if(l&&!h){r.container.height((r.count+r.cloneCount)*200+"%").css("position","absolute").width("100%");setTimeout(function(){r.newSlides.css({display:"block"});r.doMath();r.viewport.height(r.h);r.setProps(n*r.h,"init")},t==="init"?100:0)}else{r.container.width((r.count+r.cloneCount)*200+"%");r.setProps(n*r.computedW,"init");setTimeout(function(){r.doMath();r.newSlides.css({width:r.computedW,"float":"left",display:"block"});r.vars.smoothHeight&&v.smoothHeight()},t==="init"?100:0)}}else{r.slides.css({width:"100%","float":"left",marginRight:"-100%",position:"relative"});t==="init"&&(o?r.slides.css({opacity:0,display:"block",webkitTransition:"opacity "+r.vars.animationSpeed/1e3+"s ease",zIndex:1}).eq(r.currentSlide).css({opacity:1,zIndex:2}):r.slides.css({opacity:0,display:"block",zIndex:1}).eq(r.currentSlide).css({zIndex:2}).animate({opacity:1},r.vars.animationSpeed,r.vars.easing));r.vars.smoothHeight&&v.smoothHeight()}h||r.slides.removeClass(i+"active-slide").eq(r.currentSlide).addClass(i+"active-slide")};r.doMath=function(){var e=r.slides.first(),t=r.vars.itemMargin,n=r.vars.minItems,i=r.vars.maxItems;r.w=r.viewport===undefined?r.width():r.viewport.width();r.h=e.height();r.boxPadding=e.outerWidth()-e.width();if(h){r.itemT=r.vars.itemWidth+t;r.minW=n?n*r.itemT:r.w;r.maxW=i?i*r.itemT-t:r.w;r.itemW=r.minW>r.w?(r.w-t*(n-1))/n:r.maxW<r.w?(r.w-t*(i-1))/i:r.vars.itemWidth>r.w?r.w:r.vars.itemWidth;r.visible=Math.floor(r.w/r.itemW);r.move=r.vars.move>0&&r.vars.move<r.visible?r.vars.move:r.visible;r.pagingCount=Math.ceil((r.count-r.visible)/r.move+1);r.last=r.pagingCount-1;r.limit=r.pagingCount===1?0:r.vars.itemWidth>r.w?r.itemW*(r.count-1)+t*(r.count-1):(r.itemW+t)*r.count-r.w-t}else{r.itemW=r.w;r.pagingCount=r.count;r.last=r.count-1}r.computedW=r.itemW-r.boxPadding};r.update=function(e,t){r.doMath();if(!h){e<r.currentSlide?r.currentSlide+=1:e<=r.currentSlide&&e!==0&&(r.currentSlide-=1);r.animatingTo=r.currentSlide}if(r.vars.controlNav&&!r.manualControls)if(t==="add"&&!h||r.pagingCount>r.controlNav.length)v.controlNav.update("add");else if(t==="remove"&&!h||r.pagingCount<r.controlNav.length){if(h&&r.currentSlide>r.last){r.currentSlide-=1;r.animatingTo-=1}v.controlNav.update("remove",r.last)}r.vars.directionNav&&v.directionNav.update()};r.addSlide=function(t,n){var i=e(t);r.count+=1;r.last=r.count-1;l&&c?n!==undefined?r.slides.eq(r.count-n).after(i):r.container.prepend(i):n!==undefined?r.slides.eq(n).before(i):r.container.append(i);r.update(n,"add");r.slides=e(r.vars.selector+":not(.clone)",r);r.setup();r.vars.added(r)};r.removeSlide=function(t){var n=isNaN(t)?r.slides.index(e(t)):t;r.count-=1;r.last=r.count-1;isNaN(t)?e(t,r.slides).remove():l&&c?r.slides.eq(r.last).remove():r.slides.eq(t).remove();r.doMath();r.update(n,"remove");r.slides=e(r.vars.selector+":not(.clone)",r);r.setup();r.vars.removed(r)};v.init()};e(window).blur(function(e){focused=!1}).focus(function(e){focused=!0});e.flexslider.defaults={namespace:"flex-",selector:".slides > li",animation:"fade",easing:"swing",direction:"horizontal",reverse:!1,animationLoop:!0,smoothHeight:!1,startAt:0,slideshow:!0,slideshowSpeed:7e3,animationSpeed:600,initDelay:0,randomize:!1,thumbCaptions:!1,pauseOnAction:!0,pauseOnHover:!1,pauseInvisible:!0,useCSS:!0,touch:!0,video:!1,controlNav:!0,directionNav:!0,prevText:"Previous",nextText:"Next",keyboard:!0,multipleKeyboard:!1,mousewheel:!1,pausePlay:!1,pauseText:"Pause",playText:"Play",controlsContainer:"",manualControls:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:1,maxItems:0,move:0,allowOneSlide:!0,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){}};e.fn.flexslider=function(t){t===undefined&&(t={});if(typeof t=="object")return this.each(function(){var n=e(this),r=t.selector?t.selector:".slides > li",i=n.find(r);if(i.length===1&&t.allowOneSlide===!0||i.length===0){i.fadeIn(400);t.start&&t.start(n)}else n.data("flexslider")===undefined&&new e.flexslider(this,t)});var n=e(this).data("flexslider");switch(t){case"play":n.play();break;case"pause":n.pause();break;case"stop":n.stop();break;case"next":n.flexAnimate(n.getTarget("next"),!0);break;case"prev":case"previous":n.flexAnimate(n.getTarget("prev"),!0);break;default:typeof t=="number"&&n.flexAnimate(t,!0)}}})(jQuery);


/* http://keith-wood.name/countdown.html
   Countdown for jQuery v1.6.3.
   Written by Keith Wood (kbwood{at}iinet.com.au) January 2008.
   Available under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license.
   Please attribute the author if you use it. */
(function($){function Countdown(){this.regional=[];this.regional['']={labels:['Years','Months','Weeks','Days','Hours','Minutes','Seconds'],labels1:['Year','Month','Week','Day','Hour','Minute','Second'],compactLabels:['y','m','w','d'],whichLabels:null,digits:['0','1','2','3','4','5','6','7','8','9'],timeSeparator:':',isRTL:false};this._defaults={until:null,since:null,timezone:null,serverSync:null,format:'dHMS',layout:'',compact:false,significant:0,description:'',expiryUrl:'',expiryText:'',alwaysExpire:false,onExpiry:null,onTick:null,tickInterval:1};$.extend(this._defaults,this.regional['']);this._serverSyncs=[];var c=(typeof Date.now=='function'?Date.now:function(){return new Date().getTime()});var d=(window.performance&&typeof window.performance.now=='function');function timerCallBack(a){var b=(a<1e12?(d?(performance.now()+performance.timing.navigationStart):c()):a||c());if(b-f>=1000){x._updateTargets();f=b}e(timerCallBack)}var e=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||null;var f=0;if(!e||$.noRequestAnimationFrame){$.noRequestAnimationFrame=null;setInterval(function(){x._updateTargets()},980)}else{f=window.animationStartTime||window.webkitAnimationStartTime||window.mozAnimationStartTime||window.oAnimationStartTime||window.msAnimationStartTime||c();e(timerCallBack)}}var Y=0;var O=1;var W=2;var D=3;var H=4;var M=5;var S=6;$.extend(Countdown.prototype,{markerClassName:'hasCountdown',propertyName:'countdown',_rtlClass:'countdown_rtl',_sectionClass:'countdown_section',_amountClass:'countdown_amount',_rowClass:'countdown_row',_holdingClass:'countdown_holding',_showClass:'countdown_show',_descrClass:'countdown_descr',_timerTargets:[],setDefaults:function(a){this._resetExtraLabels(this._defaults,a);$.extend(this._defaults,a||{})},UTCDate:function(a,b,c,e,f,g,h,i){if(typeof b=='object'&&b.constructor==Date){i=b.getMilliseconds();h=b.getSeconds();g=b.getMinutes();f=b.getHours();e=b.getDate();c=b.getMonth();b=b.getFullYear()}var d=new Date();d.setUTCFullYear(b);d.setUTCDate(1);d.setUTCMonth(c||0);d.setUTCDate(e||1);d.setUTCHours(f||0);d.setUTCMinutes((g||0)-(Math.abs(a)<30?a*60:a));d.setUTCSeconds(h||0);d.setUTCMilliseconds(i||0);return d},periodsToSeconds:function(a){return a[0]*31557600+a[1]*2629800+a[2]*604800+a[3]*86400+a[4]*3600+a[5]*60+a[6]},_attachPlugin:function(a,b){a=$(a);if(a.hasClass(this.markerClassName)){return}var c={options:$.extend({},this._defaults),_periods:[0,0,0,0,0,0,0]};a.addClass(this.markerClassName).data(this.propertyName,c);this._optionPlugin(a,b)},_addTarget:function(a){if(!this._hasTarget(a)){this._timerTargets.push(a)}},_hasTarget:function(a){return($.inArray(a,this._timerTargets)>-1)},_removeTarget:function(b){this._timerTargets=$.map(this._timerTargets,function(a){return(a==b?null:a)})},_updateTargets:function(){for(var i=this._timerTargets.length-1;i>=0;i--){this._updateCountdown(this._timerTargets[i])}},_optionPlugin:function(a,b,c){a=$(a);var d=a.data(this.propertyName);if(!b||(typeof b=='string'&&c==null)){var e=b;b=(d||{}).options;return(b&&e?b[e]:b)}if(!a.hasClass(this.markerClassName)){return}b=b||{};if(typeof b=='string'){var e=b;b={};b[e]=c}if(b.layout){b.layout=b.layout.replace(/&lt;/g,'<').replace(/&gt;/g,'>')}this._resetExtraLabels(d.options,b);var f=(d.options.timezone!=b.timezone);$.extend(d.options,b);this._adjustSettings(a,d,b.until!=null||b.since!=null||f);var g=new Date();if((d._since&&d._since<g)||(d._until&&d._until>g)){this._addTarget(a[0])}this._updateCountdown(a,d)},_updateCountdown:function(a,b){var c=$(a);b=b||c.data(this.propertyName);if(!b){return}c.html(this._generateHTML(b)).toggleClass(this._rtlClass,b.options.isRTL);if($.isFunction(b.options.onTick)){var d=b._hold!='lap'?b._periods:this._calculatePeriods(b,b._show,b.options.significant,new Date());if(b.options.tickInterval==1||this.periodsToSeconds(d)%b.options.tickInterval==0){b.options.onTick.apply(a,[d])}}var e=b._hold!='pause'&&(b._since?b._now.getTime()<b._since.getTime():b._now.getTime()>=b._until.getTime());if(e&&!b._expiring){b._expiring=true;if(this._hasTarget(a)||b.options.alwaysExpire){this._removeTarget(a);if($.isFunction(b.options.onExpiry)){b.options.onExpiry.apply(a,[])}if(b.options.expiryText){var f=b.options.layout;b.options.layout=b.options.expiryText;this._updateCountdown(a,b);b.options.layout=f}if(b.options.expiryUrl){window.location=b.options.expiryUrl}}b._expiring=false}else if(b._hold=='pause'){this._removeTarget(a)}c.data(this.propertyName,b)},_resetExtraLabels:function(a,b){var c=false;for(var n in b){if(n!='whichLabels'&&n.match(/[Ll]abels/)){c=true;break}}if(c){for(var n in a){if(n.match(/[Ll]abels[02-9]|compactLabels1/)){a[n]=null}}}},_adjustSettings:function(a,b,c){var d;var e=0;var f=null;for(var i=0;i<this._serverSyncs.length;i++){if(this._serverSyncs[i][0]==b.options.serverSync){f=this._serverSyncs[i][1];break}}if(f!=null){e=(b.options.serverSync?f:0);d=new Date()}else{var g=($.isFunction(b.options.serverSync)?b.options.serverSync.apply(a,[]):null);d=new Date();e=(g?d.getTime()-g.getTime():0);this._serverSyncs.push([b.options.serverSync,e])}var h=b.options.timezone;h=(h==null?-d.getTimezoneOffset():h);if(c||(!c&&b._until==null&&b._since==null)){b._since=b.options.since;if(b._since!=null){b._since=this.UTCDate(h,this._determineTime(b._since,null));if(b._since&&e){b._since.setMilliseconds(b._since.getMilliseconds()+e)}}b._until=this.UTCDate(h,this._determineTime(b.options.until,d));if(e){b._until.setMilliseconds(b._until.getMilliseconds()+e)}}b._show=this._determineShow(b)},_destroyPlugin:function(a){a=$(a);if(!a.hasClass(this.markerClassName)){return}this._removeTarget(a[0]);a.removeClass(this.markerClassName).empty().removeData(this.propertyName)},_pausePlugin:function(a){this._hold(a,'pause')},_lapPlugin:function(a){this._hold(a,'lap')},_resumePlugin:function(a){this._hold(a,null)},_hold:function(a,b){var c=$.data(a,this.propertyName);if(c){if(c._hold=='pause'&&!b){c._periods=c._savePeriods;var d=(c._since?'-':'+');c[c._since?'_since':'_until']=this._determineTime(d+c._periods[0]+'y'+d+c._periods[1]+'o'+d+c._periods[2]+'w'+d+c._periods[3]+'d'+d+c._periods[4]+'h'+d+c._periods[5]+'m'+d+c._periods[6]+'s');this._addTarget(a)}c._hold=b;c._savePeriods=(b=='pause'?c._periods:null);$.data(a,this.propertyName,c);this._updateCountdown(a,c)}},_getTimesPlugin:function(a){var b=$.data(a,this.propertyName);return(!b?null:(b._hold=='pause'?b._savePeriods:(!b._hold?b._periods:this._calculatePeriods(b,b._show,b.options.significant,new Date()))))},_determineTime:function(k,l){var m=function(a){var b=new Date();b.setTime(b.getTime()+a*1000);return b};var n=function(a){a=a.toLowerCase();var b=new Date();var c=b.getFullYear();var d=b.getMonth();var e=b.getDate();var f=b.getHours();var g=b.getMinutes();var h=b.getSeconds();var i=/([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g;var j=i.exec(a);while(j){switch(j[2]||'s'){case's':h+=parseInt(j[1],10);break;case'm':g+=parseInt(j[1],10);break;case'h':f+=parseInt(j[1],10);break;case'd':e+=parseInt(j[1],10);break;case'w':e+=parseInt(j[1],10)*7;break;case'o':d+=parseInt(j[1],10);e=Math.min(e,x._getDaysInMonth(c,d));break;case'y':c+=parseInt(j[1],10);e=Math.min(e,x._getDaysInMonth(c,d));break}j=i.exec(a)}return new Date(c,d,e,f,g,h,0)};var o=(k==null?l:(typeof k=='string'?n(k):(typeof k=='number'?m(k):k)));if(o)o.setMilliseconds(0);return o},_getDaysInMonth:function(a,b){return 32-new Date(a,b,32).getDate()},_normalLabels:function(a){return a},_generateHTML:function(c){var d=this;c._periods=(c._hold?c._periods:this._calculatePeriods(c,c._show,c.options.significant,new Date()));var e=false;var f=0;var g=c.options.significant;var h=$.extend({},c._show);for(var i=Y;i<=S;i++){e|=(c._show[i]=='?'&&c._periods[i]>0);h[i]=(c._show[i]=='?'&&!e?null:c._show[i]);f+=(h[i]?1:0);g-=(c._periods[i]>0?1:0)}var j=[false,false,false,false,false,false,false];for(var i=S;i>=Y;i--){if(c._show[i]){if(c._periods[i]){j[i]=true}else{j[i]=g>0;g--}}}var k=(c.options.compact?c.options.compactLabels:c.options.labels);var l=c.options.whichLabels||this._normalLabels;var m=function(a){var b=c.options['compactLabels'+l(c._periods[a])];return(h[a]?d._translateDigits(c,c._periods[a])+(b?b[a]:k[a])+' ':'')};var n=function(a){var b=c.options['labels'+l(c._periods[a])];return((!c.options.significant&&h[a])||(c.options.significant&&j[a])?'<span class="'+x._sectionClass+'">'+'<span class="'+x._amountClass+'">'+d._translateDigits(c,c._periods[a])+'</span><br/>'+(b?b[a]:k[a])+'</span>':'')};return(c.options.layout?this._buildLayout(c,h,c.options.layout,c.options.compact,c.options.significant,j):((c.options.compact?'<span class="'+this._rowClass+' '+this._amountClass+(c._hold?' '+this._holdingClass:'')+'">'+m(Y)+m(O)+m(W)+m(D)+(h[H]?this._minDigits(c,c._periods[H],2):'')+(h[M]?(h[H]?c.options.timeSeparator:'')+this._minDigits(c,c._periods[M],2):'')+(h[S]?(h[H]||h[M]?c.options.timeSeparator:'')+this._minDigits(c,c._periods[S],2):''):'<span class="'+this._rowClass+' '+this._showClass+(c.options.significant||f)+(c._hold?' '+this._holdingClass:'')+'">'+n(Y)+n(O)+n(W)+n(D)+n(H)+n(M)+n(S))+'</span>'+(c.options.description?'<span class="'+this._rowClass+' '+this._descrClass+'">'+c.options.description+'</span>':'')))},_buildLayout:function(c,d,e,f,g,h){var j=c.options[f?'compactLabels':'labels'];var k=c.options.whichLabels||this._normalLabels;var l=function(a){return(c.options[(f?'compactLabels':'labels')+k(c._periods[a])]||j)[a]};var m=function(a,b){return c.options.digits[Math.floor(a/b)%10]};var o={desc:c.options.description,sep:c.options.timeSeparator,yl:l(Y),yn:this._minDigits(c,c._periods[Y],1),ynn:this._minDigits(c,c._periods[Y],2),ynnn:this._minDigits(c,c._periods[Y],3),y1:m(c._periods[Y],1),y10:m(c._periods[Y],10),y100:m(c._periods[Y],100),y1000:m(c._periods[Y],1000),ol:l(O),on:this._minDigits(c,c._periods[O],1),onn:this._minDigits(c,c._periods[O],2),onnn:this._minDigits(c,c._periods[O],3),o1:m(c._periods[O],1),o10:m(c._periods[O],10),o100:m(c._periods[O],100),o1000:m(c._periods[O],1000),wl:l(W),wn:this._minDigits(c,c._periods[W],1),wnn:this._minDigits(c,c._periods[W],2),wnnn:this._minDigits(c,c._periods[W],3),w1:m(c._periods[W],1),w10:m(c._periods[W],10),w100:m(c._periods[W],100),w1000:m(c._periods[W],1000),dl:l(D),dn:this._minDigits(c,c._periods[D],1),dnn:this._minDigits(c,c._periods[D],2),dnnn:this._minDigits(c,c._periods[D],3),d1:m(c._periods[D],1),d10:m(c._periods[D],10),d100:m(c._periods[D],100),d1000:m(c._periods[D],1000),hl:l(H),hn:this._minDigits(c,c._periods[H],1),hnn:this._minDigits(c,c._periods[H],2),hnnn:this._minDigits(c,c._periods[H],3),h1:m(c._periods[H],1),h10:m(c._periods[H],10),h100:m(c._periods[H],100),h1000:m(c._periods[H],1000),ml:l(M),mn:this._minDigits(c,c._periods[M],1),mnn:this._minDigits(c,c._periods[M],2),mnnn:this._minDigits(c,c._periods[M],3),m1:m(c._periods[M],1),m10:m(c._periods[M],10),m100:m(c._periods[M],100),m1000:m(c._periods[M],1000),sl:l(S),sn:this._minDigits(c,c._periods[S],1),snn:this._minDigits(c,c._periods[S],2),snnn:this._minDigits(c,c._periods[S],3),s1:m(c._periods[S],1),s10:m(c._periods[S],10),s100:m(c._periods[S],100),s1000:m(c._periods[S],1000)};var p=e;for(var i=Y;i<=S;i++){var q='yowdhms'.charAt(i);var r=new RegExp('\\{'+q+'<\\}([\\s\\S]*)\\{'+q+'>\\}','g');p=p.replace(r,((!g&&d[i])||(g&&h[i])?'$1':''))}$.each(o,function(n,v){var a=new RegExp('\\{'+n+'\\}','g');p=p.replace(a,v)});return p},_minDigits:function(a,b,c){b=''+b;if(b.length>=c){return this._translateDigits(a,b)}b='0000000000'+b;return this._translateDigits(a,b.substr(b.length-c))},_translateDigits:function(b,c){return(''+c).replace(/[0-9]/g,function(a){return b.options.digits[a]})},_determineShow:function(a){var b=a.options.format;var c=[];c[Y]=(b.match('y')?'?':(b.match('Y')?'!':null));c[O]=(b.match('o')?'?':(b.match('O')?'!':null));c[W]=(b.match('w')?'?':(b.match('W')?'!':null));c[D]=(b.match('d')?'?':(b.match('D')?'!':null));c[H]=(b.match('h')?'?':(b.match('H')?'!':null));c[M]=(b.match('m')?'?':(b.match('M')?'!':null));c[S]=(b.match('s')?'?':(b.match('S')?'!':null));return c},_calculatePeriods:function(c,d,e,f){c._now=f;c._now.setMilliseconds(0);var g=new Date(c._now.getTime());if(c._since){if(f.getTime()<c._since.getTime()){c._now=f=g}else{f=c._since}}else{g.setTime(c._until.getTime());if(f.getTime()>c._until.getTime()){c._now=f=g}}var h=[0,0,0,0,0,0,0];if(d[Y]||d[O]){var i=x._getDaysInMonth(f.getFullYear(),f.getMonth());var j=x._getDaysInMonth(g.getFullYear(),g.getMonth());var k=(g.getDate()==f.getDate()||(g.getDate()>=Math.min(i,j)&&f.getDate()>=Math.min(i,j)));var l=function(a){return(a.getHours()*60+a.getMinutes())*60+a.getSeconds()};var m=Math.max(0,(g.getFullYear()-f.getFullYear())*12+g.getMonth()-f.getMonth()+((g.getDate()<f.getDate()&&!k)||(k&&l(g)<l(f))?-1:0));h[Y]=(d[Y]?Math.floor(m/12):0);h[O]=(d[O]?m-h[Y]*12:0);f=new Date(f.getTime());var n=(f.getDate()==i);var o=x._getDaysInMonth(f.getFullYear()+h[Y],f.getMonth()+h[O]);if(f.getDate()>o){f.setDate(o)}f.setFullYear(f.getFullYear()+h[Y]);f.setMonth(f.getMonth()+h[O]);if(n){f.setDate(o)}}var p=Math.floor((g.getTime()-f.getTime())/1000);var q=function(a,b){h[a]=(d[a]?Math.floor(p/b):0);p-=h[a]*b};q(W,604800);q(D,86400);q(H,3600);q(M,60);q(S,1);if(p>0&&!c._since){var r=[1,12,4.3482,7,24,60,60];var s=S;var t=1;for(var u=S;u>=Y;u--){if(d[u]){if(h[s]>=t){h[s]=0;p=1}if(p>0){h[u]++;p=0;s=u;t=1}}t*=r[u]}}if(e){for(var u=Y;u<=S;u++){if(e&&h[u]){e--}else if(!e){h[u]=0}}}return h}});var w=['getTimes'];function isNotChained(a,b){if(a=='option'&&(b.length==0||(b.length==1&&typeof b[0]=='string'))){return true}return $.inArray(a,w)>-1}$.fn.countdown=function(a){var b=Array.prototype.slice.call(arguments,1);if(isNotChained(a,b)){return x['_'+a+'Plugin'].apply(x,[this[0]].concat(b))}return this.each(function(){if(typeof a=='string'){if(!x['_'+a+'Plugin']){throw'Unknown command: '+a;}x['_'+a+'Plugin'].apply(x,[this].concat(b))}else{x._attachPlugin(this,a||{})}})};var x=$.countdown=new Countdown()})(jQuery);

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
;(function(e){e.fn.collagePlus=function(t){function n(t,n,i,s){var o=i.padding*(t.length-1)+t.length*t[0][3],u=i.albumWidth-o,a=u/(n-o),f=o,l=n<i.albumWidth?true:false;for(var c=0;c<t.length;c++){var h=e(t[c][0]),p=Math.floor(t[c][1]*a),d=Math.floor(t[c][2]*a),v=!!(c<t.length-1);if(i.allowPartialLastRow===true&&l===true){p=t[c][1];d=t[c][2]}f+=p;if(!v&&f<i.albumWidth){if(i.allowPartialLastRow===true&&l===true){p=p}else{p=p+(i.albumWidth-f)}}p--;var m=h.is("img")?h:h.find("img");m.width(p);if(!h.is("img")){h.width(p+t[c][3])}m.height(d);if(!h.is("img")){h.height(d+t[c][4])}r(h,v,i);m.one("load",function(e){return function(){if(i.effect=="default"){e.animate({opacity:"1"},{duration:i.fadeSpeed})}else{if(i.direction=="vertical"){var t=s<=10?s:10}else{var t=c<=9?c+1:10}e.removeClass(function(e,t){return(t.match(/\beffect-\S+/g)||[]).join(" ")});e.addClass(i.effect);e.addClass("effect-duration-"+t)}}}(h)).each(function(){if(this.complete)e(this).trigger("load")})}}function r(e,t,n){var r={"margin-bottom":n.padding+"px","margin-right":t?n.padding+"px":"0px",display:n.display,"vertical-align":"bottom",overflow:"hidden"};return e.css(r)}function i(t){$img=e(t);var n=new Array;n["w"]=parseFloat($img.css("border-left-width"))+parseFloat($img.css("border-right-width"));n["h"]=parseFloat($img.css("border-top-width"))+parseFloat($img.css("border-bottom-width"));return n}return this.each(function(){var r=0,s=[],o=1,u=e(this);e.fn.collagePlus.defaults.albumWidth=u.width();e.fn.collagePlus.defaults.padding=parseFloat(u.css("padding-left"));e.fn.collagePlus.defaults.images=u.children();var a=e.extend({},e.fn.collagePlus.defaults,t);a.images.each(function(t){var u=e(this),f=u.is("img")?u:e(this).find("img");var l=typeof f.data("width")!="undefined"?f.data("width"):f.width(),c=typeof f.data("height")!="undefined"?f.data("height"):f.height();var h=i(f);f.data("width",l);f.data("height",c);var p=Math.ceil(l/c*a.targetHeight),d=Math.ceil(a.targetHeight);s.push([this,p,d,h["w"],h["h"]]);r+=p+h["w"]+a.padding;if(r>a.albumWidth&&s.length!=0){n(s,r-a.padding,a,o);delete r;delete s;r=0;s=[];o+=1}if(a.images.length-1==t&&s.length!=0){n(s,r,a,o);delete r;delete s;r=0;s=[];o+=1}})})};e.fn.collagePlus.defaults={targetHeight:400,fadeSpeed:"fast",display:"inline-block",effect:"default",direction:"vertical",allowPartialLastRow:false}})(jQuery);

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

(function(b,f){b.fn.jPlayer=function(a){var c="string"===typeof a,d=Array.prototype.slice.call(arguments,1),e=this,a=!c&&d.length?b.extend.apply(null,[!0,a].concat(d)):a;if(c&&"_"===a.charAt(0))return e;c?this.each(function(){var c=b.data(this,"jPlayer"),h=c&&b.isFunction(c[a])?c[a].apply(c,d):c;if(h!==c&&h!==f)return e=h,!1}):this.each(function(){var c=b.data(this,"jPlayer");c?c.option(a||{}):b.data(this,"jPlayer",new b.jPlayer(a,this))});return e};b.jPlayer=function(a,c){if(arguments.length){this.element=
b(c);this.options=b.extend(!0,{},this.options,a);var d=this;this.element.bind("remove.jPlayer",function(){d.destroy()});this._init()}};b.jPlayer.emulateMethods="load play pause";b.jPlayer.emulateStatus="src readyState networkState currentTime duration paused ended playbackRate";b.jPlayer.emulateOptions="muted volume";b.jPlayer.reservedEvent="ready flashreset resize repeat error warning";b.jPlayer.event={ready:"jPlayer_ready",flashreset:"jPlayer_flashreset",resize:"jPlayer_resize",repeat:"jPlayer_repeat",
click:"jPlayer_click",error:"jPlayer_error",warning:"jPlayer_warning",loadstart:"jPlayer_loadstart",progress:"jPlayer_progress",suspend:"jPlayer_suspend",abort:"jPlayer_abort",emptied:"jPlayer_emptied",stalled:"jPlayer_stalled",play:"jPlayer_play",pause:"jPlayer_pause",loadedmetadata:"jPlayer_loadedmetadata",loadeddata:"jPlayer_loadeddata",waiting:"jPlayer_waiting",playing:"jPlayer_playing",canplay:"jPlayer_canplay",canplaythrough:"jPlayer_canplaythrough",seeking:"jPlayer_seeking",seeked:"jPlayer_seeked",
timeupdate:"jPlayer_timeupdate",ended:"jPlayer_ended",ratechange:"jPlayer_ratechange",durationchange:"jPlayer_durationchange",volumechange:"jPlayer_volumechange"};b.jPlayer.htmlEvent="loadstart abort emptied stalled loadedmetadata loadeddata canplay canplaythrough ratechange".split(" ");b.jPlayer.pause=function(){b.each(b.jPlayer.prototype.instances,function(a,c){c.data("jPlayer").status.srcSet&&c.jPlayer("pause")})};b.jPlayer.timeFormat={showHour:!1,showMin:!0,showSec:!0,padHour:!1,padMin:!0,padSec:!0,
sepHour:":",sepMin:":",sepSec:""};b.jPlayer.convertTime=function(a){var c=new Date(1E3*a),d=c.getUTCHours(),a=c.getUTCMinutes(),c=c.getUTCSeconds(),d=b.jPlayer.timeFormat.padHour&&10>d?"0"+d:d,a=b.jPlayer.timeFormat.padMin&&10>a?"0"+a:a,c=b.jPlayer.timeFormat.padSec&&10>c?"0"+c:c;return(b.jPlayer.timeFormat.showHour?d+b.jPlayer.timeFormat.sepHour:"")+(b.jPlayer.timeFormat.showMin?a+b.jPlayer.timeFormat.sepMin:"")+(b.jPlayer.timeFormat.showSec?c+b.jPlayer.timeFormat.sepSec:"")};b.jPlayer.uaBrowser=
function(a){var a=a.toLowerCase(),c=/(opera)(?:.*version)?[ \/]([\w.]+)/,b=/(msie) ([\w.]+)/,e=/(mozilla)(?:.*? rv:([\w.]+))?/,a=/(webkit)[ \/]([\w.]+)/.exec(a)||c.exec(a)||b.exec(a)||0>a.indexOf("compatible")&&e.exec(a)||[];return{browser:a[1]||"",version:a[2]||"0"}};b.jPlayer.uaPlatform=function(a){var b=a.toLowerCase(),d=/(android)/,e=/(mobile)/,a=/(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/.exec(b)||[],b=/(ipad|playbook)/.exec(b)||!e.exec(b)&&d.exec(b)||[];a[1]&&(a[1]=a[1].replace(/\s/g,
"_"));return{platform:a[1]||"",tablet:b[1]||""}};b.jPlayer.browser={};b.jPlayer.platform={};var i=b.jPlayer.uaBrowser(navigator.userAgent);i.browser&&(b.jPlayer.browser[i.browser]=!0,b.jPlayer.browser.version=i.version);i=b.jPlayer.uaPlatform(navigator.userAgent);i.platform&&(b.jPlayer.platform[i.platform]=!0,b.jPlayer.platform.mobile=!i.tablet,b.jPlayer.platform.tablet=!!i.tablet);b.jPlayer.prototype={count:0,version:{script:"2.2.0",needFlash:"2.2.0",flash:"unknown"},options:{swfPath:"js",solution:"html, flash",
supplied:"mp3",preload:"metadata",volume:0.8,muted:!1,wmode:"opaque",backgroundColor:"#000000",cssSelectorAncestor:"#jp_container_1",cssSelector:{videoPlay:".jp-video-play",play:".jp-play",pause:".jp-pause",stop:".jp-stop",seekBar:".jp-seek-bar",playBar:".jp-play-bar",mute:".jp-mute",unmute:".jp-unmute",volumeBar:".jp-volume-bar",volumeBarValue:".jp-volume-bar-value",volumeMax:".jp-volume-max",currentTime:".jp-current-time",duration:".jp-duration",fullScreen:".jp-full-screen",restoreScreen:".jp-restore-screen",
repeat:".jp-repeat",repeatOff:".jp-repeat-off",gui:".jp-gui",noSolution:".jp-no-solution"},fullScreen:!1,autohide:{restored:!1,full:!0,fadeIn:200,fadeOut:600,hold:1E3},loop:!1,repeat:function(a){a.jPlayer.options.loop?b(this).unbind(".jPlayerRepeat").bind(b.jPlayer.event.ended+".jPlayer.jPlayerRepeat",function(){b(this).jPlayer("play")}):b(this).unbind(".jPlayerRepeat")},nativeVideoControls:{},noFullScreen:{msie:/msie [0-6]/,ipad:/ipad.*?os [0-4]/,iphone:/iphone/,ipod:/ipod/,android_pad:/android [0-3](?!.*?mobile)/,
android_phone:/android.*?mobile/,blackberry:/blackberry/,windows_ce:/windows ce/,webos:/webos/},noVolume:{ipad:/ipad/,iphone:/iphone/,ipod:/ipod/,android_pad:/android(?!.*?mobile)/,android_phone:/android.*?mobile/,blackberry:/blackberry/,windows_ce:/windows ce/,webos:/webos/,playbook:/playbook/},verticalVolume:!1,idPrefix:"jp",noConflict:"jQuery",emulateHtml:!1,errorAlerts:!1,warningAlerts:!1},optionsAudio:{size:{width:"0px",height:"0px",cssClass:""},sizeFull:{width:"0px",height:"0px",cssClass:""}},
optionsVideo:{size:{width:"480px",height:"270px",cssClass:"jp-video-270p"},sizeFull:{width:"100%",height:"100%",cssClass:"jp-video-full"}},instances:{},status:{src:"",media:{},paused:!0,format:{},formatType:"",waitForPlay:!0,waitForLoad:!0,srcSet:!1,video:!1,seekPercent:0,currentPercentRelative:0,currentPercentAbsolute:0,currentTime:0,duration:0,readyState:0,networkState:0,playbackRate:1,ended:0},internal:{ready:!1},solution:{html:!0,flash:!0},format:{mp3:{codec:'audio/mpeg; codecs="mp3"',flashCanPlay:!0,
media:"audio"},m4a:{codec:'audio/mp4; codecs="mp4a.40.2"',flashCanPlay:!0,media:"audio"},oga:{codec:'audio/ogg; codecs="vorbis"',flashCanPlay:!1,media:"audio"},wav:{codec:'audio/wav; codecs="1"',flashCanPlay:!1,media:"audio"},webma:{codec:'audio/webm; codecs="vorbis"',flashCanPlay:!1,media:"audio"},fla:{codec:"audio/x-flv",flashCanPlay:!0,media:"audio"},rtmpa:{codec:'audio/rtmp; codecs="rtmp"',flashCanPlay:!0,media:"audio"},m4v:{codec:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',flashCanPlay:!0,media:"video"},
ogv:{codec:'video/ogg; codecs="theora, vorbis"',flashCanPlay:!1,media:"video"},webmv:{codec:'video/webm; codecs="vorbis, vp8"',flashCanPlay:!1,media:"video"},flv:{codec:"video/x-flv",flashCanPlay:!0,media:"video"},rtmpv:{codec:'video/rtmp; codecs="rtmp"',flashCanPlay:!0,media:"video"}},_init:function(){var a=this;this.element.empty();this.status=b.extend({},this.status);this.internal=b.extend({},this.internal);this.internal.domNode=this.element.get(0);this.formats=[];this.solutions=[];this.require=
{};this.htmlElement={};this.html={};this.html.audio={};this.html.video={};this.flash={};this.css={};this.css.cs={};this.css.jq={};this.ancestorJq=[];this.options.volume=this._limitValue(this.options.volume,0,1);b.each(this.options.supplied.toLowerCase().split(","),function(c,d){var e=d.replace(/^\s+|\s+$/g,"");if(a.format[e]){var f=false;b.each(a.formats,function(a,b){if(e===b){f=true;return false}});f||a.formats.push(e)}});b.each(this.options.solution.toLowerCase().split(","),function(c,d){var e=
d.replace(/^\s+|\s+$/g,"");if(a.solution[e]){var f=false;b.each(a.solutions,function(a,b){if(e===b){f=true;return false}});f||a.solutions.push(e)}});this.internal.instance="jp_"+this.count;this.instances[this.internal.instance]=this.element;this.element.attr("id")||this.element.attr("id",this.options.idPrefix+"_jplayer_"+this.count);this.internal.self=b.extend({},{id:this.element.attr("id"),jq:this.element});this.internal.audio=b.extend({},{id:this.options.idPrefix+"_audio_"+this.count,jq:f});this.internal.video=
b.extend({},{id:this.options.idPrefix+"_video_"+this.count,jq:f});this.internal.flash=b.extend({},{id:this.options.idPrefix+"_flash_"+this.count,jq:f,swf:this.options.swfPath+(this.options.swfPath.toLowerCase().slice(-4)!==".swf"?(this.options.swfPath&&this.options.swfPath.slice(-1)!=="/"?"/":"")+"Jplayer.swf":"")});this.internal.poster=b.extend({},{id:this.options.idPrefix+"_poster_"+this.count,jq:f});b.each(b.jPlayer.event,function(b,c){if(a.options[b]!==f){a.element.bind(c+".jPlayer",a.options[b]);
a.options[b]=f}});this.require.audio=false;this.require.video=false;b.each(this.formats,function(b,c){a.require[a.format[c].media]=true});this.options=this.require.video?b.extend(true,{},this.optionsVideo,this.options):b.extend(true,{},this.optionsAudio,this.options);this._setSize();this.status.nativeVideoControls=this._uaBlocklist(this.options.nativeVideoControls);this.status.noFullScreen=this._uaBlocklist(this.options.noFullScreen);this.status.noVolume=this._uaBlocklist(this.options.noVolume);this._restrictNativeVideoControls();
this.htmlElement.poster=document.createElement("img");this.htmlElement.poster.id=this.internal.poster.id;this.htmlElement.poster.onload=function(){(!a.status.video||a.status.waitForPlay)&&a.internal.poster.jq.show()};this.element.append(this.htmlElement.poster);this.internal.poster.jq=b("#"+this.internal.poster.id);this.internal.poster.jq.css({width:this.status.width,height:this.status.height});this.internal.poster.jq.hide();this.internal.poster.jq.bind("click.jPlayer",function(){a._trigger(b.jPlayer.event.click)});
this.html.audio.available=false;if(this.require.audio){this.htmlElement.audio=document.createElement("audio");this.htmlElement.audio.id=this.internal.audio.id;this.html.audio.available=!!this.htmlElement.audio.canPlayType&&this._testCanPlayType(this.htmlElement.audio)}this.html.video.available=false;if(this.require.video){this.htmlElement.video=document.createElement("video");this.htmlElement.video.id=this.internal.video.id;this.html.video.available=!!this.htmlElement.video.canPlayType&&this._testCanPlayType(this.htmlElement.video)}this.flash.available=
this._checkForFlash(10);this.html.canPlay={};this.flash.canPlay={};b.each(this.formats,function(b,c){a.html.canPlay[c]=a.html[a.format[c].media].available&&""!==a.htmlElement[a.format[c].media].canPlayType(a.format[c].codec);a.flash.canPlay[c]=a.format[c].flashCanPlay&&a.flash.available});this.html.desired=false;this.flash.desired=false;b.each(this.solutions,function(c,d){if(c===0)a[d].desired=true;else{var e=false,f=false;b.each(a.formats,function(b,c){a[a.solutions[0]].canPlay[c]&&(a.format[c].media===
"video"?f=true:e=true)});a[d].desired=a.require.audio&&!e||a.require.video&&!f}});this.html.support={};this.flash.support={};b.each(this.formats,function(b,c){a.html.support[c]=a.html.canPlay[c]&&a.html.desired;a.flash.support[c]=a.flash.canPlay[c]&&a.flash.desired});this.html.used=false;this.flash.used=false;b.each(this.solutions,function(c,d){b.each(a.formats,function(b,c){if(a[d].support[c]){a[d].used=true;return false}})});this._resetActive();this._resetGate();this._cssSelectorAncestor(this.options.cssSelectorAncestor);
if(!this.html.used&&!this.flash.used){this._error({type:b.jPlayer.error.NO_SOLUTION,context:"{solution:'"+this.options.solution+"', supplied:'"+this.options.supplied+"'}",message:b.jPlayer.errorMsg.NO_SOLUTION,hint:b.jPlayer.errorHint.NO_SOLUTION});this.css.jq.noSolution.length&&this.css.jq.noSolution.show()}else this.css.jq.noSolution.length&&this.css.jq.noSolution.hide();if(this.flash.used){var c,d="jQuery="+encodeURI(this.options.noConflict)+"&id="+encodeURI(this.internal.self.id)+"&vol="+this.options.volume+
"&muted="+this.options.muted;if(b.jPlayer.browser.msie&&Number(b.jPlayer.browser.version)<=8){d=['<param name="movie" value="'+this.internal.flash.swf+'" />','<param name="FlashVars" value="'+d+'" />','<param name="allowScriptAccess" value="always" />','<param name="bgcolor" value="'+this.options.backgroundColor+'" />','<param name="wmode" value="'+this.options.wmode+'" />'];c=document.createElement('<object id="'+this.internal.flash.id+'" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0"></object>');
for(var e=0;e<d.length;e++)c.appendChild(document.createElement(d[e]))}else{e=function(a,b,c){var d=document.createElement("param");d.setAttribute("name",b);d.setAttribute("value",c);a.appendChild(d)};c=document.createElement("object");c.setAttribute("id",this.internal.flash.id);c.setAttribute("data",this.internal.flash.swf);c.setAttribute("type","application/x-shockwave-flash");c.setAttribute("width","1");c.setAttribute("height","1");e(c,"flashvars",d);e(c,"allowscriptaccess","always");e(c,"bgcolor",
this.options.backgroundColor);e(c,"wmode",this.options.wmode)}this.element.append(c);this.internal.flash.jq=b(c)}if(this.html.used){if(this.html.audio.available){this._addHtmlEventListeners(this.htmlElement.audio,this.html.audio);this.element.append(this.htmlElement.audio);this.internal.audio.jq=b("#"+this.internal.audio.id)}if(this.html.video.available){this._addHtmlEventListeners(this.htmlElement.video,this.html.video);this.element.append(this.htmlElement.video);this.internal.video.jq=b("#"+this.internal.video.id);
this.status.nativeVideoControls?this.internal.video.jq.css({width:this.status.width,height:this.status.height}):this.internal.video.jq.css({width:"0px",height:"0px"});this.internal.video.jq.bind("click.jPlayer",function(){a._trigger(b.jPlayer.event.click)})}}this.options.emulateHtml&&this._emulateHtmlBridge();this.html.used&&!this.flash.used&&setTimeout(function(){a.internal.ready=true;a.version.flash="n/a";a._trigger(b.jPlayer.event.repeat);a._trigger(b.jPlayer.event.ready)},100);this._updateNativeVideoControls();
this._updateInterface();this._updateButtons(false);this._updateAutohide();this._updateVolume(this.options.volume);this._updateMute(this.options.muted);this.css.jq.videoPlay.length&&this.css.jq.videoPlay.hide();b.jPlayer.prototype.count++},destroy:function(){this.clearMedia();this._removeUiClass();this.css.jq.currentTime.length&&this.css.jq.currentTime.text("");this.css.jq.duration.length&&this.css.jq.duration.text("");b.each(this.css.jq,function(a,b){b.length&&b.unbind(".jPlayer")});this.internal.poster.jq.unbind(".jPlayer");
this.internal.video.jq&&this.internal.video.jq.unbind(".jPlayer");this.options.emulateHtml&&this._destroyHtmlBridge();this.element.removeData("jPlayer");this.element.unbind(".jPlayer");this.element.empty();delete this.instances[this.internal.instance]},enable:function(){},disable:function(){},_testCanPlayType:function(a){try{a.canPlayType(this.format.mp3.codec);return true}catch(b){return false}},_uaBlocklist:function(a){var c=navigator.userAgent.toLowerCase(),d=false;b.each(a,function(a,b){if(b&&
b.test(c)){d=true;return false}});return d},_restrictNativeVideoControls:function(){if(this.require.audio&&this.status.nativeVideoControls){this.status.nativeVideoControls=false;this.status.noFullScreen=true}},_updateNativeVideoControls:function(){if(this.html.video.available&&this.html.used){this.htmlElement.video.controls=this.status.nativeVideoControls;this._updateAutohide();if(this.status.nativeVideoControls&&this.require.video){this.internal.poster.jq.hide();this.internal.video.jq.css({width:this.status.width,
height:this.status.height})}else if(this.status.waitForPlay&&this.status.video){this.internal.poster.jq.show();this.internal.video.jq.css({width:"0px",height:"0px"})}}},_addHtmlEventListeners:function(a,c){var d=this;a.preload=this.options.preload;a.muted=this.options.muted;a.volume=this.options.volume;a.addEventListener("progress",function(){if(c.gate){d._getHtmlStatus(a);d._updateInterface();d._trigger(b.jPlayer.event.progress)}},false);a.addEventListener("timeupdate",function(){if(c.gate){d._getHtmlStatus(a);
d._updateInterface();d._trigger(b.jPlayer.event.timeupdate)}},false);a.addEventListener("durationchange",function(){if(c.gate){d._getHtmlStatus(a);d._updateInterface();d._trigger(b.jPlayer.event.durationchange)}},false);a.addEventListener("play",function(){if(c.gate){d._updateButtons(true);d._html_checkWaitForPlay();d._trigger(b.jPlayer.event.play)}},false);a.addEventListener("playing",function(){if(c.gate){d._updateButtons(true);d._seeked();d._trigger(b.jPlayer.event.playing)}},false);a.addEventListener("pause",
function(){if(c.gate){d._updateButtons(false);d._trigger(b.jPlayer.event.pause)}},false);a.addEventListener("waiting",function(){if(c.gate){d._seeking();d._trigger(b.jPlayer.event.waiting)}},false);a.addEventListener("seeking",function(){if(c.gate){d._seeking();d._trigger(b.jPlayer.event.seeking)}},false);a.addEventListener("seeked",function(){if(c.gate){d._seeked();d._trigger(b.jPlayer.event.seeked)}},false);a.addEventListener("volumechange",function(){if(c.gate){d.options.volume=a.volume;d.options.muted=
a.muted;d._updateMute();d._updateVolume();d._trigger(b.jPlayer.event.volumechange)}},false);a.addEventListener("suspend",function(){if(c.gate){d._seeked();d._trigger(b.jPlayer.event.suspend)}},false);a.addEventListener("ended",function(){if(c.gate){if(!b.jPlayer.browser.webkit)d.htmlElement.media.currentTime=0;d.htmlElement.media.pause();d._updateButtons(false);d._getHtmlStatus(a,true);d._updateInterface();d._trigger(b.jPlayer.event.ended)}},false);a.addEventListener("error",function(){if(c.gate){d._updateButtons(false);
d._seeked();if(d.status.srcSet){clearTimeout(d.internal.htmlDlyCmdId);d.status.waitForLoad=true;d.status.waitForPlay=true;d.status.video&&!d.status.nativeVideoControls&&d.internal.video.jq.css({width:"0px",height:"0px"});d._validString(d.status.media.poster)&&!d.status.nativeVideoControls&&d.internal.poster.jq.show();d.css.jq.videoPlay.length&&d.css.jq.videoPlay.show();d._error({type:b.jPlayer.error.URL,context:d.status.src,message:b.jPlayer.errorMsg.URL,hint:b.jPlayer.errorHint.URL})}}},false);b.each(b.jPlayer.htmlEvent,
function(e,g){a.addEventListener(this,function(){c.gate&&d._trigger(b.jPlayer.event[g])},false)})},_getHtmlStatus:function(a,b){var d=0,e=0,g=0,f=0;if(isFinite(a.duration))this.status.duration=a.duration;d=a.currentTime;e=this.status.duration>0?100*d/this.status.duration:0;if(typeof a.seekable==="object"&&a.seekable.length>0){g=this.status.duration>0?100*a.seekable.end(a.seekable.length-1)/this.status.duration:100;f=this.status.duration>0?100*a.currentTime/a.seekable.end(a.seekable.length-1):0}else{g=
100;f=e}if(b)e=f=d=0;this.status.seekPercent=g;this.status.currentPercentRelative=f;this.status.currentPercentAbsolute=e;this.status.currentTime=d;this.status.readyState=a.readyState;this.status.networkState=a.networkState;this.status.playbackRate=a.playbackRate;this.status.ended=a.ended},_resetStatus:function(){this.status=b.extend({},this.status,b.jPlayer.prototype.status)},_trigger:function(a,c,d){a=b.Event(a);a.jPlayer={};a.jPlayer.version=b.extend({},this.version);a.jPlayer.options=b.extend(true,
{},this.options);a.jPlayer.status=b.extend(true,{},this.status);a.jPlayer.html=b.extend(true,{},this.html);a.jPlayer.flash=b.extend(true,{},this.flash);if(c)a.jPlayer.error=b.extend({},c);if(d)a.jPlayer.warning=b.extend({},d);this.element.trigger(a)},jPlayerFlashEvent:function(a,c){if(a===b.jPlayer.event.ready)if(this.internal.ready){if(this.flash.gate){if(this.status.srcSet){var d=this.status.currentTime,e=this.status.paused;this.setMedia(this.status.media);d>0&&(e?this.pause(d):this.play(d))}this._trigger(b.jPlayer.event.flashreset)}}else{this.internal.ready=
true;this.internal.flash.jq.css({width:"0px",height:"0px"});this.version.flash=c.version;this.version.needFlash!==this.version.flash&&this._error({type:b.jPlayer.error.VERSION,context:this.version.flash,message:b.jPlayer.errorMsg.VERSION+this.version.flash,hint:b.jPlayer.errorHint.VERSION});this._trigger(b.jPlayer.event.repeat);this._trigger(a)}if(this.flash.gate)switch(a){case b.jPlayer.event.progress:this._getFlashStatus(c);this._updateInterface();this._trigger(a);break;case b.jPlayer.event.timeupdate:this._getFlashStatus(c);
this._updateInterface();this._trigger(a);break;case b.jPlayer.event.play:this._seeked();this._updateButtons(true);this._trigger(a);break;case b.jPlayer.event.pause:this._updateButtons(false);this._trigger(a);break;case b.jPlayer.event.ended:this._updateButtons(false);this._trigger(a);break;case b.jPlayer.event.click:this._trigger(a);break;case b.jPlayer.event.error:this.status.waitForLoad=true;this.status.waitForPlay=true;this.status.video&&this.internal.flash.jq.css({width:"0px",height:"0px"});this._validString(this.status.media.poster)&&
this.internal.poster.jq.show();this.css.jq.videoPlay.length&&this.status.video&&this.css.jq.videoPlay.show();this.status.video?this._flash_setVideo(this.status.media):this._flash_setAudio(this.status.media);this._updateButtons(false);this._error({type:b.jPlayer.error.URL,context:c.src,message:b.jPlayer.errorMsg.URL,hint:b.jPlayer.errorHint.URL});break;case b.jPlayer.event.seeking:this._seeking();this._trigger(a);break;case b.jPlayer.event.seeked:this._seeked();this._trigger(a);break;case b.jPlayer.event.ready:break;
default:this._trigger(a)}return false},_getFlashStatus:function(a){this.status.seekPercent=a.seekPercent;this.status.currentPercentRelative=a.currentPercentRelative;this.status.currentPercentAbsolute=a.currentPercentAbsolute;this.status.currentTime=a.currentTime;this.status.duration=a.duration;this.status.readyState=4;this.status.networkState=0;this.status.playbackRate=1;this.status.ended=false},_updateButtons:function(a){if(a!==f){this.status.paused=!a;if(this.css.jq.play.length&&this.css.jq.pause.length)if(a){this.css.jq.play.hide();
this.css.jq.pause.show()}else{this.css.jq.play.show();this.css.jq.pause.hide()}}if(this.css.jq.restoreScreen.length&&this.css.jq.fullScreen.length)if(this.status.noFullScreen){this.css.jq.fullScreen.hide();this.css.jq.restoreScreen.hide()}else if(this.options.fullScreen){this.css.jq.fullScreen.hide();this.css.jq.restoreScreen.show()}else{this.css.jq.fullScreen.show();this.css.jq.restoreScreen.hide()}if(this.css.jq.repeat.length&&this.css.jq.repeatOff.length)if(this.options.loop){this.css.jq.repeat.hide();
this.css.jq.repeatOff.show()}else{this.css.jq.repeat.show();this.css.jq.repeatOff.hide()}},_updateInterface:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.width(this.status.seekPercent+"%");this.css.jq.playBar.length&&this.css.jq.playBar.width(this.status.currentPercentRelative+"%");this.css.jq.currentTime.length&&this.css.jq.currentTime.text(b.jPlayer.convertTime(this.status.currentTime));this.css.jq.duration.length&&this.css.jq.duration.text(b.jPlayer.convertTime(this.status.duration))},
_seeking:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.addClass("jp-seeking-bg")},_seeked:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.removeClass("jp-seeking-bg")},_resetGate:function(){this.html.audio.gate=false;this.html.video.gate=false;this.flash.gate=false},_resetActive:function(){this.html.active=false;this.flash.active=false},setMedia:function(a){var c=this,d=false,e=this.status.media.poster!==a.poster;this._resetMedia();this._resetGate();this._resetActive();b.each(this.formats,
function(e,f){var i=c.format[f].media==="video";b.each(c.solutions,function(b,e){if(c[e].support[f]&&c._validString(a[f])){var g=e==="html";if(i){if(g){c.html.video.gate=true;c._html_setVideo(a);c.html.active=true}else{c.flash.gate=true;c._flash_setVideo(a);c.flash.active=true}c.css.jq.videoPlay.length&&c.css.jq.videoPlay.show();c.status.video=true}else{if(g){c.html.audio.gate=true;c._html_setAudio(a);c.html.active=true}else{c.flash.gate=true;c._flash_setAudio(a);c.flash.active=true}c.css.jq.videoPlay.length&&
c.css.jq.videoPlay.hide();c.status.video=false}d=true;return false}});if(d)return false});if(d){if((!this.status.nativeVideoControls||!this.html.video.gate)&&this._validString(a.poster))e?this.htmlElement.poster.src=a.poster:this.internal.poster.jq.show();this.status.srcSet=true;this.status.media=b.extend({},a);this._updateButtons(false);this._updateInterface()}else this._error({type:b.jPlayer.error.NO_SUPPORT,context:"{supplied:'"+this.options.supplied+"'}",message:b.jPlayer.errorMsg.NO_SUPPORT,
hint:b.jPlayer.errorHint.NO_SUPPORT})},_resetMedia:function(){this._resetStatus();this._updateButtons(false);this._updateInterface();this._seeked();this.internal.poster.jq.hide();clearTimeout(this.internal.htmlDlyCmdId);this.html.active?this._html_resetMedia():this.flash.active&&this._flash_resetMedia()},clearMedia:function(){this._resetMedia();this.html.active?this._html_clearMedia():this.flash.active&&this._flash_clearMedia();this._resetGate();this._resetActive()},load:function(){this.status.srcSet?
this.html.active?this._html_load():this.flash.active&&this._flash_load():this._urlNotSetError("load")},play:function(a){a=typeof a==="number"?a:NaN;this.status.srcSet?this.html.active?this._html_play(a):this.flash.active&&this._flash_play(a):this._urlNotSetError("play")},videoPlay:function(){this.play()},pause:function(a){a=typeof a==="number"?a:NaN;this.status.srcSet?this.html.active?this._html_pause(a):this.flash.active&&this._flash_pause(a):this._urlNotSetError("pause")},pauseOthers:function(){var a=
this;b.each(this.instances,function(b,d){a.element!==d&&d.data("jPlayer").status.srcSet&&d.jPlayer("pause")})},stop:function(){this.status.srcSet?this.html.active?this._html_pause(0):this.flash.active&&this._flash_pause(0):this._urlNotSetError("stop")},playHead:function(a){a=this._limitValue(a,0,100);this.status.srcSet?this.html.active?this._html_playHead(a):this.flash.active&&this._flash_playHead(a):this._urlNotSetError("playHead")},_muted:function(a){this.options.muted=a;this.html.used&&this._html_mute(a);
this.flash.used&&this._flash_mute(a);if(!this.html.video.gate&&!this.html.audio.gate){this._updateMute(a);this._updateVolume(this.options.volume);this._trigger(b.jPlayer.event.volumechange)}},mute:function(a){a=a===f?true:!!a;this._muted(a)},unmute:function(a){a=a===f?true:!!a;this._muted(!a)},_updateMute:function(a){if(a===f)a=this.options.muted;if(this.css.jq.mute.length&&this.css.jq.unmute.length)if(this.status.noVolume){this.css.jq.mute.hide();this.css.jq.unmute.hide()}else if(a){this.css.jq.mute.hide();
this.css.jq.unmute.show()}else{this.css.jq.mute.show();this.css.jq.unmute.hide()}},volume:function(a){a=this._limitValue(a,0,1);this.options.volume=a;this.html.used&&this._html_volume(a);this.flash.used&&this._flash_volume(a);if(!this.html.video.gate&&!this.html.audio.gate){this._updateVolume(a);this._trigger(b.jPlayer.event.volumechange)}},volumeBar:function(a){if(this.css.jq.volumeBar.length){var b=this.css.jq.volumeBar.offset(),d=a.pageX-b.left,e=this.css.jq.volumeBar.width(),a=this.css.jq.volumeBar.height()-
a.pageY+b.top,b=this.css.jq.volumeBar.height();this.options.verticalVolume?this.volume(a/b):this.volume(d/e)}this.options.muted&&this._muted(false)},volumeBarValue:function(a){this.volumeBar(a)},_updateVolume:function(a){if(a===f)a=this.options.volume;a=this.options.muted?0:a;if(this.status.noVolume){this.css.jq.volumeBar.length&&this.css.jq.volumeBar.hide();this.css.jq.volumeBarValue.length&&this.css.jq.volumeBarValue.hide();this.css.jq.volumeMax.length&&this.css.jq.volumeMax.hide()}else{this.css.jq.volumeBar.length&&
this.css.jq.volumeBar.show();if(this.css.jq.volumeBarValue.length){this.css.jq.volumeBarValue.show();this.css.jq.volumeBarValue[this.options.verticalVolume?"height":"width"](a*100+"%")}this.css.jq.volumeMax.length&&this.css.jq.volumeMax.show()}},volumeMax:function(){this.volume(1);this.options.muted&&this._muted(false)},_cssSelectorAncestor:function(a){var c=this;this.options.cssSelectorAncestor=a;this._removeUiClass();this.ancestorJq=a?b(a):[];a&&this.ancestorJq.length!==1&&this._warning({type:b.jPlayer.warning.CSS_SELECTOR_COUNT,
context:a,message:b.jPlayer.warningMsg.CSS_SELECTOR_COUNT+this.ancestorJq.length+" found for cssSelectorAncestor.",hint:b.jPlayer.warningHint.CSS_SELECTOR_COUNT});this._addUiClass();b.each(this.options.cssSelector,function(a,b){c._cssSelector(a,b)})},_cssSelector:function(a,c){var d=this;if(typeof c==="string")if(b.jPlayer.prototype.options.cssSelector[a]){this.css.jq[a]&&this.css.jq[a].length&&this.css.jq[a].unbind(".jPlayer");this.options.cssSelector[a]=c;this.css.cs[a]=this.options.cssSelectorAncestor+
" "+c;this.css.jq[a]=c?b(this.css.cs[a]):[];this.css.jq[a].length&&this.css.jq[a].bind("click.jPlayer",function(c){d[a](c);b(this).blur();return false});c&&this.css.jq[a].length!==1&&this._warning({type:b.jPlayer.warning.CSS_SELECTOR_COUNT,context:this.css.cs[a],message:b.jPlayer.warningMsg.CSS_SELECTOR_COUNT+this.css.jq[a].length+" found for "+a+" method.",hint:b.jPlayer.warningHint.CSS_SELECTOR_COUNT})}else this._warning({type:b.jPlayer.warning.CSS_SELECTOR_METHOD,context:a,message:b.jPlayer.warningMsg.CSS_SELECTOR_METHOD,
hint:b.jPlayer.warningHint.CSS_SELECTOR_METHOD});else this._warning({type:b.jPlayer.warning.CSS_SELECTOR_STRING,context:c,message:b.jPlayer.warningMsg.CSS_SELECTOR_STRING,hint:b.jPlayer.warningHint.CSS_SELECTOR_STRING})},seekBar:function(a){if(this.css.jq.seekBar){var b=this.css.jq.seekBar.offset(),a=a.pageX-b.left,b=this.css.jq.seekBar.width();this.playHead(100*a/b)}},playBar:function(a){this.seekBar(a)},repeat:function(){this._loop(true)},repeatOff:function(){this._loop(false)},_loop:function(a){if(this.options.loop!==
a){this.options.loop=a;this._updateButtons();this._trigger(b.jPlayer.event.repeat)}},currentTime:function(){},duration:function(){},gui:function(){},noSolution:function(){},option:function(a,c){var d=a;if(arguments.length===0)return b.extend(true,{},this.options);if(typeof a==="string"){var e=a.split(".");if(c===f){for(var d=b.extend(true,{},this.options),g=0;g<e.length;g++)if(d[e[g]]!==f)d=d[e[g]];else{this._warning({type:b.jPlayer.warning.OPTION_KEY,context:a,message:b.jPlayer.warningMsg.OPTION_KEY,
hint:b.jPlayer.warningHint.OPTION_KEY});return f}return d}for(var g=d={},h=0;h<e.length;h++)if(h<e.length-1){g[e[h]]={};g=g[e[h]]}else g[e[h]]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(a,b){c._setOption(a,b)});return this},_setOption:function(a,c){var d=this;switch(a){case "volume":this.volume(c);break;case "muted":this._muted(c);break;case "cssSelectorAncestor":this._cssSelectorAncestor(c);break;case "cssSelector":b.each(c,function(a,b){d._cssSelector(a,
b)});break;case "fullScreen":if(this.options[a]!==c){this._removeUiClass();this.options[a]=c;this._refreshSize()}break;case "size":!this.options.fullScreen&&this.options[a].cssClass!==c.cssClass&&this._removeUiClass();this.options[a]=b.extend({},this.options[a],c);this._refreshSize();break;case "sizeFull":this.options.fullScreen&&this.options[a].cssClass!==c.cssClass&&this._removeUiClass();this.options[a]=b.extend({},this.options[a],c);this._refreshSize();break;case "autohide":this.options[a]=b.extend({},
this.options[a],c);this._updateAutohide();break;case "loop":this._loop(c);break;case "nativeVideoControls":this.options[a]=b.extend({},this.options[a],c);this.status.nativeVideoControls=this._uaBlocklist(this.options.nativeVideoControls);this._restrictNativeVideoControls();this._updateNativeVideoControls();break;case "noFullScreen":this.options[a]=b.extend({},this.options[a],c);this.status.nativeVideoControls=this._uaBlocklist(this.options.nativeVideoControls);this.status.noFullScreen=this._uaBlocklist(this.options.noFullScreen);
this._restrictNativeVideoControls();this._updateButtons();break;case "noVolume":this.options[a]=b.extend({},this.options[a],c);this.status.noVolume=this._uaBlocklist(this.options.noVolume);this._updateVolume();this._updateMute();break;case "emulateHtml":if(this.options[a]!==c)(this.options[a]=c)?this._emulateHtmlBridge():this._destroyHtmlBridge()}return this},_refreshSize:function(){this._setSize();this._addUiClass();this._updateSize();this._updateButtons();this._updateAutohide();this._trigger(b.jPlayer.event.resize)},
_setSize:function(){if(this.options.fullScreen){this.status.width=this.options.sizeFull.width;this.status.height=this.options.sizeFull.height;this.status.cssClass=this.options.sizeFull.cssClass}else{this.status.width=this.options.size.width;this.status.height=this.options.size.height;this.status.cssClass=this.options.size.cssClass}this.element.css({width:this.status.width,height:this.status.height})},_addUiClass:function(){this.ancestorJq.length&&this.ancestorJq.addClass(this.status.cssClass)},_removeUiClass:function(){this.ancestorJq.length&&
this.ancestorJq.removeClass(this.status.cssClass)},_updateSize:function(){this.internal.poster.jq.css({width:this.status.width,height:this.status.height});!this.status.waitForPlay&&this.html.active&&this.status.video||this.html.video.available&&this.html.used&&this.status.nativeVideoControls?this.internal.video.jq.css({width:this.status.width,height:this.status.height}):!this.status.waitForPlay&&(this.flash.active&&this.status.video)&&this.internal.flash.jq.css({width:this.status.width,height:this.status.height})},
_updateAutohide:function(){var a=this,b=function(){a.css.jq.gui.fadeIn(a.options.autohide.fadeIn,function(){clearTimeout(a.internal.autohideId);a.internal.autohideId=setTimeout(function(){a.css.jq.gui.fadeOut(a.options.autohide.fadeOut)},a.options.autohide.hold)})};if(this.css.jq.gui.length){this.css.jq.gui.stop(true,true);clearTimeout(this.internal.autohideId);this.element.unbind(".jPlayerAutohide");this.css.jq.gui.unbind(".jPlayerAutohide");if(this.status.nativeVideoControls)this.css.jq.gui.hide();
else if(this.options.fullScreen&&this.options.autohide.full||!this.options.fullScreen&&this.options.autohide.restored){this.element.bind("mousemove.jPlayer.jPlayerAutohide",b);this.css.jq.gui.bind("mousemove.jPlayer.jPlayerAutohide",b);this.css.jq.gui.hide()}else this.css.jq.gui.show()}},fullScreen:function(){this._setOption("fullScreen",true)},restoreScreen:function(){this._setOption("fullScreen",false)},_html_initMedia:function(){this.htmlElement.media.src=this.status.src;this.options.preload!==
"none"&&this._html_load();this._trigger(b.jPlayer.event.timeupdate)},_html_setAudio:function(a){var c=this;b.each(this.formats,function(b,e){if(c.html.support[e]&&a[e]){c.status.src=a[e];c.status.format[e]=true;c.status.formatType=e;return false}});this.htmlElement.media=this.htmlElement.audio;this._html_initMedia()},_html_setVideo:function(a){var c=this;b.each(this.formats,function(b,e){if(c.html.support[e]&&a[e]){c.status.src=a[e];c.status.format[e]=true;c.status.formatType=e;return false}});if(this.status.nativeVideoControls)this.htmlElement.video.poster=
this._validString(a.poster)?a.poster:"";this.htmlElement.media=this.htmlElement.video;this._html_initMedia()},_html_resetMedia:function(){if(this.htmlElement.media){this.htmlElement.media.id===this.internal.video.id&&!this.status.nativeVideoControls&&this.internal.video.jq.css({width:"0px",height:"0px"});this.htmlElement.media.pause()}},_html_clearMedia:function(){if(this.htmlElement.media){this.htmlElement.media.src="";this.htmlElement.media.load()}},_html_load:function(){if(this.status.waitForLoad){this.status.waitForLoad=
false;this.htmlElement.media.load()}clearTimeout(this.internal.htmlDlyCmdId)},_html_play:function(a){var b=this;this._html_load();this.htmlElement.media.play();if(!isNaN(a))try{this.htmlElement.media.currentTime=a}catch(d){this.internal.htmlDlyCmdId=setTimeout(function(){b.play(a)},100);return}this._html_checkWaitForPlay()},_html_pause:function(a){var b=this;a>0?this._html_load():clearTimeout(this.internal.htmlDlyCmdId);this.htmlElement.media.pause();if(!isNaN(a))try{this.htmlElement.media.currentTime=
a}catch(d){this.internal.htmlDlyCmdId=setTimeout(function(){b.pause(a)},100);return}a>0&&this._html_checkWaitForPlay()},_html_playHead:function(a){var b=this;this._html_load();try{if(typeof this.htmlElement.media.seekable==="object"&&this.htmlElement.media.seekable.length>0)this.htmlElement.media.currentTime=a*this.htmlElement.media.seekable.end(this.htmlElement.media.seekable.length-1)/100;else if(this.htmlElement.media.duration>0&&!isNaN(this.htmlElement.media.duration))this.htmlElement.media.currentTime=
a*this.htmlElement.media.duration/100;else throw"e";}catch(d){this.internal.htmlDlyCmdId=setTimeout(function(){b.playHead(a)},100);return}this.status.waitForLoad||this._html_checkWaitForPlay()},_html_checkWaitForPlay:function(){if(this.status.waitForPlay){this.status.waitForPlay=false;this.css.jq.videoPlay.length&&this.css.jq.videoPlay.hide();if(this.status.video){this.internal.poster.jq.hide();this.internal.video.jq.css({width:this.status.width,height:this.status.height})}}},_html_volume:function(a){if(this.html.audio.available)this.htmlElement.audio.volume=
a;if(this.html.video.available)this.htmlElement.video.volume=a},_html_mute:function(a){if(this.html.audio.available)this.htmlElement.audio.muted=a;if(this.html.video.available)this.htmlElement.video.muted=a},_flash_setAudio:function(a){var c=this;try{b.each(this.formats,function(b,d){if(c.flash.support[d]&&a[d]){switch(d){case "m4a":case "fla":c._getMovie().fl_setAudio_m4a(a[d]);break;case "mp3":c._getMovie().fl_setAudio_mp3(a[d]);break;case "rtmpa":c._getMovie().fl_setAudio_rtmp(a[d])}c.status.src=
a[d];c.status.format[d]=true;c.status.formatType=d;return false}});if(this.options.preload==="auto"){this._flash_load();this.status.waitForLoad=false}}catch(d){this._flashError(d)}},_flash_setVideo:function(a){var c=this;try{b.each(this.formats,function(b,d){if(c.flash.support[d]&&a[d]){switch(d){case "m4v":case "flv":c._getMovie().fl_setVideo_m4v(a[d]);break;case "rtmpv":c._getMovie().fl_setVideo_rtmp(a[d])}c.status.src=a[d];c.status.format[d]=true;c.status.formatType=d;return false}});if(this.options.preload===
"auto"){this._flash_load();this.status.waitForLoad=false}}catch(d){this._flashError(d)}},_flash_resetMedia:function(){this.internal.flash.jq.css({width:"0px",height:"0px"});this._flash_pause(NaN)},_flash_clearMedia:function(){try{this._getMovie().fl_clearMedia()}catch(a){this._flashError(a)}},_flash_load:function(){try{this._getMovie().fl_load()}catch(a){this._flashError(a)}this.status.waitForLoad=false},_flash_play:function(a){try{this._getMovie().fl_play(a)}catch(b){this._flashError(b)}this.status.waitForLoad=
false;this._flash_checkWaitForPlay()},_flash_pause:function(a){try{this._getMovie().fl_pause(a)}catch(b){this._flashError(b)}if(a>0){this.status.waitForLoad=false;this._flash_checkWaitForPlay()}},_flash_playHead:function(a){try{this._getMovie().fl_play_head(a)}catch(b){this._flashError(b)}this.status.waitForLoad||this._flash_checkWaitForPlay()},_flash_checkWaitForPlay:function(){if(this.status.waitForPlay){this.status.waitForPlay=false;this.css.jq.videoPlay.length&&this.css.jq.videoPlay.hide();if(this.status.video){this.internal.poster.jq.hide();
this.internal.flash.jq.css({width:this.status.width,height:this.status.height})}}},_flash_volume:function(a){try{this._getMovie().fl_volume(a)}catch(b){this._flashError(b)}},_flash_mute:function(a){try{this._getMovie().fl_mute(a)}catch(b){this._flashError(b)}},_getMovie:function(){return document[this.internal.flash.id]},_checkForFlash:function(a){var b=false,d;if(window.ActiveXObject)try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+a);b=true}catch(e){}else if(navigator.plugins&&navigator.mimeTypes.length>
0)(d=navigator.plugins["Shockwave Flash"])&&navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/,"$1")>=a&&(b=true);return b},_validString:function(a){return a&&typeof a==="string"},_limitValue:function(a,b,d){return a<b?b:a>d?d:a},_urlNotSetError:function(a){this._error({type:b.jPlayer.error.URL_NOT_SET,context:a,message:b.jPlayer.errorMsg.URL_NOT_SET,hint:b.jPlayer.errorHint.URL_NOT_SET})},_flashError:function(a){var c;c=this.internal.ready?"FLASH_DISABLED":"FLASH";this._error({type:b.jPlayer.error[c],
context:this.internal.flash.swf,message:b.jPlayer.errorMsg[c]+a.message,hint:b.jPlayer.errorHint[c]});this.internal.flash.jq.css({width:"1px",height:"1px"})},_error:function(a){this._trigger(b.jPlayer.event.error,a);this.options.errorAlerts&&this._alert("Error!"+(a.message?"\n\n"+a.message:"")+(a.hint?"\n\n"+a.hint:"")+"\n\nContext: "+a.context)},_warning:function(a){this._trigger(b.jPlayer.event.warning,f,a);this.options.warningAlerts&&this._alert("Warning!"+(a.message?"\n\n"+a.message:"")+(a.hint?
"\n\n"+a.hint:"")+"\n\nContext: "+a.context)},_alert:function(a){alert("jPlayer "+this.version.script+" : id='"+this.internal.self.id+"' : "+a)},_emulateHtmlBridge:function(){var a=this;b.each(b.jPlayer.emulateMethods.split(/\s+/g),function(b,d){a.internal.domNode[d]=function(b){a[d](b)}});b.each(b.jPlayer.event,function(c,d){var e=true;b.each(b.jPlayer.reservedEvent.split(/\s+/g),function(a,b){if(b===c)return e=false});e&&a.element.bind(d+".jPlayer.jPlayerHtml",function(){a._emulateHtmlUpdate();
var b=document.createEvent("Event");b.initEvent(c,false,true);a.internal.domNode.dispatchEvent(b)})})},_emulateHtmlUpdate:function(){var a=this;b.each(b.jPlayer.emulateStatus.split(/\s+/g),function(b,d){a.internal.domNode[d]=a.status[d]});b.each(b.jPlayer.emulateOptions.split(/\s+/g),function(b,d){a.internal.domNode[d]=a.options[d]})},_destroyHtmlBridge:function(){var a=this;this.element.unbind(".jPlayerHtml");b.each((b.jPlayer.emulateMethods+" "+b.jPlayer.emulateStatus+" "+b.jPlayer.emulateOptions).split(/\s+/g),
function(b,d){delete a.internal.domNode[d]})}};b.jPlayer.error={FLASH:"e_flash",FLASH_DISABLED:"e_flash_disabled",NO_SOLUTION:"e_no_solution",NO_SUPPORT:"e_no_support",URL:"e_url",URL_NOT_SET:"e_url_not_set",VERSION:"e_version"};b.jPlayer.errorMsg={FLASH:"jPlayer's Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ",FLASH_DISABLED:"jPlayer's Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ",NO_SOLUTION:"No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.",
NO_SUPPORT:"It is not possible to play any media format provided in setMedia() on this browser using your current options.",URL:"Media URL could not be loaded.",URL_NOT_SET:"Attempt to issue media playback commands, while no media url is set.",VERSION:"jPlayer "+b.jPlayer.prototype.version.script+" needs Jplayer.swf version "+b.jPlayer.prototype.version.needFlash+" but found "};b.jPlayer.errorHint={FLASH:"Check your swfPath option and that Jplayer.swf is there.",FLASH_DISABLED:"Check that you have not display:none; the jPlayer entity or any ancestor.",
NO_SOLUTION:"Review the jPlayer options: support and supplied.",NO_SUPPORT:"Video or audio formats defined in the supplied option are missing.",URL:"Check media URL is valid.",URL_NOT_SET:"Use setMedia() to set the media URL.",VERSION:"Update jPlayer files."};b.jPlayer.warning={CSS_SELECTOR_COUNT:"e_css_selector_count",CSS_SELECTOR_METHOD:"e_css_selector_method",CSS_SELECTOR_STRING:"e_css_selector_string",OPTION_KEY:"e_option_key"};b.jPlayer.warningMsg={CSS_SELECTOR_COUNT:"The number of css selectors found did not equal one: ",
CSS_SELECTOR_METHOD:"The methodName given in jPlayer('cssSelector') is not a valid jPlayer method.",CSS_SELECTOR_STRING:"The methodCssSelector given in jPlayer('cssSelector') is not a String or is empty.",OPTION_KEY:"The option requested in jPlayer('option') is undefined."};b.jPlayer.warningHint={CSS_SELECTOR_COUNT:"Check your css selector and the ancestor.",CSS_SELECTOR_METHOD:"Check your method name.",CSS_SELECTOR_STRING:"Check your css selector is a string.",OPTION_KEY:"Check your option name."}})(jQuery);

jQuery(document).ready(function($){

	//infographic Call Code

	//Pagebuild: InfoGarphic - Bignumber
	jQuery('.bignumber-item').each(function(){

		var digit = jQuery(this).data('digit');

		if( Modernizr.touch ) {
			jQuery(this).animateNumbers(digit, false, 1000);
		}else{
			jQuery(this).waypoint(function() {jQuery(this).animateNumbers(digit, false, 1000);}, { offset: '100%'});
		}

	});

	//Pagebuild: InfoGarphic -  Columns
	jQuery('.infrographic.columns').each(function(index, element) {
        var
		_this = jQuery(this),
		vbar_items  = _this.find('.vbar-item').length,
		vbar_item_width = 100/vbar_items;
		_this.find('.vbar-item').css({width:vbar_item_width+'%'});


		_this.waypoint(function(){
			_this.find('.vbar').each(function(){
				jQuery(this).jqbar({ label: jQuery(this).attr('data-lbl'), value: jQuery(this).attr('data-val'), barColor: jQuery(this).attr('data-clr'), barWidth:160, orientation: 'v' });
			});
		}, {
			offset: '100%',
			triggerOnce: true
		});


	});

	//Pagebuild: InfoGarphic -  Pictorial
	jQuery('.infrographic.pictorial').each(function(index, element) {
        var _this     = jQuery(this),
		    _thisIcon = _this.find("i");

		if(_thisIcon.hasClass('m-people-male')||_thisIcon.hasClass('m-people-female') || _thisIcon.hasClass('m-up-arrow')|| _thisIcon.hasClass('m-down-arrow')|| _thisIcon.hasClass('m-dot') ){
			_this.find('.bar').css({width:'46px'})
		}
		_this.waypoint(function(){
			_this.find('.progress_bars_with_image_content .bar').each(function(i, element) {
                var bar = jQuery(this);
				if(i < bar.parent().attr('data-number')){
					var $this = this;
					setTimeout(function(){$this.setAttribute("class", "bar active");}, (i + 1) * 300);
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
		_this.waypoint(function(){
			if(_knob.val() == 0){
				jQuery({value: 0}).animate({value: progress}, {
					duration: 2000,
					easing:'swing',
					step: function()
					{
						_knob.val(Math.ceil(this.value)).trigger('change');
					},
					complete: function(){
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

		if( Modernizr.touch ) {
			moveProgressBar(_this);
		}else{
			_this.waypoint(function(){
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
(function ($) {
    $.fn.extend({
        jqbar: function (options) {
            var settings = $.extend({
                animationSpeed: 2000,
                barLength: 200,
                orientation: 'h',
                barWidth: 10,
                barColor: 'red',
                label: '&nbsp;',
                value: 100
            }, options);

            return this.each(function () {

                var valueLabelHeight = 0;
                var progressContainer = $(this);

                if (settings.orientation == 'h') {

                    progressContainer.addClass('jqbar horizontal').append('<span class="bar-label"></span><span class="bar-level-wrapper"><span class="bar-level"></span></span><span class="bar-percent"></span>');

                    var progressLabel = progressContainer.find('.bar-label').html(settings.label);
                    var progressBar = progressContainer.find('.bar-level').attr('data-value', settings.value);
                    var progressBarWrapper = progressContainer.find('.bar-level-wrapper');

                    progressBar.css({ height: settings.barWidth, width: 0, backgroundColor: settings.barColor });

                    var valueLabel = progressContainer.find('.bar-percent');
                    valueLabel.html('0');
                }
                else {

                    progressContainer.addClass('jqbar vertical').append('<span class="bar-level-wrapper"><span class="bar-level"></span></span><span class="bar-percent"></span><span class="bar-label"></span>');

                    var progressLabel = progressContainer.find('.bar-label').html(settings.label);
                    var progressBar = progressContainer.find('.bar-level').attr('data-value', settings.value);
                    var progressBarWrapper = progressContainer.find('.bar-level-wrapper');

                    progressContainer.css('height', settings.barLength);
                    progressBar.css({ height: settings.barLength, top: settings.barLength, backgroundColor: settings.barColor });
                    progressBarWrapper.css({ height: settings.barLength});

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
                        progressBar.animate({ width: w }, {
                            duration: 2000,
                            step: function (currentWidth) {
                                var percent = parseInt(currentWidth / settings.barLength * 100);
                                if (isNaN(percent))
                                    percent = 0;
                                progressContainer.find('.bar-percent').html(percent + '%');
                            }
                        });
                    }
                    else {

                        var h = settings.barLength - settings.barLength * level / 100;
                        progressBar.animate({ top: h }, {
                            duration: 2000,
                            step: function (currentValue) {
                                var percent = parseInt((settings.barLength - parseInt(currentValue)) / settings.barLength * 100);
                                if (isNaN(percent))
                                    percent = 0;
                                progressContainer.find('.bar-percent').html(Math.abs(percent) + '%');
                            }
                        });

                        progressContainer.find('.bar-percent').animate({ top: (h - valueLabelHeight) }, 2000);

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
            $({value: start}).animate({value: stop}, {
            	duration: duration == undefined ? 1000 : duration,
            	easing: ease == undefined ? "swing" : ease,
            	step: function() {
            		$this.text(Math.floor(this.value));
					if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
            	},
            	complete: function() {
            	   if (parseInt($this.text()) !== stop) {
            	       $this.text(stop);
					   if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
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

(function($){"use strict";var k={},max=Math.max,min=Math.min;k.c={};k.c.d=$(document);k.c.t=function(e){return e.originalEvent.touches.length-1;};k.o=function(){var s=this;this.o=null;this.$=null;this.i=null;this.g=null;this.v=null;this.cv=null;this.x=0;this.y=0;this.$c=null;this.c=null;this.t=0;this.isInit=false;this.fgColor=null;this.pColor=null;this.dH=null;this.cH=null;this.eH=null;this.rH=null;this.run=function(){var cf=function(e,conf){var k;for(k in conf){s.o[k]=conf[k];}
s.init();s._configure()._draw();};if(this.$.data('kontroled'))return;this.$.data('kontroled',true);this.extend();this.o=$.extend({min:this.$.data('min')||0,max:this.$.data('max')||100,stopper:true,readOnly:this.$.data('readonly'),cursor:(this.$.data('cursor')===true&&30)||this.$.data('cursor')||0,thickness:this.$.data('thickness')||0.35,width:this.$.data('width')||200,height:this.$.data('height')||200,displayInput:this.$.data('displayinput')==null||this.$.data('displayinput'),displayPrevious:this.$.data('displayprevious'),fgColor:this.$.data('fgcolor')||'#87CEEB',inline:false,draw:null,change:null,cancel:null,release:null},this.o);if(this.$.is('fieldset')){this.v={};this.i=this.$.find('input')
this.i.each(function(k){var $this=$(this);s.i[k]=$this;s.v[k]=$this.val();$this.bind('change',function(){var val={};val[k]=$this.val();s.val(val);});});this.$.find('legend').remove();}else{this.i=this.$;this.v=this.$.val();(this.v=='')&&(this.v=this.o.min);this.$.bind('change',function(){s.val(s.$.val());});}
(!this.o.displayInput)&&this.$.hide();this.$c=$(document.createElement('canvas')).attr({width:this.o.width,height:this.o.height});this.$.wrap($('<div style="'+(this.o.inline?'display:inline;':'')+'width:'+this.o.width+'px;height:'+
this.o.height+'px;"></div>')).before(this.$c);if(typeof G_vmlCanvasManager!=='undefined'){G_vmlCanvasManager.initElement(this.$c[0]);}
this.c=this.$c[0].getContext("2d");if(this.v instanceof Object){this.cv={};this.copy(this.v,this.cv);}else{this.cv=this.v;}
this.$.bind("configure",cf).parent().bind("configure",cf);this._listen()._configure()._xy().init();this.isInit=true;this._draw();return this;};this._draw=function(){var d=true;s.g=s.c;s.clear();s.dH&&(d=s.dH());(d!==false)&&s.draw();};this._touch=function(e){var touchMove=function(e){var v=s.xy2val(e.originalEvent.touches[s.t].pageX,e.originalEvent.touches[s.t].pageY);if(v==s.cv)return;if(s.cH&&(s.cH(v)===false))return;s.change(v);s._draw();};this.t=k.c.t(e);touchMove(e);k.c.d.bind("touchmove.k",touchMove).bind("touchend.k",function(){k.c.d.unbind('touchmove.k touchend.k');if(s.rH&&(s.rH(s.cv)===false))return;s.val(s.cv);});return this;};this._mouse=function(e){var mouseMove=function(e){var v=s.xy2val(e.pageX,e.pageY);if(v==s.cv)return;if(s.cH&&(s.cH(v)===false))return;s.change(v);s._draw();};mouseMove(e);k.c.d.bind("mousemove.k",mouseMove).bind("keyup.k",function(e){if(e.keyCode===27){k.c.d.unbind("mouseup.k mousemove.k keyup.k");if(s.eH&&(s.eH()===false))return;s.cancel();}}).bind("mouseup.k",function(e){k.c.d.unbind('mousemove.k mouseup.k keyup.k');if(s.rH&&(s.rH(s.cv)===false))return;s.val(s.cv);});return this;};this._xy=function(){var o=this.$c.offset();this.x=o.left;this.y=o.top;return this;};this._listen=function(){if(!this.o.readOnly){this.$c.bind("mousedown",function(e){e.preventDefault();s._xy()._mouse(e);}).bind("touchstart",function(e){e.preventDefault();s._xy()._touch(e);});this.listen();}else{this.$.attr('readonly','readonly');}
return this;};this._configure=function(){if(this.o.draw)this.dH=this.o.draw;if(this.o.change)this.cH=this.o.change;if(this.o.cancel)this.eH=this.o.cancel;if(this.o.release)this.rH=this.o.release;if(this.o.displayPrevious){this.pColor=this.h2rgba(this.o.fgColor,"0.4");this.fgColor=this.h2rgba(this.o.fgColor,"0.6");}else{this.fgColor=this.o.fgColor;}
return this;};this._clear=function(){this.$c[0].width=this.$c[0].width;};this.listen=function(){};this.extend=function(){};this.init=function(){};this.change=function(v){};this.val=function(v){};this.xy2val=function(x,y){};this.draw=function(){};this.clear=function(){this._clear();};this.h2rgba=function(h,a){var rgb;h=h.substring(1,7)
rgb=[parseInt(h.substring(0,2),16),parseInt(h.substring(2,4),16),parseInt(h.substring(4,6),16)];return"rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+","+a+")";};this.copy=function(f,t){for(var i in f){t[i]=f[i];}};};k.Dial=function(){k.o.call(this);this.startAngle=null;this.xy=null;this.radius=null;this.lineWidth=null;this.cursorExt=null;this.w2=null;this.PI2=2*Math.PI;this.extend=function(){this.o=$.extend({bgColor:this.$.data('bgcolor')||'#EEEEEE',angleOffset:this.$.data('angleoffset')||0,angleArc:this.$.data('anglearc')||360,inline:true},this.o);};this.val=function(v){if(null!=v){this.cv=this.o.stopper?max(min(v,this.o.max),this.o.min):v;this.v=this.cv;this.$.val(this.v);this._draw();}else{return this.v;}};this.xy2val=function(x,y){var a,ret;a=Math.atan2(x-(this.x+this.w2),-(y-this.y-this.w2))-this.angleOffset;if(this.angleArc!=this.PI2&&(a<0)&&(a>-0.5)){a=0;}else if(a<0){a+=this.PI2;}
ret=~~(0.5+(a*(this.o.max-this.o.min)/this.angleArc))
+this.o.min;this.o.stopper&&(ret=max(min(ret,this.o.max),this.o.min));return ret;};this.listen=function(){var s=this,mw=function(e){e.preventDefault();var ori=e.originalEvent,deltaX=ori.detail||ori.wheelDeltaX,deltaY=ori.detail||ori.wheelDeltaY,v=parseInt(s.$.val()||s.o.min)+(deltaX>0||deltaY>0?1:deltaX<0||deltaY<0?-1:0);if(s.cH&&(s.cH(v)===false))return;s.val(v);},kval,to,m=1,kv={37:-1,38:1,39:1,40:-1};this.$.bind("keydown",function(e){var kc=e.keyCode;if(kc>=96&&kc<=105){kc=e.keyCode=kc-48;}
kval=parseInt(String.fromCharCode(kc));if(isNaN(kval)){(kc!==13)&&(kc!==8)&&(kc!==9)&&(kc!==189)&&e.preventDefault();if($.inArray(kc,[37,38,39,40])>-1){e.preventDefault();var v=parseInt(s.$.val())+kv[kc]*m;s.o.stopper&&(v=max(min(v,s.o.max),s.o.min));s.change(v);s._draw();to=window.setTimeout(function(){m*=2;},30);}}}).bind("keyup",function(e){if(isNaN(kval)){if(to){window.clearTimeout(to);to=null;m=1;s.val(s.$.val());}}else{(s.$.val()>s.o.max&&s.$.val(s.o.max))||(s.$.val()<s.o.min&&s.$.val(s.o.min));}});this.$c.bind("mousewheel DOMMouseScroll",mw);this.$.bind("mousewheel DOMMouseScroll",mw)};this.init=function(){if(this.v<this.o.min||this.v>this.o.max)this.v=this.o.min;this.$.val(this.v);this.w2=this.o.width/2;this.cursorExt=this.o.cursor/100;this.xy=this.w2;this.lineWidth=this.xy*this.o.thickness;this.radius=this.xy-this.lineWidth/2;this.o.angleOffset&&(this.o.angleOffset=isNaN(this.o.angleOffset)?0:this.o.angleOffset);this.o.angleArc&&(this.o.angleArc=isNaN(this.o.angleArc)?this.PI2:this.o.angleArc);this.angleOffset=this.o.angleOffset*Math.PI/180;this.angleArc=this.o.angleArc*Math.PI/180;this.startAngle=1.5*Math.PI+this.angleOffset;this.endAngle=1.5*Math.PI+this.angleOffset+this.angleArc;var s=max(String(Math.abs(this.o.max)).length,String(Math.abs(this.o.min)).length,2)+2;this.o.displayInput&&this.i.css({'width':((this.o.width/2+4)>>0)+'px','height':((this.o.width/3)>>0)+'px','position':'absolute','vertical-align':'middle','margin-top':((this.o.width/3)>>0)+'px','margin-left':'-'+((this.o.width*3/4+2)>>0)+'px','border':0,'background':'none','font':'300 26px Arial','text-align':'center','color':this.o.fgColor,'padding':'0px','-webkit-appearance':'none'})||this.i.css({'width':'0px','visibility':'hidden'});};this.change=function(v){this.cv=v;this.$.val(v);};this.angle=function(v){return(v-this.o.min)*this.angleArc/(this.o.max-this.o.min);};this.draw=function(){var c=this.g,a=this.angle(this.cv),sat=this.startAngle,eat=sat+a,sa,ea,r=1;c.lineWidth=this.lineWidth;this.o.cursor&&(sat=eat-this.cursorExt)&&(eat=eat+this.cursorExt);c.beginPath();c.strokeStyle=this.o.bgColor;c.arc(this.xy,this.xy,this.radius,this.endAngle,this.startAngle,true);c.stroke();if(this.o.displayPrevious){ea=this.startAngle+this.angle(this.v);sa=this.startAngle;this.o.cursor&&(sa=ea-this.cursorExt)&&(ea=ea+this.cursorExt);c.beginPath();c.strokeStyle=this.pColor;c.arc(this.xy,this.xy,this.radius,sa,ea,false);c.stroke();r=(this.cv==this.v);}
c.beginPath();c.strokeStyle=r?this.o.fgColor:this.fgColor;c.arc(this.xy,this.xy,this.radius,sat,eat,false);c.stroke();};this.cancel=function(){this.val(this.v);};};$.fn.dial=$.fn.knob=function(o){return this.each(function(){var d=new k.Dial();d.o=o;d.$=$(this);d.run();}).parent();};})(jQuery);

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
		_moudle_liquid_list.each(function(){
			var liquid_width = jQuery(this).width();
			if( liquid_width < 480 ){
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
			angular.element('#albumContainer').scope().selectAlbum(_this.attr("data-postid"));
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

function ThemeIsotope(){
	var ux_ts = this;
	var theme_win = jQuery(window);

	//ts init
	this.init = function(){
		//ThemeIsotope: isotope list double width
		var _isotope_width4 = jQuery('.isotope .width4');
		if(_isotope_width4.length){
			ux_ts.isotopewidth4();
		}

		//ThemeIsotope: Run isotope
		$allcontainer = jQuery('.container-fluid.main');

		//ThemeIsotope: Call isotope
		var _isotope = jQuery('.isotope');
		if(_isotope.length){
			ux_ts.callisotope();
		}

		//ThemeIsotope: isotope filter
		var _filters = jQuery('.filters');
		if(_filters.length){
			ux_ts.isotopefilters();
		}

		//win smartresize
		theme_win.smartresize(function(){
			ux_ts.refresh();
		}).resize();

		theme_win.load(function(){
			ux_ts.refresh();
		});
	}

	this.refresh = function(){
		var _isotope = jQuery('.isotope');
		if(_isotope.length){
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
	this.isotopewidth4 = function(){
		var _isotope_width4 = jQuery('.isotope .width4');
		_isotope_width4.each(function(index, element) {
			var width = jQuery(this).find('.fade_wrap').width();
			jQuery(this).find('img').width(width);
		});
	}

	//ThemeIsotope: isotope list responsive
	this.getUnitWidth = function(size, container){
		var width;
		switch(size){
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
					width = Math.floor(container.width() / 6);
				} else if (container.width() > 1365) {
					width = Math.floor(container.width() / 3);
				} else if (container.width() > 1279) {
					width = Math.floor(container.width() / 3);
				} else if (container.width() > 900) {
					width = Math.floor(container.width() / 3);
				} else if (container.width() > 767) {
					width = Math.floor(container.width() / 3);
				} else if (container.width() > 479) {
					width = Math.floor(container.width() / 2);
				} else {
					width = Math.floor(container.width() / 1);
				}
			break;
		}
		return width;
	}

	this.setWidths = function(size,container){
		var unitWidth = ux_ts.getUnitWidth(size,container) - 0;
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
			container.children(".width-and-small").css({ width: unitWidth * 1, height: unitWidth * 1 });
			container.children(".width-and-big").css({ width: unitWidth * 1, height: unitWidth * 1 });
			container.children(".width-and-long").css({ width: unitWidth * 1, height: unitWidth / 2 });
			container.children(".width-and-height").css({ width: unitWidth * 1, height: unitWidth * 2 });
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
			container.children(".width-and-small").css({ width: unitWidth * 1, height: unitWidth * 1 });
			container.find(".width-and-small img").css({ width: unitWidth * 1 });

			//brick --- thumb big
			container.children(".width-and-big").css({ width: unitWidth * 2, height: unitWidth * 2 });
			container.find(".width-and-big img").css({ width: unitWidth * 2, });

			//brick --- thumb long
			container.children(".width-and-long").css({ width: unitWidth * 2, height: unitWidth * 1 });
			container.find(".width-and-long img").css({ width: unitWidth * 2 });

			//brick --- thumb height
			container.children(".width-and-height").css({ width: unitWidth * 1, height: unitWidth * 2 });
			container.find(".width-and-height img").css({ width: unitWidth * 1 });

			//brick set height
			if(size == 'brick'){
				container.children().each(function(){
					var _this = jQuery(this);
					var _this_height = jQuery(this).height();

					if(Math.floor(_this.find('img').height()) < Math.floor(_this_height)){
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
	this.callisotope = function(){
		var _isotope = jQuery('.isotope');

		_isotope.each(function(index, element) {
			var _this = jQuery(this);
			var image_size = _this.data('size');

			if(image_size != 'brick'){
				ux_ts.setWidths(image_size, _this);
			}

			if(_this.is('.masonry')){
				_this.isotope({
					animationEngine : 'css',
					//resizable: false,
					masonry: {
						columnWidth: ux_ts.getUnitWidth(image_size, _this)
					}
				});
			}else if(_this.is('.grid_list')){
				_this.isotope({
					layoutMode : 'fitRows',
					animationEngine : 'css',
					//resizable: false,
					masonry: {
						columnWidth: ux_ts.getUnitWidth(image_size, _this)
					}
				});
			}

			_this.addClass('isotope_fade');
			setTimeout(function(){
				progressbar();
			}, 500);
			_this.siblings('#isotope-load').fadeOut(300);
		});
	}

	//ThemeIsotope: isotope filter
	this.isotopefilters = function(){
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

		if( _filters.find('.filter-floating-triggle').length ){

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

function consoleText(words, id, colors) {

	if (colors === undefined) colors = ['#2196F3'];
	var visible = true;
	var con = document.getElementById('console');
	var letterCount = 1;
	var x = 1;
	var waiting = false;
	var target = document.getElementById(id);

	if (target) {
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
	$('.Collage').css('visibility', 'visible');
	$('#isotope-load').fadeOut();

	setTimeout(function() {
		$('.Collage').collagePlus({
			'targetHeight': 300
		});
	}, 200);
}