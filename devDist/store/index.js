import Store from '../utils/store.js';
export default new Store({
  state: {
    //以下为自定义的全局状态，用法和页面中的data: {...} 一致。
    user: {
      name: 'Leisure'
    },
    counter: 0
  },
  methods: {
    goAnyWhere(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
  },
  pageLisener: {
    onLoad(options) {
      console.log('我在' + this.route, '参数为', options);
    },
    onHide() {
      console.log('lalala')
    }
  },
  //开启了局部模式
  openPart: true
})