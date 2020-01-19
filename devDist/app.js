

import store from './store/index.js'
App({
  onLaunch: function () {

	},
	setWatching: function (key, method) {
    console.log('I am watching now ' + key);
    let obj = this.globalData;
    //加个前缀生成隐藏变量，防止死循环发生
    let ori = obj[key]; //obj[key]这个不能放在Object.defineProperty里

    if (ori) { //处理已经声明的变量，绑定处理
      method(ori);
    }
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        console.log('setting ' + key + '  value ',value);
        this['___' + key] = value;
        method(this[key]); //数据有变化的时候回调函数，实现同步功能
      },
      get: function () {
        console.log('getting ' + key + '  value ');
        
        if (typeof this['___' + key] == 'undefined') {
          if (ori) {
            //这里读取数据的时候隐藏变量和 globalData设置不一样，所以要做同步处理
            this['___' + key] = ori;
            return ori;
          } else {
            return undefined;
          }
        } else {
          console.log('get',this['___' + key])
          return this['___' + key];
        }
      }
    })
  },
  store: store
})
