import { Outlet, useFetcher, useLoaderData, useSubmit } from 'react-router-dom'
import { CategoryItem } from '@renderer/components/CategoryItem'
import { QuickNav } from '@renderer/components/QuickNav'
import { FolderPlus, SortAmountDown, SortAmountUp } from '@icon-park/react'
import { Tooltip } from 'antd'
import { HTMLAttributes, useState } from 'react'
import './category.scss'
import { IIcon } from '@icon-park/react/lib/runtime'
import { JSX } from 'react/jsx-runtime'

export default () => {
  const initialCategories = useLoaderData() as CategoryType[]
  const fetcher = useFetcher()
  const submit = useSubmit()
  const [fileSort, setFileSort] = useState<string>('desc')
  const [isHovering, setIsHovering] = useState(false);

  // 数据来源：优先从 fetcher.data 获取最新数据，否则使用初始加载的数据
  const categories = fetcher.data || initialCategories

  // 切换排序方式并提交表单
  const handleOrder = () => {
    const newOrder = fileSort === 'desc' ? 'asc' : 'desc'
    setFileSort(newOrder)
    fetcher.submit({ fileSort: newOrder }, { method: 'get', action: '/config/category' })
  }

  // 排序图标组件
  const SortIcon = (props: JSX.IntrinsicAttributes & IIcon & Omit<HTMLAttributes<HTMLSpanElement>, keyof IIcon>) => (
    fileSort === 'desc' ? (
      <SortAmountUp
        {...props}
      />
    ) : (
      <SortAmountDown
        {...props}
      />
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
              <Tooltip
                placement="bottom"
                title={fileSort === 'desc' ? '降序' : '升序'}
                arrow={true}
                open={isHovering}
              >
                <SortIcon
                  onClick={handleOrder}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className='icon'
                  theme="outline"
                  size="16"
                />
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
