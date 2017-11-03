# carousel

移动端网站首页几乎都会用到的图片轮播组件。
组件使用了 `touchstart` 和 touchend` 事件，所以仅适用于移动端

## 用法

ES6
 ```js
 import Carousel from 'Carousel'

 var c = new Carousel({
    root: 'component-carousel',
    speed: 300, /* 可选参数，表示滑动速度，默认 300，单位 ms */
    interval: 3000, /* 可选参数，表示定时器间隔，不传则不开启定时器，单位 ms */
    onSwitch: function (currentIndex) { /* 可选参数，切换回调，返回切换后index */
        console.log(currentIndex)
    } 
 })

 ```

要求 `#root` 是以下结构：  

```html

<div id="component-carousel">
    <ul>
        <li><img src="xxx"></li><!-- 元素个数 >= 1, 1时不播放，2时自动补足成4个以便于切换 -->
        <li><img src="xxx"></li>
        <li><img src="xxx"></li>
        <li><img src="xxx"></li>
        <li><img src="xxx"></li>
    </ul>
</div>
```

**具体可以查看：**
[DEMO](https://juzhikan.github.io/carousel/index.html)
