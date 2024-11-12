import { ReactNode, useEffect } from 'react'
import { CloseSmall, Logout, Minus, SettingConfig, SettingTwo, SquareSmall } from '@icon-park/react'
import { useStore } from '@renderer/store/useStore'
import type { MenuProps } from 'antd';
import { Dropdown, Modal, Tooltip } from 'antd'
import { useMantineColorScheme } from '@mantine/core';

import styles from '@renderer/components/ContentBar/styles.module.scss'
interface Props {
  isMax?: boolean
  children?: ReactNode
}

export const ContentBar = ({ isMax = true, children }: Props) => {

  const { setColorScheme } = useMantineColorScheme();
  const [modal, contextHolder] = Modal.useModal();
  const { theme } = useStore(state => state)

  useEffect(() => {
    setColorScheme(theme)
  }, [theme])

  const items: MenuProps['items'] = [
    {
      label: '设置',
      icon: <SettingTwo theme="outline" size="16" />,
      key: '0',
    },
    {
      label: '退出',
      key: '1',
      icon: <Logout theme="outline" size="16" />
    }
  ];

  const onClick: MenuProps['onClick'] = async ({ key }) => {
    if (key == '0') {
      window.api.openWindow('setting', { parent: 'config', model: true })
    } else {
      const confirmed = await modal.confirm({
        title: '警告',
        content: '确认要彻底关闭该应用吗?',
        cancelText: '取消',
        width: 350,
        okText: '确认',
        okType: "danger"
      });
      confirmed && window.api.windowQuit()
    }

  };

  return (
    <>
      <main className={`${styles.contentBar} drag`}>
        <div className={styles.titleBar}>{children}</div>
        <div className={`${styles.optionBar} nodrag`}>
          {isMax && <Dropdown menu={{ items, onClick }} trigger={['click']} overlayClassName={'dropdown'}>
            <SettingConfig className={styles.minus} theme="outline" size="18" strokeWidth={3} onClick={(e) => e.preventDefault()} />
          </Dropdown>}
          <Tooltip placement="bottom" title='最小化' arrow={true}>
            <Minus className={styles.minus} theme="outline" size="18" strokeWidth={3} onClick={() => window.api.minimizeWindow()} />
          </Tooltip>
          {isMax && <Tooltip placement="bottom" title='最大化' arrow={true}>
            <SquareSmall className={styles.squareSmall} theme="outline" size="22" strokeWidth={3} onClick={() => window.api.maximizeWindow()} />
          </Tooltip>}
          <Tooltip placement="bottom" title='关闭' arrow={true}>
            <CloseSmall className={styles.closeSmall} theme="outline" size="22" strokeWidth={3} onClick={() => window.api.closeWindow()} />
          </Tooltip>
        </div>
      </main>
      {contextHolder}
    </>
  )
}
