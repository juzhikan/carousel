function Carousel (options) {
    if (!(this instanceof Carousel))  {
        warn('Carousel is a constructor and should be called with the `new` keyword')
        return
    }
    var opts = options || {}
    this.root = getElement(opts.root)
    this.itemWrap = this.root.children[0]
    var items = this.itemWrap.children

    /* 0个或一个元素返回 */
    if (items.length < 2) return

    /* 对于两个元素的情况进行自动补足 */
    if (items.length < 3) this.fill(items)

    this.items = Array.prototype.slice.call(this.itemWrap.children, 0)
    this.length = this.items.length
    this.speed = opts.speed || 300
    this.onSwitch = opts.onSwitch || function () {}
    this.indexArray = indexArray(this.length)

    this.init()
    this.handleEvent()

    if (opts.interval) {
        this.interval = opts.interval
        this.play()
    }
}

/*
** timer的几种状态：
**  undefined-未设置定时器 
**  null-设置但清除了定时器 
**  timerId-执行中的计时器 
**/
Carousel.prototype.play = function () {
    this.timer = setInterval(function () {
        this.move('left')
    }.bind(this), this.interval)
}

Carousel.prototype.stop = function () {
    if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
    }
}

Carousel.prototype.handleTransitionEnd = function () {
    if (this.timer === null) {
        this.play()
    }
}

Carousel.prototype.handleEvent = function () {
    this.itemWrap.addEventListener('touchstart', this.handleTouchStart.bind(this), false)
    this.itemWrap.addEventListener('touchmove', this.handleTouchMove.bind(this), false)
    this.itemWrap.addEventListener('transitionend', this.handleTransitionEnd.bind(this), false)
    window.addEventListener('resize', this.init.bind(this), false)
    /* 初次触发onSwitch回调 */
    this.onSwitch(0)
}

Carousel.prototype.handleTouchStart = function () {
    this.stop()
    var touch = event.touches[0]
    this.touchStart = {
        x: touch.pageX,
        y: touch.pageY,
        time: Date.now()
    }
    
    this.bindTouchEndFn = this.handleTouchEnd.bind(this)
    //this.itemWrap.addEventListener('touchmove', this.bindTouchMoveFn, false)
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

    this.isScrolling = this.isScrolling || Math.abs(delta.x) > Math.abs(delta.y) // this.isScrolling || 防止出现先水平后垂直走位

    if (this.isScrolling) {
        event.preventDefault()
        this.handleMove(delta.x)
    }
}

Carousel.prototype.handleTouchEnd = function () {
    /* 删除事件，避免叠加 */
    //this.itemWrap.removeEventListener('touchmove', this.bindTouchMoveFn, false)
    this.itemWrap.removeEventListener('touchend', this.bindTouchEndFn, false)
    
    if (!this.isScrolling) {
        this.timer === null && this.play()
        return
    }

    var interval = Date.now() - this.touchStart.time
    var distance = Math.abs(this.delta.x)
    var isValidSlide = (interval < 250 && distance > 20) || distance > this.offset/2

    var directions = ['left', 'right']
    var direction = this.delta.x > 0 ? directions.pop() : directions.shift()
    var reverseDirection = directions[0]

    if (isValidSlide) {
        this.move(direction)
    } else {
        this.handleMove(reverseDirection)
    }

    /* 重置 */
    this.delta = null
    this.isScrolling = false
}

/* 获取切换后index,要考虑到自动补足的情况 */
Carousel.prototype.getIndex = function () {
    var index = this.indexArray[0]
    return this.__fill ? index % 2 : index
}

Carousel.prototype.move = function (direction) {
    var array = this.indexArray
    if (direction === 'left') {
        array.push(array.shift())
    } else {
        array.unshift(array.pop())
    }
    this.handleMove(direction)
    this.onSwitch(this.getIndex())
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

    change.forEach(function (value, index) {
        var speed = (value === noSpeedIndex || _delta !== 0) ? 0 : this.speed
        setStyle(this.items[value], transform[index], speed)
    }.bind(this))
    
    /* 元素个数大于3 并且非手动情况下，处理第四个元素的隐藏 */
    if (indexArray.length && _delta === 0) {
        var hideIndex = direction === 'left' ? indexArray.pop() : indexArray.shift()
        setStyle(this.items[hideIndex], this.hideTransform, 0)
    }
}

Carousel.prototype.getTransform = function (delta) {
    var resp = [
        'translate(' + delta + 'px, 0px) translateZ(0px)',
        'translate(' + (this.offset + delta) + 'px, 0px) translateZ(0px)',
        'translate(' + (-this.offset + delta) + 'px, 0px) translateZ(0px)'
    ]
    return resp
}

Carousel.prototype.init = function () {
    this.offset = getOffset(this.root)
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

Carousel.prototype.fill = function (items) {
    this.__fill = true
    var node1 = items[0]
    var node2 = items[1]
    var cloneNode1 = node1.cloneNode(true)
    var cloneNode2 = node2.cloneNode(true)
    this.itemWrap.appendChild(cloneNode1)
    this.itemWrap.appendChild(cloneNode2)
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

module.exports = Carousel
