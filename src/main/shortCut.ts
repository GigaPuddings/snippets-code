import { app, dialog, globalShortcut, ipcMain, IpcMainInvokeEvent } from 'electron'
import { getByNameWindow } from './windows'
import config from './config'
import { is } from '@electron-toolkit/utils'
import { getLocalData } from './helper'

// 注册快捷键
ipcMain.on('shortCut', (_event: IpcMainInvokeEvent, shortCut: ShortCutType, type?: ShortCutTypeTarget) => {
  if (Array.isArray(shortCut)) {
    shortCut.forEach(item => {
      registerSearchShortCut(item.hotkey, item.type)
    })
  } else if(typeof shortCut === 'string' && type) {
    registerSearchShortCut(shortCut, type)
  }
})

export function registerSearchShortCut(shortCut: string, type: ShortCutTypeTarget) {
  if (shortCut && globalShortcut.isRegistered(shortCut) && !getLocalData('isFirstStart')) {
    !is.dev && dialog.showErrorBox('温馨提示', '快捷键注册失败, 请检查快捷键是否已禁用')
    return false
  }

  console.log(`${type}需要注册快捷鍵${shortCut}`)

   // 注销之前绑定的的快捷键
  if (config.shortCut[type]) {
    globalShortcut.unregister(config.shortCut[type])
  }
  // 存储最新快捷键
  config.shortCut[type] = shortCut

  // 注册快捷键监听器
  return globalShortcut.register(shortCut, () => {
    const win = getByNameWindow(type)
    if (win && win.isVisible()) {
      // getByNameWindow('preview').hide()
      win.hide()
    } else {
      win.show()
      // win.webContents.send('windowShow')
    }

    // win.isVisible() ? win.hide() : win.show();
  })
}

app.on('will-quit', () => {
  // 注销所有快捷键
  globalShortcut.unregisterAll()
})
