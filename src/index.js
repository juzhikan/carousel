import Carousel from './carousel'

var c = new Carousel({
    root: 'component-carousel',
    speed: 300,
    interval: 3000,
    onSwitch: function (currentIndex) {
        console.log(currentIndex)
    }
})