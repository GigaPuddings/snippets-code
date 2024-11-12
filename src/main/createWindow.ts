import { BrowserWindow, BrowserWindowConstructorOptions, shell, screen } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import url from 'node:url'

export interface OptionsType extends Partial<BrowserWindowConstructorOptions> {
  openDevTools?: boolean
  hash?: string
  isHideTaskbar?: boolean
  initShow?: boolean
}

// Create the browser window.
export function createWindow(options: OptionsType): BrowserWindow {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize
  const x = Math.floor((screenWidth - 500) / 2) // 水平居中
  const win = new BrowserWindow({
    width: 500,
    height: 350,
    x,
    show: false,
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // webSecurity: false, //关闭安全策略, 解决跨域问题
      contextIsolation: false, // 可以使用require方法
      nodeIntegration: false //开启true这一步很重要,目的是为了vue文件中可以引入node和electron相关的API
    },
    ...options
  })

  if (is.dev && options.openDevTools) {
    win.webContents.openDevTools()
  }

  // 窗口失去焦点
  win.on('blur', () => {
    // 隐藏搜索窗口
    win.id === 1 && win.hide()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const loadUrl =
    is.dev && process.env['ELECTRON_RENDERER_URL']
      ? `${process.env['ELECTRON_RENDERER_URL']}${options.hash}`
      : url.format({
          pathname: join(__dirname, '../renderer/index.html'),
          protocol: 'file',
          slashes: true,
          hash: options.hash ? options.hash.substring(1) : ''
        })

  win.loadURL(loadUrl)

  return win
}
