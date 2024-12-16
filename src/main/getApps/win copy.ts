// import { app } from "electron";
// import path from "path";

let regedit = require('regedit')
// const appPath = app.getAppPath(); // 获取当前应用的路径
// const unpackedPath = path.join(appPath, 'resources', 'app.asar.unpacked', 'node_modules', 'regedit', 'vbs');
// regedit.setExternalVBSLocation(unpackedPath);
// 打包后指向资源目录的路径
// ffmpeg.setFfprobePath(ffprobePath.path.replace('app.asar', 'app.asar.unpacked'))
// regedit.setExternalVBSLocation('regedit/vbs');
// 测试数据
// let data = {
//   'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall': {
//     keys: ['1', '2', '3']
//   },
//   'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall': {
//     keys: ['4', '5', '6']
//   },
//   'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall': {
//     keys: ['7', '8', '9']
//   },
//   'HKCU\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall': {
//     keys: ['10', '11', '12']
//   }
// }
/*
期望结果 [
  'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\1',
  'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\2',
  'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\3',
  'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\4',
  'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\5',
  'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\6',
  'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\7',
  'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\8',
  'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\9',
  'HKCU\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\10',
  'HKCU\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\11',
  'HKCU\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\12'
  ]
*/

// let guidRegex = /^\{[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}\}$/i;

// let result = Object.entries(data).flatMap(([path, value]) =>
//   value.keys.filter(key => !guidRegex.test(key)).map(key => `${path}\\${key}`)
// );

// console.log(result);

const registryPaths = [
  'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
  'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
  'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
  'HKCU\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall'
]
let guidRegex = /^\{[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}\}$/i

export function getApps(regKeys: string[]): Promise<any[]> {
  return new Promise((resolve, reject) => {
    try {
      const apps: any[] = [] // 存储应用信息

      // 遍历注册表路径
      regedit.list(regKeys, (err: any, res: any) => {
        if (err) {
          console.error('Error listing registry keys:', err)
          reject([])
          return
        }

        // 获取子键的路径  (value as any).keys.map((key: string) => `${path}\\${key}`)
        const subKeys = Object.entries(res).flatMap(([path, value]) =>(value as any).keys.filter((key: string) => !guidRegex.test(key)).map((key: string) => `${path}\\${key}`))

        // 第二次读取子键中的应用信息
        const stream = regedit.list(subKeys)
        stream.on('data', (entry: any) => {
            const displayName = entry.data.values?.DisplayName?.value
            const displayIcon = entry.data.values?.DisplayIcon?.value
            if (displayName && displayIcon) {
              apps.push({ appName: displayName, DisplayIcon: displayIcon })
            }
          })
          .on('error', (err: any) => {
            console.error('Error reading registry data:', err)
            reject([])
          })
          .on('finish', () => {
            console.log('Registry reading finished')
            resolve(apps) // 返回所有收集到的应用信息
          })
      })
    } catch (err) {
      console.error('Unexpected error:', err)
      reject([])
    }
  })
}

export async function getInstalledApps(): Promise<any[]> {
  try {
    const apps = await getApps(registryPaths)
    return apps
  } catch (error) {
    console.error('Failed to get installed apps:', error)
    return []
  }
}
