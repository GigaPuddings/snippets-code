import { ElectronAPI } from '@electron-toolkit/preload'
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      sendMessage: (channel: Channels, ...args: unknown[]) => void
      on: (channel: Channels, func: (...args: unknown[]) => void) => void
      onDownloadProgress: (callback: Function) => void
      onUpdateDownloaded: (callback: Function) => void
      shortCut: (shortCut: ShortCutType, type?: ShortCutTypeTarget) => void
      setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void
      openConfigWindow: () => void
      sql: <T>(sql: string, type: SqlActionType, params?: Record<string, any>) => Promise<T>
      openWindow: (name: WindowNameType, options?: any) => void
      hideWindow: (name: WindowNameType) => void
      setAlwaysOnTop: (flag: boolean) => void
      maximizeWindow: () => void
      minimizeWindow: () => void
      closeWindow: () => void
      windowQuit: () => void
      windowReset: () => void
      onNavigate: (callback: Function) => void
      onWindowShow: (callback: Function) => void
      notifyReady: () => void
      selectDatabaseDirectory: () => Promise<string>
      getDatabaseDirectory: () => Promise<string>
      setDatabaseDirectory: (path: string) => void
      backupDatabase: (backupType: string) => Promise<string>
      restoreDatabase: ()  => Promise<string>
      setAutoLaunch: (isAutoLaunch: boolean)  => Promise<boolean>
      searchLocalApps: (term: string)  => Promise<ContentType[]>
      openApp: (appPath: string)  => void
      loginItemSettings: ()  => Promise<boolean>
      showPreviewWindow: (item?: Pick<ContentType, 'title' | 'content'>, index?: number) => void
      hidePreviewWindow: () => void
      updatePreviewContent: (callback: Function) => void
      removePreviewContent: () => void
    }
  }
}
