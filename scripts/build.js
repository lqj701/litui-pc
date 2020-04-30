/* eslint-disable no-undef */
/* eslint no-console: 0 */
const fse = require('fs-extra');
const path = require('path');
const colors = require('colors');
const { execSync } = require('child_process');

class WebpackBuild {
  constructor() {
    this.server = process.argv[2] || 'dev';
    this.serverConfig = require(path.resolve(`./config/servers/${this.server}.config`));
    this.distPath = path.resolve('./dist');
    this.tarPath = `${this.distPath}/litui-pc.tar.gz`;

    process.env.SERVER_ENV = this.server;
    process.env.NODE_ENV = 'production';
  }

  run() {
    this.removeDistFolder();
    this.build();
    this.pack();
  }

  removeDistFolder() {
    console.log(colors.green(`Remove dist folder!\n`));
    fse.removeSync(this.distPath);
  }

  build() {
    execSync('webpack --progress', { stdio: 'inherit' });
  }

  pack() {
    console.log(colors.green(`Pack project!\n`));
    const buildPath = this.serverConfig.buildPath.replace(/\//g, '');
    execSync(`tar -czvf ${this.tarPath} -C ./dist ${buildPath}`, { stdio: 'inherit' });
  }
}

new WebpackBuild().run();
