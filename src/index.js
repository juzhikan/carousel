import Carousel from './carousel'

var c = new Carousel({
    root: 'component-carousel',
    speed: 300
})

document.querySelector('button').onclick = function () {
    c.move('left')
}