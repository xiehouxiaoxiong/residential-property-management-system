class devicePixelRatio {
  getSystem() {
    const agent = navigator.userAgent.toLowerCase();
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (isMac) return false;
    if (agent.indexOf("windows") >= 0) return true;
  }

  addHandler(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  }

  correct() {
    
    document.getElementsByTagName("body")[0].style.zoom =
      1 / window.devicePixelRatio;
  }

  watch() {
    const that = this;
    
    that.addHandler(window, "resize", function () {
      that.correct(); 
    });
  }

  init() {
    const that = this;
    console.log("11111")
   
    if (that.getSystem()) {
      that.correct(); 
      that.watch(); 
    }
  }
}
export default devicePixelRatio;