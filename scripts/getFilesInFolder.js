var fs = require("fs");
var path = require("path");

// Utility function that collects the stats of every file in a directory
// as well as in its subdirectories.
function getFilesInFolder(folderName, fileList) {

  if ('/Volumes/proton/work/f8app/android/app/build/intermediates/res/merged/debug' === folderName) {
    folderName = '/Volumes/proton/work/f8app/android/app/build/intermediates/res/debug'
  }

    var folderFiles = fs.readdirSync(folderName);
    folderFiles.forEach(function(file) {
        var fileStats = fs.statSync(path.join(folderName, file));
        if (fileStats.isDirectory()) {
            getFilesInFolder(path.join(folderName, file), fileList);
        } else {
            fileStats.path = path.join(folderName, file);
            fileList.push(fileStats);
        }
    });
}

module.exports = getFilesInFolder;
