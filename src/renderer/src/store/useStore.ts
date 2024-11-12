import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
interface StateProps {
  theme: ThemeType // 主题色
  setTheme: (theme: ThemeType) => void
  config: ConfigDataType // 基础配置
  setConfig: (config: ConfigDataType) => void
  data: ContentType[] // 搜索结果
  setData: (data: ContentType[]) => void
  search: string // 快捷搜索查询
  setSearch: (search: string) => void
  error: string // 快捷键注册error
  setError: (error: string) => void
  id: number // 快捷搜索选择 激活状态
  setId: (id: number) => void
  editCategoryId: number // 文件夹激活状态
  setEditCategoryId: (id: number) => void
  selectDatabase: string // 数据备份类型
  setSelectDatabase: (selectDatabase: string) => void
}

export const useStore = create(
  persist<StateProps>(
    (set) => ({
      theme: 'auto',
      setTheme: (theme) => set({ theme }),
      config: {
        databaseDirectory: '',
        shortCut: {
          search: 'Control+Shift+C',
          config: 'Control+Shift+D'
        }
      },
      setConfig: (config) => set({ config }),
      data: [],
      setData: (data) => set({ data }),
      search: '',
      setSearch: (content) => set({ search: content }),
      error: '',
      setError: (message) => set({ error: message }),
      id: 0,
      setId: (id) => set({ id }),
      editCategoryId: 0,
      setEditCategoryId: (id) => set({ editCategoryId: id }),
      selectDatabase: 'A',
      setSelectDatabase: (selectDatabase) => set({ selectDatabase })
    }),
    {
      name: 'code-storage',
      // 持久化
      partialize: (state) =>
        ({
          theme: state.theme,
          config: state.config,
          selectDatabase: state.selectDatabase
        }) as any,
      storage: createJSONStorage(() => localStorage)
    }
  )
)
