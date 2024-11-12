import { dialog, app } from 'electron'
import Database, * as BetterSqlite3 from 'better-sqlite3'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import config from '../config'
import { getLocalData, setLocalData } from '../helper'

const ERROR_MESSAGES = {
  DATABASE_PATH_INVALID: '自定义数据库路径不合法或损坏，程序将回退到默认路径。',
  BACKUP_FAILED: '无法备份数据库，请检查路径和权限。',
  RESTORE_FAILED: '无法恢复数据库，请检查文件和权限。',
  BACKUP_FILE_NOT_FOUND: '选中的备份文件不存在，请确认文件路径。'
}

// 检查并创建目录的通用函数
export function createDataFolder(): string {
  const dataFolderPath = join(app.getPath('userData'), 'Data')
  if (!existsSync(dataFolderPath)) {
    mkdirSync(dataFolderPath, { recursive: true })
  }
  return dataFolderPath
}

// 路径或数据无效，给出反馈
function databaseErrorMessage(): void {
  if (!config.hasShownError) {
    dialog.showErrorBox('数据存储有误', ERROR_MESSAGES.DATABASE_PATH_INVALID)
    config.hasShownError = true
    setLocalData('databaseDirectory', '')
  }
}

// 读取文件数据
const { databaseDirectory } = getLocalData()

// 检查路径有效性
function isValidDatabasePath(path: string): boolean {
  return existsSync(path) && /^(.*[\\/])?([^.]+)\.db$/.test(path)
}

// 检查数据是否损坏
function checkDatabaseIntegrity(dbPath: string): boolean {
  const db = new Database(dbPath, { readonly: true }) // 以只读模式打开数据库
  const result: any = db.pragma('integrity_check')

  db.close() // 关闭数据库连接

  return result[0].integrity_check === 'ok'
}

// 获取数据库路径的函数
function getDatabasePath(): string {
  // 默认数据库路径
  let dbPath = join(createDataFolder(), 'code.db')

  // 检查用户提供的自定义数据库路径
  if (databaseDirectory) {
    // 自定义路径有效
    if (isValidDatabasePath(databaseDirectory)) {
      // 文件是否损坏
      if (checkDatabaseIntegrity(databaseDirectory)) {
        dbPath = databaseDirectory
      } else {
        databaseErrorMessage()
      }
      dbPath = databaseDirectory
    } else {
      databaseErrorMessage()
    }
  }

  return dbPath
}

export const dbPath = getDatabasePath() // 获取数据库路径

// 数据库初始化函数
export const db = (): BetterSqlite3.Database => {
  const database = new Database(dbPath, {})
  database.pragma('journal_mode = WAL') // 使用 WAL 模式提高写入性能
  return database
}

// 备份数据库
export const backupDatabase = async (path: string, backupType: string): Promise<string> => {
  const backupFileName = `code-${formatBackupName(backupType)}`
  const backupPath = join(path, `${backupFileName}.db`)
  try {
    // 当前数据(dbPath) 拷贝到 新建文件(backupPath)
    copyFileSync(dbPath, backupPath)
    console.log(`The database has been backed up to: ${backupPath}`)
    return backupPath
  } catch (error) {
    dialog.showErrorBox('备份失败', ERROR_MESSAGES.BACKUP_FAILED)
    console.error(ERROR_MESSAGES.BACKUP_FAILED, error)
    throw new Error(ERROR_MESSAGES.BACKUP_FAILED)
  }
}

// 恢复数据库
export const restoreDatabase = async (path: string): Promise<string> => {
  if (!existsSync(path)) {
    console.error(ERROR_MESSAGES.BACKUP_FILE_NOT_FOUND)
    dialog.showErrorBox('恢复失败', ERROR_MESSAGES.BACKUP_FILE_NOT_FOUND)
    throw new Error(ERROR_MESSAGES.BACKUP_FILE_NOT_FOUND)
  }

  try {
    setLocalData('databaseDirectory', path)
    console.log(`The database has been restored from ${path}`)
    return path
  } catch (error) {
    dialog.showErrorBox('恢复失败', ERROR_MESSAGES.RESTORE_FAILED)
    console.error(ERROR_MESSAGES.RESTORE_FAILED, error)
    throw new Error(ERROR_MESSAGES.RESTORE_FAILED)
  }
}

// 格式化备份文件名
export const formatBackupName = (type: string): string => {
  const now = new Date()
  const date = now.toLocaleDateString().replace(/\//g, '-')
  const time = now.toLocaleTimeString().replace(/:/g, '-')
  switch (type) {
    case 'A':
      return date // 年-月-日
    case 'B':
      return time // 时-分-秒
    case 'C':
      return `${date}-${time}` // 年-月-日-时分秒
    default:
      return ''
  }
}
