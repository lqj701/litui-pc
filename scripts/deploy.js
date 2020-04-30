/* eslint-disable no-undef */
/* eslint no-console: 0 */
const fse = require('fs-extra');
const path = require('path');
const colors = require('colors');
const { execSync } = require('child_process');
const https = require('https');

class WebpackDeploy {
  constructor() {
    this.project = 'litui-pc';
    this.server = process.argv[2] || 'dev';
    this.serverConfig = require(path.resolve(`./config/servers/${this.server}.config`));
    this.distPath = path.resolve(`./dist`);
    this.tarName = `${this.project}.tar.gz`;
    this.tarPath = `${this.distPath}/${this.tarName}`;
    this.uploadTo = `/tmp/${this.tarName}`;
    this.deployScript = `${this.distPath}/deploy.sh`;

    process.env.SERVER_ENV = this.server;
    process.env.NODE_ENV = 'production';
  }

  run() {
    this.removeDistFolder();
    this.build();
    this.generateRemoteScript();
    this.pack();
    this.upload();
    this.deploy();
    this.notify();
  }

  removeDistFolder() {
    console.log(colors.green(`Remove dist folder!\n`));
    fse.removeSync(this.distPath);
  }

  build() {
    execSync('webpack --progress', { stdio: 'inherit' });
  }

  generateRemoteScript() {
    let remoteScript = `NOW=$(date +"%Y%m%d%H%M%S")
PROJECT_PUBLIC_PATH="${this.serverConfig.projectPublicPath}"
RELEASES_PATH="${this.serverConfig.deployTo}/ikd_releases/${this.project}"
TAR_PATH="${this.uploadTo}"
TAR_EXTRACT_PATH="/tmp/${this.project}"
TMP_ASSETS_PATH="$TAR_EXTRACT_PATH${this.serverConfig.buildPath}"
RELEASE_ASSETS_PATH="$RELEASES_PATH/$NOW"
PUBLIC_ASSETS_PATH="$PROJECT_PUBLIC_PATH/${this.serverConfig.buildPath.replace(/\//g, '')}"

if [ -d "$TAR_EXTRACT_PATH" ]; then
  rm -rf $TAR_EXTRACT_PATH
fi
mkdir -p $TAR_EXTRACT_PATH

tar -xvzf $TAR_PATH -C $TAR_EXTRACT_PATH

if [ ! -d "$RELEASES_PATH" ]; then
  mkdir -p $RELEASES_PATH
fi

mv $TMP_ASSETS_PATH $RELEASE_ASSETS_PATH

if [ -d "$PUBLIC_ASSETS_PATH" ]; then
  rm -rf $PUBLIC_ASSETS_PATH
fi
cp -rf $RELEASE_ASSETS_PATH $PUBLIC_ASSETS_PATH

RELEASES_DIRS=($RELEASES_PATH/*/)
KEEP_DIRS_IDX=\`expr \${#RELEASES_DIRS[@]} - 5\`

for (( idx=\${#RELEASES_DIRS[@]}-1 ; idx>=0 ; idx-- )) ; do
  if [ "$idx" -lt "$KEEP_DIRS_IDX" ]; then
    if [[ \${RELEASES_DIRS[idx]} == *"$RELEASES_PATH"* ]]; then
      rm -rf \${RELEASES_DIRS[idx]}
    fi
  fi
done
    `;

    if (this.serverConfig.afterExec) {
      this.serverConfig.afterExec.forEach((cmd) => {
        remoteScript += `\n${cmd}`;
      });
    }

    fse.writeFileSync(this.deployScript, remoteScript);
  }

  pack() {
    console.log(colors.green(`Pack ${this.project}!\n`));
    const buildPath = this.serverConfig.buildPath.replace(/\//g, '');
    execSync(`tar -czvf ${this.tarPath} -C ./dist ${buildPath}`, { stdio: 'inherit' });
  }

  upload() {
    this.serverConfig.servers.forEach(s => {
      console.log(colors.green(`Upload ${this.project} to ${s.name}!\n`));
      execSync(`scp -P ${s.port} ${this.tarPath} ${s.username}@${s.host}:${this.uploadTo}`, { stdio: 'inherit' });
    });
  }

  deploy() {
    this.serverConfig.servers.forEach(s => {
      console.log(colors.green(`Deploy ${this.project} to ${s.name}!\n`));
      execSync(`ssh -p ${s.port} ${s.username}@${s.host} "bash -s" < ${this.deployScript}`, { stdio: 'inherit' });
    });
  }

  notify() {
    const gitUserInfo = this.getGitUserInfo();
    const gitCurrentBranch = this.getGitCurrentBranch();

    const postData = JSON.stringify({
      msgtype: 'markdown',
      markdown: {
        title: `${gitUserInfo.name}部署了 ${this.project} 项目的 ${this.server} 环境`,
        text: [
          `#### 【${gitUserInfo.name}】部署了【${this.project}】项目的【${gitCurrentBranch}】分支到【${this.server}】环境\n`,
          `> ${this.getGitLastCommitInfo()}`,
        ].join(''),
      },
    });

    const opts = {
      hostname: 'oapi.dingtalk.com',
      path: '/robot/send?access_token=67195d151a082858ca6d771a9d9af94c555c22a9c46a5ab57e32c3a772db1544',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(opts);
    req.write(postData);
    req.end();

    console.log(colors.green('Deploy Completed!\n'));
  }

  getGitUserInfo() {
    const output = execSync('git config -l |grep user', { encoding: 'UTF-8' });
    const lines = output.split('\n');
    return { name: lines[0].split('=')[1], email: lines[1].split('=')[1] };
  }

  getGitCurrentBranch() {
    const output = execSync('git branch | grep \\*', { encoding: 'UTF-8' });
    return output.split(' ')[1].replace('\n', '');
  }

  getGitLastCommitInfo() {
    return execSync('git log -1 | cat', { encoding: 'UTF-8' });
  }
}

new WebpackDeploy().run();
