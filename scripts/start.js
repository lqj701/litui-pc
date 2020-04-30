/* eslint no-console: 0 */
const { spawn } = require('child_process');

class WebpackStart {
  constructor() {
    process.env.SERVER_ENV = 'local';
    process.env.NODE_ENV = 'development';
  }

  run() {
    spawn('webpack-dev-server', ['--progress', '--compress'], { stdio: 'inherit' });
  }
}

new WebpackStart().run();



