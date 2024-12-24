import { dialog, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import * as query from './query'
import { backupDatabase, dbPath, restoreDatabase } from './connect'
import { getWindowByEvent } from '../windows'
import { getLocalData, setLocalData } from '../helper'

// 处理sql请求
ipcMain.handle(
  'sql',
  (_event: IpcMainInvokeEvent, sql: string, type: SqlActionType, params = {}) => {
    return query[type](sql, params)
  }
)

// 设置存储路径
ipcMain.handle('selectDatabaseDirectory', async () => {
  const res = await dialog.showOpenDialog({
    // 对话框窗口的标题
    title: '选中目录',
    // 先择文件、目录、并支持多选
    properties: ['openDirectory', 'createDirectory']
  })

  return res.canceled ? '' : res.filePaths[0]
})

// 获取数据库目录
ipcMain.handle('getDatabaseDirectory', async ()=> {
  return dbPath
})

// 保存路径
ipcMain.on('setDatabaseDirectory', (_event: IpcMainEvent, path: string) => {
  // config.databaseDirectory = path
  setLocalData('databaseDirectory', path)
})

// 处理备份请求
ipcMain.handle('backupDatabase', async (event: IpcMainInvokeEvent, backupType: string) => {
  try {
    getWindowByEvent(event).isAlwaysOnTop() && getWindowByEvent(event).setAlwaysOnTop(false)
    // 使用 dialog.showOpenDialog 让用户选择文件夹
    const result = await dialog.showOpenDialog({
      title: '选择备份文件夹',
      properties: ['openDirectory'] // 只允许选择文件夹
    })

    if (result.canceled) {
      console.log('The user has cancelled the selection')
      return null // 返回 null 以表示用户取消了操作
    }

    const backupDir = result.filePaths[0] // 用户选择的文件夹路径
    await backupDatabase(backupDir, backupType) // 等待备份操作完成
    console.log(`Backup successful: ${backupDir}`)

    return backupDir // 返回备份目录路径
  } catch (error) {
    console.error('Backup failed:', error)
    throw new Error('Backup failed, please try again.')
  }
})

// 处理恢复请求
ipcMain.handle('restoreDatabase', async (event: IpcMainInvokeEvent) => {
  try {
    // 取消置顶
    getWindowByEvent(event).isAlwaysOnTop() && getWindowByEvent(event).setAlwaysOnTop(false)
    // 使用 dialog.showOpenDialog 打开文件选择器，让用户选择备份文件
    const result = await dialog.showOpenDialog({
      title: '选择要恢复的数据库备份文件',
      defaultPath: getLocalData('databaseDirectory') || dbPath,
      filters: [{ name: 'SQLite 数据库文件', extensions: ['db'] }],
      properties: ['openFile'] // 只允许选择文件
    })

    if (result.canceled) {
      console.log('The user has cancelled the selection')
      return null // 返回 null 以表示用户取消了操作
    }

    const backupFilePath = result.filePaths[0] // 获取用户选择的备份文件路径
    await restoreDatabase(backupFilePath) // 等待恢复操作完成
    console.log(`Restore successful from: ${backupFilePath}`)

    return backupFilePath // 返回恢复的文件路径
  } catch (error) {
    console.error('Restore failed:', error)
    throw new Error('Restore failed, please try again.')
  }
})
