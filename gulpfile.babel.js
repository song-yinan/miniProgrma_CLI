const path = require('path')
var fs = require('fs');
// import babel from 'gulp-babel'
// import sass from 'gulp-sass'
// import uglify from 'gulp-uglify'
// import cleanCSS from 'gulp-clean-css'
const rename = require('gulp-rename')
// import postcss from 'gulp-postcss'
const del = require('del')
const gulp = require('gulp')
// const chokidar = require('chokidar');
const replace = require('gulp-replace')
const minimist = require('minimist')
const watch = require("gulp-watch");
// import imagemin from 'gulp-imagemin'
// import qiniu from 'gulp-qiniu'
// import gulpif from 'gulp-if'
const gutil = require('gulp-util')
// import replace from 'gulp-replace'
// import newer from 'gulp-newer'
// import cache from 'gulp-cached'
// import debug from 'gulp-debug'
// import pxtorpx from 'postcss-px2rpx'
// import argv from 'yargs'

let outputPath = path.join(__dirname, 'dist/')
let outputFileName = 'DevDist'
let configPath = path.join(__dirname, 'dist/config')
// const copyFile = ['!node_modules/']
const paths = {
  // styles: {
  // 	src: ['src/**/*.scss'],
  // 	dest: outputPath
  // },
  // images: {
  // 	src: 'src/assets/images/**/*.{png,jpg,jpeg,svg,gif}',
  // 	dest: outputPath
  // },
  // scripts: {
  // 	src: 'src/**/*.js',
  // 	dest: outputPath
  // },
  node_modules: {
    src: ['src/node_modules/**'],
    dest: outputPath
  },
  copy: {
    src: ['src/**', '!src/project.dev.config.json', '!src/config/**'],
    dest: outputPath
  },

}


let knownOptions = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'production'
  }
};

const config = minimist(process.argv.slice(2), knownOptions);
// 更新环境
const switchENV = (cb) => {
  // 更新node_modules包
  // gulp
  // 	.src(paths.node_modeles.src, { base: 'src' })
  //   .pipe(gulp.dest(paths.node_modeles.dest))
  console.log('环境', config.env)
  // 更新环境变量
  let projectJsonName = 'project.dev.config.json';
  let configjsName = ''
  if (config.env == 'prod') {
    outputFileName = 'prodDist'
    outputPath = path.join(__dirname, 'prodDist/')
    configjsName = '_config_prod.js'
    projectJsonName = 'project.prod.config.json'
    configPath = path.join(__dirname, 'prodDist/config')
  } else if (config.env == 'dev') {
    outputFileName = 'devDist'
    outputPath = path.join(__dirname, 'devDist/')
    configjsName = '_config_dev.js'
    projectJsonName = 'project.dev.config.json'
    configPath = path.join(__dirname, 'devDist/config')
  } else if (config.env == 'uat') {
    outputFileName = 'uatDist'
    outputPath = path.join(__dirname, 'uatDist/')
    projectJsonName = 'project.uat.config.json'
    configPath = path.join(__dirname, 'uatDist/config')
  } else {
    outputFileName = 'prodDist'
    utputPath = path.join(__dirname, 'prodDist/')
    configjsName = '_config_prod.js'
    projectJsonName = 'project.prod.config.json'
    configPath = path.join(__dirname, 'prodDist/config')
  }
  console.log(outputPath)

  gulp
    .src([`src/${projectJsonName}`], {
      base: 'src'
    })
    .pipe(rename('project.config.json'))
    .pipe(gulp.dest(outputPath))
  gulp
    .src([`src/config/${configjsName}`], {
      base: 'src'
    })
    .pipe(rename('index.js'))
    .pipe(gulp.dest(configPath))
  cb()
}

// 清理打包目录
const clean = (cb) => {
  del([outputPath])
  cb()
}

// 复制目录
const copy = (oldPath,newPath) => {
//  console.log(oldPath,'参数')
  gulp
    .src(oldPath)
    .pipe(gulp.dest(newPath))
  // if(cd) {
  //   cd()
  // }
}

function mkdirs(dirname, mode, callback){
  fs.exists(dirname, function (exists){
      if(exists){
          callback();
      }else{
          //console.log(path.dirname(dirname));
          mkdirs(path.dirname(dirname), mode, function (){
              fs.mkdir(dirname, mode, callback);
          });
      }
  });
}
const watchFiles = (e) => {
  console.log('执行监听')
  watch(['src/**'], function (e) {
    
    let oldPath = e.history;
    let newDirPath = [];
    for (var i = 0; i <= oldPath.length - 1; i++) {
      // console.log(oldPath[i])
      var newDirPathTemp = oldPath[i].replace(/\\/g, "/");
      var currentPath = newDirPathTemp.replace(/src/g,outputFileName);
      // console.log(newDirPathTemp,currentPath)
    //修改或增加时
    if ('add' == e.event || 'change' == e.event || 'rename' == e.event) {
      // 判断目录是否存在，不存在则创建
      fs.exists(currentPath, function (exists) {
        if (exists) {
          console.log(currentPath,"文件夹存在");
          currentPath = currentPath.split('/');
          currentPath.pop()
          currentPath = currentPath.join('/')+'/'
          copy(newDirPathTemp,currentPath);
        } else {
          //console.log("文件夹不存在，则创建目录");
          mkdirs(currentPath);
          // 延时，等待目录创建完成
          setTimeout(function () {
            copy(newDirPathTemp,currentPath);
          }, 200);
        }
      });
    } else if ('deleted' == e.type) { //删除
      fs.unlink(newPath, function (err) {
        console.log('删除' + newPath + err);
      });
    }
    }
    
   
  })
}

const build = (cb) => {
  if (config.env == 'dev') {
    watchFiles()
  }
  gulp
    .src(paths.copy.src, {
      base: 'src'
    })
    .pipe(gulp.dest(outputPath))
  cb()
}


// exports.default = build; // 运行打包构建程序
exports.build = gulp.series(clean, switchENV, build);