import { promisify } from 'util'
import { app, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { getWindowByEvent, getByNameWindow } from './windows'
import logger from 'electron-log'
import { exec } from 'child_process'
import config from './config'
import { join } from 'path'

const execAsync = promisify(exec)

logger.transports.console.level = false // 控制台关闭输出（只输出到文件）
logger.transports.file.level = 'silly'
logger.transports.file.maxSize = 1002430 // 文件最大不超过 1M
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
logger.transports.file.resolvePathFn = () => join(app.getPath('logs'), 'auto-update.log') // 在程序的安装目录（生产），或代码根目录（开发）的 log 文件夹下打印日志。
logger.initialize()

// 创建窗体
ipcMain.on('openWindow', (_event: IpcMainInvokeEvent, name: WindowNameType, options?: any) => {
  const win = getByNameWindow(name, options)
  // 窗口是否最小化
  if (!win.isVisible() && !win.webContents.isLoading()) {
    win.setAlwaysOnTop(true)
    win.show()
  }else {
    win.minimize()
  }
  win.webContents.on('did-finish-load', () => {
    win.show()
  })
})
// 隐藏窗体
ipcMain.on('hideWindow', (_event: IpcMainEvent, name: WindowNameType) => {
  getByNameWindow(name).hide()
})
// 鼠标穿透
ipcMain.on(
  'setIgnoreMouseEvents',
  (event: IpcMainEvent, ignore: boolean, options?: { forward: boolean }) => {
    getWindowByEvent(event).setIgnoreMouseEvents(ignore, options)
  }
)
// 窗口最大化
ipcMain.on('maximize-window', (event: IpcMainEvent) => {
  const win = getWindowByEvent(event)
  if (win.isMaximized()) {
    win.restore() // 如果窗口已经最大化，则恢复原始大小
  } else {
    win.maximize() // 否则，最大化窗口
  }
})
//  窗口最小化
ipcMain.on('minimize-window', (event: IpcMainEvent) => {
  getWindowByEvent(event).minimize()
})
// 关闭窗口
ipcMain.on('close-window', (event: IpcMainEvent) => {
  // 注销快捷键
  // const id = BrowserWindow.fromWebContents(event.sender)!.id
  // const name = Object.keys(winConfig).find(key => winConfig[key].id === id)
  // if (name) {
  //   const shortCut = config.shortCut[name]
  //   globalShortcut.unregister(shortCut)
  //   console.log(`注销${name}快捷键`, shortCut);
  // }
  getWindowByEvent(event).close()
})

// 设置窗口置顶
ipcMain.on('set-always-on-top', (event, flag) => {
  const win = getWindowByEvent(event)
  if (win) {
    logger.info(`设置config窗口置顶：${flag}`)
    win.setAlwaysOnTop(flag)
  }
})

// 退出应用
ipcMain.on('window-quit', function () {
  app.quit()
})

// 应用重启
ipcMain.on('window-reset', function () {
  app.relaunch()
  app.exit()
})

// 开机自启
ipcMain.handle('login-item-settings', () => {
  const settings = app.getLoginItemSettings()
  return settings.openAtLogin
})
// 设置开机自启
ipcMain.handle('set-auto-launch', (_event: IpcMainInvokeEvent, enable: boolean) => {
  logger.info(`开机自启：${enable}`)
  const ex = process.execPath
  app.setLoginItemSettings({
    openAtLogin: enable,
    openAsHidden: false,
    path: ex
  })
  return app.getLoginItemSettings().openAtLogin
})

// 搜索应用
ipcMain.handle('search-local-apps', async (_event: IpcMainInvokeEvent, term: string) => {
  try {
    const trimmedTerm = term.trim()

    // 如果输入为空，直接返回空数组
    if (!trimmedTerm) {
      return []
    }

    // 高级模糊查询config.apps
    const filtered = config.apps.filter(app => {
      // 将应用名称和显示图标转为小写
      const lowercaseAppName = app.appName.toLowerCase()
      const lowercaseDisplayIcon = app.DisplayIcon ? app.DisplayIcon.toLowerCase() : ''

      // 使用正则表达式来支持中文和其他字符
      const regex = new RegExp(trimmedTerm.split(/\s+/).join('|'), 'i');

      // 检查搜索词是否在应用名称或显示图标中出现
      return regex.test(lowercaseAppName) || regex.test(lowercaseDisplayIcon);
    })

    // 返回匹配结果
    return filtered.map((b) => ({
      id: b.appName || Math.random(),
      title: b.appName,
      content: b.DisplayIcon,
      category_id: '',
      created_at: '',
      category_name: '',
      searchType: 'window'
    }))
  } catch (error) {
    return error
  }
})

// 打开应用
ipcMain.on('open-app', async (_event: IpcMainEvent, appPath: string) => {
  try {
    const path = appPath.replace(/,(.*)$/g, '').replace(/[\"]/g, '')

    logger.info(`打开第三方应用路径：${path}`)

    // 根据操作系统选择命令
    let command: string
    if (process.platform === 'win32') {
      command = `start "" "${path}"` // Windows
    } else if (process.platform === 'darwin') {
      command = `open "${path}"` // macOS
    } else {
      throw new Error('不支持的操作系统')
    }

    // 执行打开命令
    await execAsync(command)
  } catch (error: any) {
    console.error(`打开应用时出错: ${error.message}`)
  }
})
