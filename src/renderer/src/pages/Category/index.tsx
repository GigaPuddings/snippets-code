import { Outlet, useFetcher, useLoaderData, useSubmit } from 'react-router-dom'
import { CategoryItem } from '@renderer/components/CategoryItem'
import { QuickNav } from '@renderer/components/QuickNav'
import { FolderPlus, SortAmountDown, SortAmountUp } from '@icon-park/react'
import { Tooltip } from 'antd'
import { useState } from 'react'
import './category.scss'

export default () => {
  const initialCategories = useLoaderData() as CategoryType[]
  const fetcher = useFetcher()
  const submit = useSubmit()
  const [fileSort, setFileSort] = useState<string>('desc')

  // 数据来源：优先从 fetcher.data 获取最新数据，否则使用初始加载的数据
  const categories = fetcher.data || initialCategories

  // 切换排序方式并提交表单
  const handleOrder = () => {
    const newOrder = fileSort === 'desc' ? 'asc' : 'desc'
    setFileSort(newOrder)
    fetcher.submit({ fileSort: newOrder }, { method: 'get', action: '/config/category' })
  }

  // 排序图标组件
  const SortIcon = () => (
    fileSort === 'desc' ? (
      <SortAmountUp onClick={handleOrder} className='icon' theme="outline" size="16" />
    ) : (
      <SortAmountDown onClick={handleOrder} className='icon' theme="outline" size="16" />
    )
  )

  return (
    <main className='category-page'>
      <div className='categories'>
        <QuickNav />
        <div>
          <div className='categories-head'>
            <div className='hint'>文件夹</div>
            <div className='interaction'>
              <Tooltip placement="bottom" title='新建文件夹' arrow={true}>
                <FolderPlus
                  className='icon'
                  theme="outline"
                  size="16"
                  onClick={() => submit(null, { method: 'POST' })}
                />
              </Tooltip>
              <Tooltip placement="bottom" title={fileSort === 'desc' ? '降序' : '升序'} arrow={true}>
                <SortIcon />
              </Tooltip>
            </div>
          </div>
          {categories.map((category: CategoryType) => (
            <CategoryItem category={category} key={category.id} />
          ))}
        </div>
      </div>
      <div className='content-page'>
        <Outlet />
      </div>
    </main>
  )
}
