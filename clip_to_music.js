// search
const glob = require('glob');
// wait for
const Promise = require('bluebird');
const fs = require('fs');

// file path
const videoPath = '/home/kenpeter/Videos/4K\ Video\ Downloader';

// now rename promise
let renamePromise = new Promise((resolve, reject) => {
  // search all mp4
  glob(videoPath + "/**/*.mp4", function (er, files) {
    // map each file
    files.map(function(singleFile){
      // build tmp name
      let arr = singleFile.split("/");
      let lastElement = arr[arr.length - 1];
      let tmpFileName = lastElement.replace(/[&\/\\#,+()$~%'":*?<>{}\ ]/g, "_");
      let tmpFullFile = videoPath + "/"+ tmpFileName;

      // rename it
      fs.rename(singleFile, tmpFullFile, function(err) {
        if ( err ) console.log('ERROR: ' + err);

        console.log("-- Rename one file --");
        console.log(tmpFullFile);
        resolve();
      }); // end rename
    }); // end map
  }); // end glob
}); // end promise

renamePromise.then(() => {
  console.log('--- all done ---');
  process.exit(0);
});
