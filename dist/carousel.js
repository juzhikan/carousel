!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("Carousel",[],e):"object"==typeof exports?exports.Carousel=e():t.Carousel=e()}(this,function(){return function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/dist/",e(e.s=0)}([function(t,e){function n(t){if(!(this instanceof n))return void a("Carousel is a constructor and should be called with the `new` keyword");var e=t||{};this.root=h(e.root),this.itemWrap=this.root.children[0],this.items=Array.prototype.slice.call(this.itemWrap.children,0);var i=this.items.length;this.length=i,this.offset=t.offset||s(this.root),this.speed=t.speed||300,this.indexArray=o(i),this.initState(),this.initStyle(),this.handleEvent()}function i(t,e,n){t.style.transform=e,t.style.transitionDuration=n+"ms"}function o(t){for(var e=[],n=0;n<t;n++)e.push(n);return e}function r(t,e){var n=e.match(/[A-Z]/g);if(!t.currentStyle&&n)for(var i=e,o=0;o<n.length;o++){var r=n[o];i=i.replace(r,"-"+r.toLowerCase())}return parseFloat(t.currentStyle&&t.currentStyle[i]||getComputedStyle(t,null)[e])}function s(t){var e=r(t,"width"),n=r(t,"paddingLeft"),i=r(t,"paddingRight"),o=e-n-i;return o>0&&o||document.clientWidth||document.documentElement.clientWidth}function h(t){return t&&("string"==typeof t||"object"==typeof t&&1===t.nodeType)||a("element does not exist"),"string"==typeof t&&document.querySelector("#"+t)||t}function a(t){throw new Error(t)}n.prototype.handleEvent=function(){this.itemWrap.addEventListener("touchstart",this.handleTouchStart.bind(this),!1)},n.prototype.initState=function(){},n.prototype.handleTouchStart=function(){var t=event.touches[0];this.touchStart={x:t.pageX,y:t.pageY,time:Date.now()},this.isScrolling=!1,this.bindTouchMoveFn=this.handleTouchMove.bind(this),this.bindTouchEndFn=this.handleTouchEnd.bind(this),this.itemWrap.addEventListener("touchmove",this.bindTouchMoveFn,!1),this.itemWrap.addEventListener("touchend",this.bindTouchEndFn,!1)},n.prototype.handleTouchMove=function(){if(!(event.touches.length>1||event.scale&&1!==event.scale)){var t=event.touches[0],e=this.touchStart,n=this.delta={x:t.pageX-e.x,y:t.pageY-e.y};this.isScrolling=this.isScrolling||Math.abs(n.x)>Math.abs(n.y),this.isScrolling&&(event.preventDefault(),this.handleMove(n.x))}},n.prototype.handleTouchEnd=function(){var t=this.delta.x>0?"right":"left";this.move(t),this.itemWrap.removeEventListener("touchmove",this.bindTouchMoveFn,!1),this.itemWrap.removeEventListener("touchend",this.bindTouchEndFn,!1)},n.prototype.initStyle=function(){this.hideTransform="translate("+this.offset+"px, 0px) translateZ(0px)",this.itemWrap.style.width=this.offset*this.length+"px";for(var t=this.getTransform(0),e=this.indexArray.slice(0),n=new Array(this.length),o=0;o<3;)n[o<2?e.shift():e.pop()]=t[o++];this.items.forEach(function(t,e){t.style.width=this.offset+"px",t.style.left=-this.offset*e+"px",i(t,n[e]||this.hideTransform,0)}.bind(this))},n.prototype.move=function(t){var e=this.indexArray;"left"===t?e.push(e.shift()):e.unshift(e.pop()),this.handleMove(t)},n.prototype.getTransform=function(t){return["translate("+t+"px, 0px) translateZ(0px)","translate("+(this.offset+t)+"px, 0px) translateZ(0px)","translate("+(-this.offset+t)+"px, 0px) translateZ(0px)"]},n.prototype.handleMove=function(t){for(var e="string"==typeof t?0:t,n="string"==typeof t?t:t>0?"right":"left",o=this.indexArray.slice(0),r=this.getTransform(e),s=0,h=[];s<3;)h[s]=s<2?o.shift():o.pop(),s++;var a="left"===n?h[1]:h[2],u="left"===n?o.pop():o.shift();h.forEach(function(t,n){var o=t===a||0!==e?0:this.speed;i(this.items[t],r[n],o)}.bind(this)),0===e&&i(this.items[u],this.hideTransform,0)},t.exports=n}])});