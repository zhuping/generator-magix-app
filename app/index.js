'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

var MagixAppGenerator = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
  },
  initializing: function() {
    this.pkg = require('../package.json');
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
    this.description = '';
    this.repository = '';
    this.author = '';
    this.license = 'ISC';

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'application name',
      default: this.name
    }, {
      type: 'input',
      name: 'description',
      message: 'application description',
      default: this.description
    }, {
      type: 'input',
      name: 'version',
      message: 'version',
      default: '0.0.1'
    }, {
      type: 'input',
      name: 'repo',
      message: 'git repository',
      default: this.repository
    }, {
      type: 'input',
      name: 'license',
      message: 'license:',
      default: this.license
    }, {
      type: 'input',
      name: 'author',
      message: 'author:',
      default: this.author
    }];

    this.prompt(prompts, function(props) {
      this.name = props.name;
      this.pkgName = props.name;
      this.version = props.version;
      this.repo = props.repo;
      this.license = props.license;
      this.author = props.author;
      this.description = props.description;

      done(); //进入下一个生命周期阶段
    }.bind(this));
  },
  writing: { //生成目录结构阶段
    app: function() {
      //默认源目录就是生成器的templates目录，目标目录就是执行`yo example`时所处的目录。调用this.template用Underscore模板语法去填充模板文件
      this.template('package.json', 'package.json');

      this.fs.copy(
        this.templatePath('gulpfile.js'),
        this.destinationPath('gulpfile.js')
      );
      this.fs.copy(
        this.templatePath('matfile.js'),
        this.destinationPath('matfile.js')
      );
      this.fs.copy(
        this.templatePath('.gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('.jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('index.html'),
        this.destinationPath('index.html')
      );
      this.fs.copy(
        this.templatePath('README.md'),
        this.destinationPath('README.md')
      );
      this.fs.copy(
        this.templatePath('app'),
        this.destinationPath('app')
      );
    }
  },
  install: function() {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });

    this.on('end', function () {   
      this.log(yosay(
        'Yeah! You\'re all set and done!' +
        ' Now simply run ' + chalk.green.italic('gulp') + ' and start coding!'
      ));
      this.spawnCommand('gulp');
    });
  }
});
module.exports = MagixAppGenerator;