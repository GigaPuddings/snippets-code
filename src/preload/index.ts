import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import logger from 'electron-log/renderer'
// Custom APIs for renderer
const api = {
  sendMessage(channel: Channels, ...args: unknown[]) {
    ipcRenderer.send(channel, ...args);
  },
  on(channel: Channels, func: (...args: any[]) => void) {

    const subscription = (_event: IpcRendererEvent, ...args: any[]) => func(...args);

    logger.info('监听到....', channel)


    ipcRenderer.on(channel, subscription);

    return () => {
      logger.info('监听到....销毁', channel)

      ipcRenderer.removeListener(channel, subscription);
    };
  },
  onDownloadProgress: (callback: (arg0: any) => void) => {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => callback(args);
    ipcRenderer.on('download-progress', subscription)
    return () => {
      ipcRenderer.removeListener('download-progress', subscription);
    };
  },
  onUpdateDownloaded: (callback: (arg0: any) => void) => {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => callback(args);
    ipcRenderer.on('update-downloaded', subscription)
    return () => {
      ipcRenderer.removeListener('update-downloaded', subscription);
    };
  },
  // 注册自定义快捷键
  shortCut: (shortCut: string, type: ShortCutType) => {
    return ipcRenderer.invoke('shortCut', shortCut, type)
  },
  // 鼠标穿透
  setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => {
    ipcRenderer.send('setIgnoreMouseEvents', ignore, options)
  },
  // config window
  openConfigWindow: () => ipcRenderer.send('openConfigWindow'),
  // sql 增删改查
  sql: (sql: string, type: SqlActionType, params = {}) => {
    return ipcRenderer.invoke('sql', sql, type, params)
  },
  // 显示隐藏窗体
  openWindow: (name: WindowNameType, options?: any) => {
    ipcRenderer.send('openWindow', name, options)
  },
  hideWindow: (name: WindowNameType) => {
    ipcRenderer.send('hideWindow', name)
  },
  // 窗口最大化
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  //  窗口最小化
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  // 关闭窗口
  closeWindow: () => ipcRenderer.send('close-window'),
  // 退出应用
  windowQuit: () => ipcRenderer.send('window-quit'),
  // 重启应用
  windowReset: () => ipcRenderer.send('window-reset'),
  // 设置存储位置
  selectDatabaseDirectory: () => {
    return ipcRenderer.invoke('selectDatabaseDirectory')
  },
  getDatabaseDirectory: () => {
    return ipcRenderer.invoke('getDatabaseDirectory')
  },
  // 保存存储位置
  setDatabaseDirectory: (path: string) => {
    console.log('保存数据', path);

    ipcRenderer.send('setDatabaseDirectory', path)
  },
  // 表初始化
  initTable: () => {
    ipcRenderer.send('initTable')
  },
  // 备份数据
  backupDatabase: async (backupType: number) => {
    try {
      return await ipcRenderer.invoke('backupDatabase', backupType)
    } catch (error) {
      console.error('Backup failed:', error)
      return Promise.reject(error)
    }
  },

  // 恢复数据
  restoreDatabase: async () => {
    try {
      return await ipcRenderer.invoke('restoreDatabase')
    } catch (error) {
      console.error('Restore failed:', error)
      return Promise.reject(error)
    }
  },

  // 监听主进程发送的路由跳转消息
  onNavigate: (callback: (arg0: any) => void) => {
    const fn = (_event: IpcRendererEvent, ...args: unknown[]) => {
      console.log('Received navigate event in preload:', args) // 调试用
      callback(args)
    }
    ipcRenderer.on('navigate', fn)
    return () => {
      ipcRenderer.removeListener('navigate', fn);
    };
  },
  // 监听主进程发送的 windowShow
  onWindowShow:(callback: Function) => {
    ipcRenderer.on('on-window-show', (_event) => {
      callback()
    })
  },
  // 通知主进程页面已准备好
  notifyReady: () => {
    ipcRenderer.send('renderer-ready')
  },
  // 设置开机自启
  loginItemSettings: async () => {
    return await ipcRenderer.invoke('login-item-settings')
  },
  // 获取开机自启状态
  setAutoLaunch: async (enable: boolean) => {
    return await ipcRenderer.invoke('set-auto-launch', enable)
  },
  // 搜索本地应用
  searchLocalApps: async (term: string) => {
    return await ipcRenderer.invoke('search-local-apps', term)
  },
  // 打开本地应用
  openApp: async (appPath: string) => {
    ipcRenderer.send('open-app', appPath)
  },
  // 显示预览子窗口
  showPreviewWindow: (item: Pick<ContentType, 'title' | 'content'>, index: number) => ipcRenderer.send('show-preview-window', item, index),
  // 隐藏预览子窗口
  hidePreviewWindow: () => ipcRenderer.send('show-preview-window'),
  // 向子窗口发送内容数据
  updatePreviewContent: (callback: (arg0: any) => void) => {
    ipcRenderer.on('update-preview-content', (_event, item: Pick<ContentType, 'title' | 'content'>) => {
      callback(item)
    })
  },
  // 移除子窗口监听
  removePreviewContent: () => {
    ipcRenderer.removeAllListeners('update-preview-content');
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    console.log('API exposed to renderer') // 确认 API 暴露成功
  } catch (error) {
    console.error('Error exposing API:', error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
