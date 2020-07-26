const { spawn } = require('child_process');
const { curry, is } = require('ramda');

module.exports.wrapUploadVideo = curry(
  (cmd, args, data) => {
    return new Promise((resolve, reject) => {
      console.info('[Uplaod Video] Spawning', { cmd, args });

      const child = spawn(cmd, args, {
        cwd: process.cwd(),
        env: process.env
      });

      const logProgress = (chunk) => {
        let chunkString;
        if (is(Buffer, chunk)) {
          chunkString = chunk.toString();
        } else if (typeof chunk === 'string') {
          chunkString = chunk;
        }

        console.info(`[Upload Video] ${chunkString || chunk}`, {});
      };

      child.stdout.on('data', logProgress);
      child.stderr.on('data', logProgress);

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.error('[Upload Video] Failed', { code });
          reject(new Error(`upload_video.py closed with code ${code}`));
        }
      });

      child.stdin.setEncoding('utf-8');
      child.stdin.write(data);
      child.stdin.end();
    });
  }
);
