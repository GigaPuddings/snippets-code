type SqlActionType = 'findAll' | 'findOne' | 'insert' | 'update' | 'del' | 'config'

type CategoryType = {
  id: number
  name: string
  created_at: string
}

type ThemeType = 'dark' | 'light' | 'auto';

type LocalDataType = 'updater' | 'databaseDirectory'

type SearchType = 'config' | 'window'

type ContentType = {
  id: number
  title: string
  category_id: number
  content: string
  created_at: string
  category_name?: string
  searchType?: SearchType
}

type ConfigType = {
  id: number
  content: string
}

type ConfigDataType = {
  shortCut: {
    search: string,
    config: string
  }
  databaseDirectory: string
}

type ShortCutTypeTarget = 'search' | 'config'

interface ShortCutArrayType {
  hotkey: string
  type: ShortCutTypeTarget
}

type ShortCutType = string | ShortCutArrayType[]

type WindowNameType = 'search' | 'config' | 'setting' | 'preview' | 'notice'


interface CreateOption<T> {
  parent: Exclude<WindowNameType, T>;
  model: boolean;
}

/**
 * update-databaseDirectory 更新数据库
 * update-available 检查是否有更新
 * download-update 开始下载
 * download-progress 进度条实时通知更新
 * update-downloaded 下载完成
 * install-update 重启程序并更新
 */
type Channels =
  'update-databaseDirectory'
  | 'update-available'
  | 'download-update'
  | 'download-progress'
  | 'update-downloaded'
  | 'install-update'
  | 'skip-version-update'
