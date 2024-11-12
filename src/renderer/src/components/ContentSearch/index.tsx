import { Form, useSubmit } from "react-router-dom"
import { Plus, Search } from "@icon-park/react"
import { Input, Tooltip } from 'antd'
import { useRef, ChangeEvent } from 'react'
import { debounce } from 'lodash';
import styles from './styles.module.scss'

export const ContentSearch = () => {
  const submit = useSubmit()
  const formRef = useRef<HTMLFormElement | null>(null)  // 为表单引用添加类型

  const handleInputChange = debounce((_e: ChangeEvent<HTMLInputElement>) => {
    if (formRef.current) {
      submit(formRef.current)
    }
  }, 500)

  return (
    <Form ref={formRef}>
      <div className={styles.contentSearch}>
        <Input
          className={styles.search}
          name='searchWord'
          variant='borderless'
          placeholder="搜索..."
          prefix={<Search className="mr-1" theme="outline" size="15" strokeWidth={2}/>}
          onChange={handleInputChange}
        />
        <Tooltip placement="bottom" title='新建片段' arrow={true}>
          <Plus
            className={styles.add}
            theme="outline"
            size="18"
            strokeWidth={2}
            onClick={() => {
              submit(null, { method: 'POST' })
            }}
          />
        </Tooltip>
      </div>
    </Form>
  )
}

