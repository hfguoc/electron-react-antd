const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

ipcMain.on('readDir', (event, arg) => {
  console.log('接受渲染进程传参', arg);
  dialog
    .showOpenDialog({
      properties: ['openDirectory']
    })
    .then((result) => {
      if(!result.canceled) {
        result.fileList = loadFilesInDir(result.filePaths[0])
        event.reply('readDir-reply', result)
      }
    })
});

function loadFilesInDir(dir) {
  let fileList = []
  let files = fs.readdirSync(dir)
  for(var i = 0; i<files.length;i++) {
    let filePath = path.join(dir, files[i])
    let fileData = fs.statSync(filePath)
    if(fileData.isFile()) {
      fileList.push(filePath)
    } else {
      fileList = fileList.concat(loadFilesInDir(filePath))
    }
  }
  return fileList
}