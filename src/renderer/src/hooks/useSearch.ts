import { useStore } from '@renderer/store/useStore'

export default () => {
  const { setData, search, setSearch } = useStore((state) => state)
  const handleSearch = async (value: string) => {
    setSearch(value)
    if (value) {
      // 查询顺序：title -> category_id -> content
      const data : ContentType[] = await window.api.sql(
        `
          select * from contents
          where title like @searchWord

          union

          select c.* FROM contents c
          join categories cat on c.category_id = cat.id
          where cat.name like @searchWord

          union

          select * from contents
          where content like @searchWord
        `,
        'findAll',
        { searchWord: `%${value}%` }
      )

      // 已安装程序
      const foundApps = await window.api.searchLocalApps(value)

      setData([...foundApps, ...data])
    } else {
      setData([]) // 清空数据
    }
  }

  return { search, handleSearch }
}
