import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { Input, InputRef } from "antd"
import { debounce } from 'lodash';
import { HomeTwo } from "@icon-park/react"
import Result from "@renderer/components/Result"
import useSearch from "@renderer/hooks/useSearch"

export default function Search() {
  const { search, handleSearch } = useSearch()

  const [value, setValue] = useState(search);

  const inputRef = useRef<InputRef | null>(null);


  // 打开配置窗口
  const setOpenWindow = useCallback(() => {
    window.api.openWindow('config');
  }, []);

  // 延迟搜索
  const debouncedSubmit = useCallback(
    debounce((value: string) => {
      handleSearch(value)
    }, 500),
    []
  );

  // 输入框内容变化处理
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    debouncedSubmit(newValue);
  };

  // 监听窗口显示事件并自动聚焦输入框
  useEffect(() => {
    if (window.api?.onWindowShow) {
      window.api.onWindowShow(() => {
        inputRef.current?.focus();
      });
    }
  }, []);

  // 鼠标移出窗口外隐藏预览窗口
  // const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
  //   event.preventDefault();
  //   window.api.hidePreviewWindow()
  // };

  return (
    <main className="bg-slate-50 dark:bg-[#22282c] py-3 px-3 rounded-lg drag">
      {/*  onMouseLeave={handleMouseLeave} */}
      <section className="rounded-lg flex items-center nodrag">
        <Input
          ref={inputRef}
          value={value}
          autoFocus
          variant="borderless"
          onChange={handleChange}
          className="bg-slate-200 dark:bg-[#282d32] dark:text-stone-300 ml-1 mr-2 nodrag font-semibold text-[17px] p-2 text-zinc-700"
        />
        <div
          className="p-1 bg-gray-300 dark:bg-[#424242] dark:text-stone-300 rounded-md text-zinc-600 cursor-pointer"
          onClick={() => setOpenWindow()}
        >
          <HomeTwo
            theme="outline"
            size="18"
            strokeWidth={4}
            className="cursor-pointer"
          />
        </div>
      </section>
      <section className="nodrag">
        <Result />
      </section>
    </main>
  )
}
