import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import { winConfig, getByNameWindow } from './windows'

let previewWindow: BrowserWindow | null = null

ipcMain.on(
  'show-preview-window',
  (_event: IpcMainEvent, item: Pick<ContentType, 'title' | 'content'>, index: number) => {

    console.log('index', index);
    // 获取主窗口(Search)
    const mainWindow = BrowserWindow.fromId(winConfig['search'].id)!
    const [mainWidth] = mainWindow.getSize()
    const [mainX, mainY] = mainWindow.getPosition()
    // 获取子窗口
    previewWindow = getByNameWindow('preview', { parent: 'search', model: true })
    // 子窗口设置父窗口
    previewWindow.setParentWindow(mainWindow)

    // 定义 子窗口 x,y 位置
    let previewWindow_X = 0
    let previewWindow_Y = 0


    // 计算相对于主窗口的子窗口位置
    if (index && !previewWindow.webContents.isLoading()) {
      // 设置在主窗口(Search)右侧显示预览代码片段(Preview)
      previewWindow_X = mainWidth + mainX + 10
      // previewWindow_Y = index > 5 ? mainY + 44 * 5 : mainY + 44 * index
      previewWindow_Y = mainY

      previewWindow.setPosition(previewWindow_X, previewWindow_Y)
      previewWindow.show()

      // 向子窗口发送内容数据
      previewWindow.webContents.send('update-preview-content', item)
    } else {
      previewWindow.hide()
    }
  }
)

ipcMain.on('hide-preview-window', () => {
  if (previewWindow && previewWindow.isVisible()) {
    previewWindow.hide()
  }
})
