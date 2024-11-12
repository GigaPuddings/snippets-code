import { Form, useSubmit } from "react-router-dom"
import { Plus, Search } from "@icon-park/react"
import { Input, Tooltip } from 'antd'
import { useRef, ChangeEvent } from 'react'
import { debounce } from 'lodash';
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
      <div className='border-b dark:border-b-[#43444e] dark:bg-[#282d32] flex justify-between items-center h-[40px]'>
        <Input
          name='searchWord'
          variant='borderless'
          placeholder="搜索..."
          prefix={<Search className="mr-1" theme="outline" size="15" strokeWidth={2}/>}
          onChange={handleInputChange}
          className="bg-transparent dark:text-[#adb0b8] text-sm py-2 w-full"
        />
        <Tooltip placement="bottom" title='新建片段' arrow={true}>
          <Plus
            className="cursor-pointer rounded-md p-1 mr-2 dark:text-[#adb0b8] hover:bg-slate-200 dark:hover:bg-[--mantine-color-default-hover]"
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

