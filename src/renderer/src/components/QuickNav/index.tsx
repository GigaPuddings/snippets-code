import { AllApplication, FolderOne } from "@icon-park/react"
import { NavLink } from "react-router-dom"
import styles from './styles.module.scss'
export const QuickNav = () => {
  return (
    <main className="my-3 border-b dark:border-b-[#43444e]">
      <div className='px-1 mt-2 opacity-90 mb-1 text-gray-400'>快捷操作</div>
      <NavLink
        to={`/config/category/contentList`}
        end
        className={({isActive})=> {
          return isActive ? styles.active : styles.link
        }}
      >
        <div className='flex items-center gap-1 text-sm'>
          <AllApplication theme='outline' size='18' strokeWidth={3} />
          <div className='truncate ml-1'>所有片段</div>
        </div>
      </NavLink>
      <NavLink
        to={`/config/category/contentList/0`}
        end
        className={({isActive})=> {
          return isActive ? styles.active : styles.link
        }}
      >
        <div className='flex items-center gap-1 text-sm'>
          <FolderOne theme='outline' size='17' strokeWidth={3} />
          <div className='truncate ml-1'>未分类</div>
        </div>
      </NavLink>
    </main>
  )
}
