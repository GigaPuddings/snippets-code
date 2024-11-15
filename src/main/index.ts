import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import './ipc'
import './db'
import './previewWindow'
import createTray from './tray'
import './shortCut'
import { getByNameWindow } from './windows'
import { getInstalledApps } from './getApps'

import config from './config'
// import { autoUpdateInit } from './autoUpdater'
import { dbPath } from './db/connect'

//当 Electron 完成时将调用此方法
//初始化并准备创建浏览器窗口。
//有些API只有在该事件发生后才能使用。
app.whenReady().then(async () => {
  // 创建第一个初始搜索窗口
  const win = getByNameWindow('search')

  // 通知显示窗口
  win.on('show', () => {
    win.webContents.send('on-window-show')
  })

  // 页面完成加载后
  win.webContents.on('did-finish-load', () => {
    // db数据获取失败
    if (config.hasShownError) {
      config.hasShownError = false
      // 更新前端数据库路径
      win.webContents.send('update-databaseDirectory', dbPath)
    }

    // 显示窗口
    win.show()
  })

  // 托盘图标
  createTray()

  // 版本更新初始化
  // autoUpdateInit()

  // config.apps = await getInstalledApps() as Array<any>

  // D:\Program Files\ScreenToGif\ScreenToGif.exe
  // 获取系统已安装程序
  const allApp = (await getInstalledApps()) as Array<any>
  // logger.info(allApp)
  //  && !app.appIdentifier.startsWith('{')
  // config.apps = allApp
  // 筛选可调用App
  config.apps = allApp.filter((app) => app.DisplayIcon)

  // 检查更新
  // autoUpdateApp(win)

  // registerAppGlobShortcut()

  //设置 Windows 的应用程序用户模型 ID
  electronApp.setAppUserModelId('com.example.snippets-code')

  // 窗口显示防抖优化
  if (process.platform == 'win32') app.commandLine.appendSwitch('wm-window-animations-disabled')

  //开发中默认按F12打开或关闭DevTools
  //并在生产中忽略 CommandOrControl + R。
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  //隐藏苹果dock图标
  if (process.platform == 'darwin') app.dock.hide()

  //IPC测试
  ipcMain.on('ping', () => console.log('pong'))

  app.on('activate', function () {
    //在 macOS 上，通常会在应用程序中重新创建一个窗口
    //单击停靠图标并且没有打开其他窗口。
    if (BrowserWindow.getAllWindows().length === 0) getByNameWindow('search')
  })
})

//当所有窗口都关闭时退出（macOS 除外）。在那里，很常见
//应用程序及其菜单栏保持活动状态直到用户退出
//显式使用 Cmd + Q。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
