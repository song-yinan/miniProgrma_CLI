# 小程序脚手架
## 主要功能
  + 解决单个项目，多个环境对多个小程序切换的问题
  + 后续会支持sass开发，压缩和混淆代码，以及通用小组件
  + 如果此脚手架不满足需求，欢迎各位提到Issues
## 项目
    git clone https://github.com/nanxiaodi/miniProgrma_CLI.git
    cnpm install 
    在src目录下分别有 project.dev.config.json project.prod.config.json project.uat.config.json 分别对应开发，生产，uat小程序 project.config.json配置
    gulp build --env dev (此命令用于开发，生成devDist,加入了热更新功能)
    gulp build --env prod (此命令用于打包生产包，生成prodDist目录，无热更新功能)
    gulp build --env uat (此命令用于打包uat包，生成uatDist目录，无热更新功能)
