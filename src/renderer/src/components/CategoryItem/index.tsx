import { FolderClose } from "@icon-park/react";
import { NavLink, useFetcher, useParams } from "react-router-dom";
import styles from './styles.module.scss';
import { useStore } from "@renderer/store/useStore";
import useCategory from "@renderer/hooks/useCategory";
import { useCallback, useEffect } from "react";

interface ContentItemProps {
  category: CategoryType;
}


export const CategoryItem = ({ category }: ContentItemProps) => {
  const { editCategoryId, setEditCategoryId } = useStore(state => state);

  const fetcher = useFetcher();
  const { contextMenu, dragHandle } = useCategory(category);

  // 更新分类
  const updateCategory = useCallback((e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    // 英文首字母大写
    fetcher.submit({ id: category.id, name: e.currentTarget.value.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()) }, { method: 'PUT' });
    // 取消输入框
    setEditCategoryId(0);
  }, [fetcher, category.id, setEditCategoryId]);

  // 是否是新增
  const { cid, type } = useParams()
  useEffect(() => {
    type === 'add' && setEditCategoryId(Number(cid))
  }, [type])

  return (
    <>
      {editCategoryId === category.id ? (
        <input
          defaultValue={category.name}
          name="name"
          autoFocus
          className={styles.input}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateCategory(e);
            }
          }}
          onBlur={updateCategory}
        />
      ) : (
        <NavLink
          to={`/config/category/contentList/${category.id}`}
          onClick={() => setEditCategoryId(0)}
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
          onContextMenu={contextMenu()}
          {...dragHandle}
        >
          <div className='flex items-center gap-1'>
            <FolderClose theme='outline' size='16' strokeWidth={3} />
            <div className='truncate'>{category.name}</div>
          </div>
        </NavLink>
      )}
    </>
  );
};
