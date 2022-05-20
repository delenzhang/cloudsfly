export default class MouseControl {
  evt: any
  timer: any
  dom: any
  fps = 6
  interval = 0
  maxInterval = 1000
  maxDeltaY = 24
  deltaStep = 0.1
  init() {
    this.evt = document.createEvent('MouseEvents');
    this.evt.initEvent('wheel', true, true);
    this.dom = document.querySelector('.cesium-widget')?.children[0]
    cancelAnimationFrame(this.timer)
    const self = this
    let lastTime = +new Date()

    function anim() {
      self.timer = requestAnimationFrame(() => {
        const now = new Date().getTime()
        const delta = now - lastTime
        if (delta > 1000 / self.fps) {
          anim()
          self.trigger();
        } else {
          lastTime = now
        }
      })
    }
    anim()
  }
  trigger() {
    if (isNaN(this.evt.deltaY)) {
      this.evt.deltaY = this.deltaStep
    }
    if (this.interval < this.maxInterval ) {
      this.interval++
      return
    }

    if (this.evt.deltaY > this.maxDeltaY) {
      this.deltaStep = -this.deltaStep
      this.interval = 0
    } else if(this.evt.deltaY <= -this.maxDeltaY) {
      this.deltaStep = -this.deltaStep
      this.interval = 0
    }
    this.evt.deltaY += this.deltaStep
    this.dom.dispatchEvent(this.evt);
  }
}