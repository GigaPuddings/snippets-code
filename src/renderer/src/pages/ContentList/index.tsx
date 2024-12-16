import { Outlet, useLoaderData } from 'react-router-dom'
import { ContentSearch } from '@renderer/components/ContentSearch';
import { ContentItem } from '@renderer/components/ContentItem';
import './contentList.scss'
import { ContentBar } from '@renderer/components/ContentBar';
import { Splitter } from 'antd';
import { Pushpin } from '@icon-park/react';
import { useState } from 'react';

export default () => {
  // 获取片段列表
  const contents = useLoaderData() as ContentType[]
  const [ hasTop, setHasTop ] = useState(true) // 窗口是否置顶

  // 点击置顶
  const handleClickTop = () => {
    setHasTop(!hasTop)
    window.api.setAlwaysOnTop(hasTop)
  }

  return (
    <Splitter>
      <Splitter.Panel className='list' defaultSize="25%" min="25%" max="40%">
        <ContentSearch />
        <div className='list-content'>
          <div className='content'>
            {contents.map((content) => (
              <ContentItem content={content} key={content.id} />
            ))}
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel>
        <ContentBar >
          <Pushpin className={hasTop ? 'notTop' : 'top'} theme="outline" size="18" strokeWidth={3} onClick={() => handleClickTop()} />
        </ContentBar>
        <Outlet />
      </Splitter.Panel>
    </Splitter>
  )
}
