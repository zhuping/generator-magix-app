var mat   = require('mat')
var rap   = require('mat-rap')
var proxy = require('mat-proxy')
var less  = require('mat-less')

// 预编译less
mat.task('less', function () {
  mat.url([/.*\.css/])
    .rewrite([
      [/\.css/g, '.less']
    ])
    .use(less({sourceMap: {sourceMapFileInline: true}}))
})

// mock数据
mat.task('default', ['less'], function () {
  mat.url([/api/])
    .use(rap({
      projectId: '1038'
    }))
})

// daily反向代理
mat.task('daily', ['less'], function () {
  mat.url([/api/])
    .use(proxy({
      proxyPass: '127.0.0.1:8080'
    }))
})