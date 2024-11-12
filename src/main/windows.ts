import { app, BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { createWindow, OptionsType } from './createWindow'

export const winConfig = {
  search: {
    id: 0,
    options: {
      y: 100,
      initShow: false,
      hash: '',
      alwaysOnTop: true,
      resizable: false,
      isHideTaskbar: true,
      openDevTools: true,
      skipTaskbar: true
    }
  },
  config: {
    id: 0,
    options: {
      initShow: true,
      openDevTools: true,
      width: 1060,
      height: 600,
      minHeight: 638,
      minWidth: 1172,
      alwaysOnTop: false,
      resizable: true,
      frame: false,
      transparent: false,
      isHideTaskbar: false,
      hash: '/#config/category/contentList'
    }
  },
  setting: {
    id: 0,
    options: {
      initShow: true,
      openDevTools: true,
      width: 530,
      height: 530,
      alwaysOnTop: true,
      resizable: false,
      frame: false,
      transparent: false,
      isHideTaskbar: false,
      hash: '/#setting'
    }
  }
  // preview: {
  //   id: 0,
  //   options: {
  //     width: 400,
  //     height: 400,
  //     initShow: false,
  //     alwaysOnTop: false,
  //     resizable: false,
  //     isHideTaskbar: true,
  //     openDevTools: true,
  //     skipTaskbar: true,
  //     hash: '/#preview'
  //   }
  // },
  // notice: {
  //   id: 0,
  //   options: {
  //     width: 400,
  //     height: 400,
  //     initShow: false,
  //     alwaysOnTop: true,
  //     resizable: false,
  //     isHideTaskbar: true,
  //     openDevTools: true,
  //     skipTaskbar: true,
  //     hash: '/#notice'
  //   }
  // }
} as Record<WindowNameType, { id: number; options: OptionsType }>

// 监听单实例锁的实现
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  // 如果无法获取锁，说明已经有一个实例在运行，直接退出
  app.quit()
} else {
  // 如果锁成功，继续正常启动应用
  app.on('second-instance', () => {
    // 如果已经有主窗口，恢复并激活它
    const win = BrowserWindow.fromId(winConfig['search'].id) // 这里可以根据具体窗口类型调整
    if (win) {
      if (win.isMinimized()) win.restore()
      win.show() // 确保窗口处于焦点状态
    }
  })
}

// 获取窗口
const getExistingWindow = (name: WindowNameType) => {
  return BrowserWindow.fromId(winConfig[name]?.id || 0);
}

// 根据name创建当前窗口
export const getByNameWindow = <T extends WindowNameType>(name: T, options?: CreateOption<T>) => {
  // 获取现有窗口
  let win = getExistingWindow(name);

  // 如果窗口不存在，则创建新窗口
  if (!win) {

    // 如果没有传递options，则需要隐藏其他窗口
    if (!options) {
      Object.keys(winConfig).forEach((key) => {
        const existingWin = getExistingWindow(key as WindowNameType);
        if (existingWin && existingWin !== win) {
          existingWin.hide(); // 隐藏当前其他窗口
        }
      });
    } else {
      // 如果是模态窗口，需要设置父窗口
      if (options.model && options.parent) {
        const parentWin = getExistingWindow(options.parent);

        if (parentWin) {
          winConfig[name].options.parent = parentWin;
        }
      }
    }

    // 创建窗口
    win = createWindow(winConfig[name].options);
    winConfig[name].id = win.id;

    // 处理窗口关闭时清除ID
    win.on('closed', () => {
      winConfig[name].id = 0;
    });
  }

  return win;
}


// 根据事件获取当前窗口
export const getWindowByEvent = (event: IpcMainEvent | IpcMainInvokeEvent) => {
  return BrowserWindow.fromWebContents(event.sender)!
}
