const path = require('path')
// import babel from 'gulp-babel'
// import sass from 'gulp-sass'
// import uglify from 'gulp-uglify'
// import cleanCSS from 'gulp-clean-css'
const rename = require('gulp-rename')
// import postcss from 'gulp-postcss'
const del = require('del')
const gulp = require('gulp')
const replace = require('gulp-replace')
const minimist = require('minimist')
// import imagemin from 'gulp-imagemin'
// import qiniu from 'gulp-qiniu'
// import gulpif from 'gulp-if'
const  gutil = require('gulp-util') 
// import replace from 'gulp-replace'
// import newer from 'gulp-newer'
// import cache from 'gulp-cached'
// import debug from 'gulp-debug'
// import pxtorpx from 'postcss-px2rpx'
// import argv from 'yargs'

let outputPath = path.join(__dirname, 'dist/')
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
	copy: {
		src: ['src/**', '!src/project.dev.config.json', '!src/icon/fonts/**', '!src/assets/images/**'],
		dest: outputPath
	},

}


let knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'production' }
};

const config = minimist(process.argv.slice(2), knownOptions);
// 更新环境
if(config.env == 'prod') {
  outputPath = path.join(__dirname, 'prodDist/')
  configjsName = '_config_prod.js'
  projectJsonName= 'project.prod.config.json'
  configPath=  path.join(__dirname, 'prodDist/config')

}else if(config.env == 'dev') {
 outputPath = path.join(__dirname, 'devDist/')
 configjsName = '_config_dev.js'
 projectJsonName = 'project.dev.config.json'
 configPath=  path.join(__dirname, 'devDist/config')
}else if(config.env == 'uat') {
 outputPath = path.join(__dirname, 'uatDist/')
 projectJsonName = 'project.uat.config.json'
 projectJsonName = 'project.uat.config.json'
 configPath=  path.join(__dirname, 'uatDist/config')
}else {
 utputPath = path.join(__dirname, 'prodDist/')
  configjsName = '_config_prod.js'
  projectJsonName= 'project.prod.config.json'
  configPath=  path.join(__dirname, 'prodDist/config')
}

// 清理打包目录
const clean = (cb) => {
  del([outputPath])
  cb()
}

// 复制目录
const copy = (cb) => {
  console.log(outputPath)
  gulp
		.src(paths.copy.src, { base: 'src' })
    .pipe(gulp.dest(outputPath))
  if(cb){
    cb()
  }
}
	
const watchFiles = () => {
	gulp.watch(['src/**'],function(){
    console.log('更新代码')
    copy();
  })
}

const build = (cb) => {
  if(config.env == 'dev') {
    watchFiles()
 }
  cb()
}


// exports.default = build; // 运行打包构建程序
exports.build = gulp.series(clean,switchENV,copy,build);


