import { app } from 'electron'
import './ipc'
import { getLocalData, setLocalData } from '../helper'
import { initTable } from './tables'
import logger from 'electron-log/main'

app.whenReady().then(() => {
  // 只有第一次启动时或者路径错误时，初始化数据库
  if (getLocalData('isFirstStart')) {

    initTable()
    // 设置为非第一次启动
    setLocalData('isFirstStart', false)
    logger.info('初始化数据库完成')
  }
})
