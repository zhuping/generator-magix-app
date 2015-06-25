'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

var MagixAppGenerator = yeoman.generators.Base.extend({
  constructor: function() {

  },
  initializing: function() {

  },
  prompting: function() {
    //接受用户输入
    //当处理完用户输入需要进入下一个生命周期阶段时必须调用这个方法
    var done = this.async();

    this.log(yosay(
      chalk.red('Welcome!') + '\n' +
      chalk.yellow('You\'re using the generator for scaffolding an application with Magix!')
    ));

    this.name = path.basename(process.cwd());
    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'application name',
      default: this.name
    }, {
      type: 'input',
      name: 'description',
      message: 'application description'
    }, {
      type: 'list',
      name: 'magix',
      message: 'which version of magix',
      choices: [{
        name: 'Magix2.0(requirejs+jQuery版)',
        value: '2.0'
      }, {
        name: 'Magix1.2(Kissy版)',
        value: '1.2'
      }]
    }, {
      type: 'input',
      name: 'repo',
      message: 'git repository'
    }, {
      type: 'input',
      name: 'author',
      message: 'author:'
    }];

    this.prompt(prompts, function(props) {
      this.name = props.name;
      this.pkgName = props.name;
      this.magix = props.magix;
      this.repo = props.repo;
      this.author = props.author;
      this.description = props.description;

      done(); //进入下一个生命周期阶段
    }.bind(this));
  },
  writing: { //生成目录结构阶段
    app: function() {
      //默认源目录就是生成器的templates目录，目标目录就是执行`yo example`时所处的目录。调用this.template用Underscore模板语法去填充模板文件
      this.template('_package.json', 'package.json'); //
      this.template('_gulpfile.js', 'gulpfile.js');
    }
  },

  install: function() {
    var done = this.async();

    this.spawnCommand('cnpm', ['install']) //安装项目依赖
      .on('exit', function(code) {
        if (code) {
          done(new Error('code:' + code));
        } else {
          done();
        }
      })
      .on('error', done);
  },
  end: function() {
    var done = this.async();
    // this.spawnCommand('gulp') //生成器退出前运行gulp，开启watch任务
    //   .on('exit', function(code) {
    //     if (code) {
    //       done(new Error('code:' + code));
    //     } else {
    //       done();
    //     }
    //   })
    //   .on('error', done);
  }
});
module.exports = MagixAppGenerator;