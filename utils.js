var fs = require('fs');
const { execSync } = require('child_process');
var http = require('http');
var path = require('path')

function isDir(path) {
  try {
    var stat = fs.lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

function getFileSizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

function getFileExtension(file) {
  return path.extname(file)
}

function download(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  });
}

function traverseDir(dir, cb) {
  if (isDir(dir)) {
    fs.readdirSync(dir).forEach(file => {
      traverseDir(dir + "/" + file, cb)
    });
  } else {
    cb(dir)
  }
}

function executeShell(command, log) {
  console.log(command)
  try {
    execSync(command, (err, stdout, stderr) => {
      if (err) {
        console.log("execute " + command + " failed!");
        return;
      }
      if (log) {
        console.log(`stdout:\n ${stdout}`);
        console.log(`stderr:\n ${stderr}`);
      }
    })
  }
  catch (error) {
    console.log("execute " + command + " failed!")
  }
}

function jsonToObject(file) {
  var data = fs.readFileSync(file, 'utf8');
  return JSON.parse(data);
}

function objectToJson(object, file) {
  let data = JSON.stringify(object, null, 2);
  fs.writeFileSync(file, data);
}

function unzip(zipFile, dstDir) {
  executeShell("ditto -x -k --sequesterRsrc --rsrc " + zipFile + " " + dstDir)
}

module.exports.isDir = isDir;
module.exports.getFileSizeInBytes = getFileSizeInBytes;
module.exports.download = download;
module.exports.traverseDir = traverseDir;
module.exports.executeShell = executeShell;
module.exports.getFileExtension = getFileExtension;
module.exports.jsonToObject = jsonToObject;
module.exports.objectToJson = objectToJson;
module.exports.unzip = unzip;