import { app, dialog } from 'electron'
import { join } from 'path'
import { autoUpdater } from 'electron-updater'
import logger from 'electron-log/main'
import { getLocalData, setLocalData, sleep } from './helper'


// 打印更新相关的 log 到本地
logger.transports.console.level = false // 控制台关闭输出（只输出到文件）
logger.transports.file.level = 'silly'
logger.transports.file.maxSize = 1002430 // 文件最大不超过 1M
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
logger.transports.file.resolvePathFn = () => join(app.getPath('logs'), 'auto-update.log') // 在程序的安装目录（生产），或代码根目录（开发）的 log 文件夹下打印日志。
logger.initialize()

export async function autoUpdateInit() {

  // 根据平台设置更新 URL
  const baseUrl = 'http://localhost:8089/packages'
  const platform = process.platform
  let updateUrl = ''

  logger.info('当前系统环境为: ', platform)

  if (platform === 'win32') {
    updateUrl = `${baseUrl}/win32/`
  } else if (platform === 'darwin') {
    updateUrl = `${baseUrl}/mac/`
  } else if (platform === 'linux') {
    updateUrl = `${baseUrl}/linux/`
  } else {
    logger.warn('Unsupported platform: ' + platform)
    return
  }

  logger.info('更新地址为：', updateUrl)

  autoUpdater.setFeedURL(updateUrl)

  await sleep(3000)

  //每次启动自动更新检查 更新版本 --可以根据自己方式更新，定时或者什么
  autoUpdater.checkForUpdates()

  autoUpdater.logger = logger
  autoUpdater.disableWebInstaller = false
  autoUpdater.autoDownload = false //这个必须写成false，写成true时，我这会报没权限更新，也没清楚什么原因
  autoUpdater.on('error', (error) => {
    logger.error(['检查更新失败', error])
  })
  //当有可用更新的时候触发。 更新将自动下载。
  autoUpdater.on('update-available', (info) => {
    logger.info('检查到有更新，开始下载新版本')
    logger.info(info)
    const { version } = info
    askUpdate(version)
  })
  //当没有可用更新的时候触发。
  autoUpdater.on('update-not-available', () => {
    logger.info('没有可用更新')
  })
  // 在应用程序启动时设置差分下载逻辑
  autoUpdater.on('download-progress', async (progress) => {
    logger.info(progress)
  })
  //在更新下载完成的时候触发。
  autoUpdater.on('update-downloaded', (res) => {
    logger.info('下载完毕！提示安装更新')
    logger.info(res)
    //dialog 想要使用，必须在BrowserWindow创建之后
    dialog
      .showMessageBox({
        title: '升级提示！',
        message: '已为您下载最新应用，点击确定马上替换为最新版本！'
      })
      .then(() => {
        logger.info('退出应用，安装开始！')
        //重启应用并在下载后安装更新。 它只应在发出 update-downloaded 后方可被调用。
        autoUpdater.quitAndInstall()
      })
  })
}

async function askUpdate(version) {
  logger.info(`最新版本 ${version}`)
  let updater = getLocalData('updater')
  let { auto, version: ver, skip } = updater || {}
  logger.info(
    JSON.stringify({
      ...updater,
      ver: ver
    })
  )
  if (skip && version === ver) return
  if (auto) {
    // 不再询问 直接下载更新
    autoUpdater.downloadUpdate()
  } else {
    const { response, checkboxChecked } = await dialog.showMessageBox({
      type: 'info',
      buttons: ['关闭', '跳过这个版本', '安装更新'],
      title: '软件更新提醒',
      message: `当前新版本是 ${version}，您现在的版本是 ${app.getVersion()}，现在要下载更新吗？`,
      defaultId: 2,
      cancelId: -1,
      checkboxLabel: '以后自动下载并安装更新',
      checkboxChecked: false,
      textWidth: 300
    })
    if ([1, 2].includes(response)) {
      let updaterData = {
        version: version,
        skip: response === 1,
        auto: checkboxChecked
      }
      setLocalData('updater', { ...updaterData })
      if (response === 2) autoUpdater.downloadUpdate()
      logger.info(['更新操作', JSON.stringify(updaterData)])
    } else {
      logger.info(['更新操作', '关闭更新提醒'])
    }
  }
}
