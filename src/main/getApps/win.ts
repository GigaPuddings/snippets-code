import { Registry } from "./utils/registry";

// 将正则表达式移到外部，避免重复创建
const guidRegex = /^\{[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}\}$/i;

export async function getInstalledApps() {
  const keys = [
    { hive: Registry.HKLM, key: "\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall" },
    { hive: Registry.HKLM, key: "\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall" },
    { hive: Registry.HKCU, key: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall" },
    { hive: Registry.HKCU, key: "\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall" }
  ];

  let apps = [];
  for (const { hive, key } of keys) {
    try {
      const registryApps: any = await getApps(new Registry({ hive, key }));
      apps = apps.concat(registryApps);
    } catch (err) {
      console.error(`Error fetching apps from ${key}:`, err);
    }
  }

  return filterAndTransformApps(apps);
}

function filterAndTransformApps(apps) {
  return apps.reduce((result, app) => {
    if (app.appIdentifier && !guidRegex.test(app.appIdentifier)) {
      if (app.DisplayName && app.DisplayIcon) {
        result.push({
          appName: app.DisplayName,
          DisplayIcon: app.DisplayIcon.replace(/,.*$/g, '').replace(/ico$/g, 'exe')
        });
      }
    }
    return result;
  }, []);
}

export async function getApps(regKey: any) {
  return new Promise(async (resolve, reject) => {
    try {
      regKey.keys((err: any, keys: any) => {
        if (err) {
          console.error("Error fetching registry keys:", err);
          reject([]);
        } else {
          const appItems = keys.map(getAppData);
          resolve(Promise.all(appItems));
        }
      });
    } catch (err) {
      console.error("Error fetching registry keys:", err);
      reject([]);
    }
  });
}

export function getAppData(appKey) {
  return new Promise((resolve) => {
    let app: any = {};
    try {
      app.appIdentifier = appKey.key.split("\\").pop();
      appKey.values((_e: any, items: any) => {
        if (items) {
          for (const item of items) {
            if (item.value) {
              app[item.name] = item.value;
            }
          }
        }
        resolve(app);
      });
    } catch (err) {
      console.error("Error processing app data:", err);
      resolve(app);
    }
  });
}
