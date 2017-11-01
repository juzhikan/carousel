function Carousel (opts) {
    if (!(this instanceof Carousel))  {
        warn('Carousel is a constructor and should be called with the `new` keyword')
        return
    }
    var options = opts || {}
    this.root = getElement(options.root)
    this.itemWrap = this.root.children[0]
    this.items = Array.prototype.slice.call(this.itemWrap.children, 0)

    var length = this.items.length
    this.length = length
    this.offset = opts.offset || getOffset(this.root)
    this.speed = opts.speed || 300

    this.indexArray = indexArray(length)

    this.initState()
    this.initStyle()
    this.handleEvent()
}

Carousel.prototype.handleEvent = function () {
    this.itemWrap.addEventListener('touchstart', this.handleTouchStart.bind(this), false)
}

Carousel.prototype.initState = function () {
    
}

Carousel.prototype.handleTouchStart = function () {
    var touch = event.touches[0]
    
    this.touchStart = {
        x: touch.pageX,
        y: touch.pageY,
        time: Date.now()
    }
    this.isScrolling = false
    this.bindTouchMoveFn = this.handleTouchMove.bind(this)
    this.bindTouchEndFn = this.handleTouchEnd.bind(this)
    this.itemWrap.addEventListener('touchmove', this.bindTouchMoveFn, false)
    this.itemWrap.addEventListener('touchend', this.bindTouchEndFn, false)
}

Carousel.prototype.handleTouchMove = function () {
    if (event.touches.length > 1 || event.scale && event.scale !== 1) return

    var touch = event.touches[0]
    var touchStart = this.touchStart
    var delta = this.delta = {
        x: touch.pageX - touchStart.x,
        y: touch.pageY - touchStart.y
    }

    this.isScrolling = this.isScrolling || Math.abs(delta.x) > Math.abs(delta.y)

    if (this.isScrolling) {
        event.preventDefault()
        // self.stop()
        this.handleMove(delta.x)
    }
}

Carousel.prototype.handleTouchEnd = function () {
    var direction = this.delta.x > 0 ? 'right' : 'left'
    this.move(direction)
    this.itemWrap.removeEventListener('touchmove', this.bindTouchMoveFn, false)
    this.itemWrap.removeEventListener('touchend', this.bindTouchEndFn, false)
}

Carousel.prototype.initStyle = function () {

    this.hideTransform = 'translate(' + this.offset + 'px, 0px) translateZ(0px)'

    this.itemWrap.style.width = this.offset * this.length + 'px'

    var transform = this.getTransform(0)
    var indexArray = this.indexArray.slice(0)
    var map = new Array(this.length)
    var collect = 0
    while (collect < 3) {
        map[collect < 2 ? indexArray.shift() : indexArray.pop()] = transform[collect++]
    }

    this.items.forEach(function(item, i) {
        item.style.width = this.offset  + 'px'
        item.style.left = -this.offset*i  + 'px'
        setStyle(item, map[i] || this.hideTransform, 0)
    }.bind(this))
}

Carousel.prototype.move = function (direction) {
    var array = this.indexArray
    if (direction === 'left') {
        array.push(array.shift())
    } else {
        array.unshift(array.pop())
    }
    this.handleMove(direction)
}

Carousel.prototype.getTransform = function (delta) {
    var resp = [
        'translate(' + delta + 'px, 0px) translateZ(0px)',
        'translate(' + (this.offset + delta) + 'px, 0px) translateZ(0px)',
        'translate(' + (-this.offset + delta) + 'px, 0px) translateZ(0px)'
    ]
    return resp
}

Carousel.prototype.handleMove = function (delta) {
    var _delta = typeof delta === 'string' ? 0 : delta
    var direction = typeof delta === 'string' ? delta : (delta > 0 ? 'right' : 'left')
    var indexArray = this.indexArray.slice(0)
    var transform = this.getTransform(_delta)

    var collect = 0
    var change = []
    while (collect < 3) {
        change[collect] = (collect < 2 ? indexArray.shift() : indexArray.pop())
        collect++
    }

    var noSpeedIndex = direction === 'left' ? change[1] : change[2]
    var hideIndex = direction === 'left' ? indexArray.pop() : indexArray.shift()

    change.forEach(function (value, index) {
        var speed = (value === noSpeedIndex || _delta !== 0) ? 0 : this.speed
        setStyle(this.items[value], transform[index], speed)
    }.bind(this))

    _delta === 0 && setStyle(this.items[hideIndex], this.hideTransform, 0)
}

function setStyle (dom, transform, speed) {
    dom.style.transform = transform
    dom.style.transitionDuration = speed + 'ms'
}

function bind () {
    var self = this
    var _this = arguments[0]
    var args = Array.prototype.slice.call(arguments, 1)
    var fn = function () {}
    var res = function () {
        self.apply(_this, args.contact(Array.prototype.slice.call(arguments, 0)))
    }
    if (this.prototype) {
        fn.prototype = this.prototype
        res.prototype = new fn()
    }
    return res
}

function indexArray (length) {
    var res = []
    for (var i = 0; i < length; i++) {
        res.push(i)
    }
    return res
}

function getStyle (ele, prop) {
    var result = prop.match(/[A-Z]/g)
    if (!ele.currentStyle && result) {
        var propBridge = prop
        for (var i = 0; i < result.length; i++) {
            var upperCase = result[i]
            propBridge = propBridge.replace(upperCase, '-' + upperCase.toLowerCase())
        }
    }
    return parseFloat((ele.currentStyle && ele.currentStyle[propBridge]) || getComputedStyle(ele, null)[prop])
}

function getOffset (root) {
    var width = getStyle(root, 'width')
    var paddingLeft = getStyle(root, 'paddingLeft')
    var paddingRight = getStyle(root, 'paddingRight')
    var contentWidth = width - paddingLeft - paddingRight
    return (contentWidth > 0 && contentWidth) || document.clientWidth || document.documentElement.clientWidth
}

function getElement (el) {
    if (!(el && (typeof el === 'string' || (typeof el === 'object' && el.nodeType === 1)))) warn('element does not exist')
    return (typeof el === 'string' && document.querySelector('#' + el)) || el
}

function warn (text) {
    throw new Error(text)
}
    
export default Carousel
