import { BrowserWindow, Menu, Tray } from 'electron'
import * as path from 'path'
import { getByNameWindow } from './windows'
const createTray = () => {
  const tray = new Tray(
    path.resolve(
      __dirname,
      process.platform == 'darwin'
        ? '../../resources/macTrayTemplate@2x.png' //32x32 像素的图片
        : '../../resources/windowTray.png' //可以使用彩色图片，图标的最大大小为 256x256 像素，设置为32x32像素即可
    )
  )

  // 显示主窗口
  const showMainWindows = (): void => {
    const win: BrowserWindow = getByNameWindow('config')
    if (!win.isVisible() && !win.webContents.isLoading()) {
      win.setAlwaysOnTop(true)
      win.show()
    } else {
      win.minimize()
    }
    win.webContents.on('did-finish-load', () => {
      win.show()
    })
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '搜索框',
      click: () => getByNameWindow('search').show()
    },
    // 这里希望跳转哈希路由 /#config
    {
      label: '主窗口',
      click: () => showMainWindows()
    },
    {
      type: 'separator'
    },
    {
      label: '设置',
      click: () => {
        const win = getByNameWindow('setting')
        win.webContents.on('did-finish-load', () => {
          win.show()
        })
      }
    },
    { label: '退出', role: 'quit' }
  ])
  tray.setToolTip('snippets code')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => showMainWindows())
}

export default createTray
