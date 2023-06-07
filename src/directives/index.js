// 负责管理所有的自定义指令
export const imageError = {
  inserted(dom, options) {
    dom.onerror = function() {
      dom.src = options.value
    }
  }
}
