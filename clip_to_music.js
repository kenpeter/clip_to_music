// search
const glob = require('glob');
// wait for
const Promise = require('bluebird');
// fs
const fs = require('fs');
// mp3
const ffmpeg = require('fluent-ffmpeg');

// video source file path
const videoPath = '/home/kenpeter/Videos/4K\ Video\ Downloader';

// audio source file path
const audioPath = __dirname + "/audio";

// child process, exec
const exec = require('child_process').exec;

// now rename promise
function renamePromise() { return new Promise((resolve, reject) => {
  glob(videoPath + "/**/*.mp4", (er, files) => {
      Promise.each(files, (singleClipFile) => {
        return new Promise((resolve1, reject1) => {
          let arr = singleClipFile.split("/");
          let lastElement = arr[arr.length - 1];
          let tmpFileName = lastElement.replace(/[&\/\\#,+()$~%'":*?<>{}\ ]/g, "_");
          let tmpFullFile = videoPath + "/"+ tmpFileName;

          // rename it
          fs.rename(singleClipFile, tmpFullFile, function(err) {
            if ( err ) console.log('ERROR: ' + err);

            console.log("-- Rename one file --");
            console.log(tmpFullFile);
            resolve1();
          }); // end rename
        });
      })
      .then(() => {
        console.log('--- rename all files done ---');
        resolve();
      });
    });

  }); // end promise
};


// music promise
function musicPromise() { return new Promise((resolve, reject) => {
    glob(videoPath + "/**/*.mp4", (er, files) => {
      Promise.each(files, (singleClipFile) => {
        return new Promise((resolve1, reject1) => {
          // test
          console.log('-- music promise --');
          console.log(singleClipFile);

          // split
          let arr = singleClipFile.split("/");

          // e.g. xxxx.mp4
          let clipFile = arr[arr.length - 1];

          // e.g. xxxx no mp4
          let fileName = clipFile.replace(/\.[^/.]+$/, "");

          // music file name
          let musicFile = fileName + '.mp3';

          //
          ffmpeg(singleClipFile)
            .setFfmpegPath('/usr/bin/ffmpeg')
            .output("./audio/" + musicFile)
            .on('error', function(err) {
              console.log('An error occurred: ' + err.message);
            })
            .on('end', function() {
              console.log('Processing finished !');

              // .............
              resolve1();
            })
            .run();

        });
      })
      .then(() => {
        console.log('--------- all mp3 conversion done --------');
        resolve();
      });

    }); // end glob
  });
};

// adb kill
function adbKillPromise() { return new Promise((resolve, reject) => {
  exec("adb kill-server", (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(stdout);
      console.log('---adb kill---');
      resolve();
    });
  });
};

// adb start
function adbStartPromise() { return new Promise((resolve, reject) => {
    exec("adb start-server", (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(stdout);
      console.log('---adb start---');
      resolve();
    });
  });
};

// adb push promise
function adbPushPromise() { return new Promise((resolve, reject) => {
  glob(audioPath + "/**/*.mp3", (er, files) => {
      Promise.each(files, (singleMusicFile) => {
        return new Promise((resolve1, reject1) => {
          let cmd = "adb push" + " " + singleMusicFile + " " + "/sdcard/Music";
          exec(cmd, (err, stdout, stderr) => {
            console.log(cmd);
            resolve1();
          });
        });
      })
      .then(() => {
        console.log('---- done push all music ---');
        resolve();
      });

    });
  });
};

// Run !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
renamePromise()
  .then(() => {
    return musicPromise();
  })
  .then(() => {
    return adbKillPromise();
  })
  .then(() => {
    return adbStartPromise();
  })
  .then(() => {
    return adbPushPromise();
  })
  .then(() => {
    console.log('---- all done----');
    process.exit(0);
  })
  .catch(err => {
    console.log('Error', err);
    process.exit(1);
  });
