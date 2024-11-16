import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import { winConfig, getByNameWindow } from './windows'

let previewWindow: BrowserWindow | null = null

ipcMain.on(
  'show-preview-window',
  (_event: IpcMainEvent, item?: Pick<ContentType, 'title' | 'content'>, _index?: number) => {
    // 获取主窗口(Search)
    const mainWindow = BrowserWindow.fromId(winConfig['search'].id)!
    const [mainWidth] = mainWindow.getSize()
    const [mainX, mainY] = mainWindow.getPosition()

    // 计算相对于主窗口的子窗口位置
    const previewWindow_X = mainWidth + mainX + 10
    const previewWindow_Y = mainY - 10

    // 如果窗口已经存在且未被销毁，直接更新内容
    if (previewWindow && !previewWindow.isDestroyed()) {
      if (!previewWindow.isVisible()) {
        previewWindow!.setPosition(previewWindow_X, previewWindow_Y)
        previewWindow.show()
      }
      item && previewWindow.webContents.send('update-preview-content', item)
      return
    }
    console.log('create child');

    // 如果不存在，则创建新的子窗口
    previewWindow = getByNameWindow('preview', { parent: 'search', model: true })

    // 定义窗口加载完成后的行为
    previewWindow.webContents.once('did-finish-load', () => {
      previewWindow!.setParentWindow(mainWindow)
      previewWindow!.setPosition(previewWindow_X, previewWindow_Y)
      previewWindow!.show()

      // 发送内容数据到子窗口
      item && previewWindow!.webContents.send('update-preview-content', item)
    })

    // 监听子窗口关闭事件，清除引用
    previewWindow.on('closed', () => {
      previewWindow = null
    })
  }
)

ipcMain.on('hide-preview-window', () => {
  if (previewWindow && previewWindow.isVisible()) {
    previewWindow.hide()
  }
})
