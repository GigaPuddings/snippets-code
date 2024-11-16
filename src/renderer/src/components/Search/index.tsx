import { ChangeEvent,  useCallback, useEffect, useRef, useState } from "react"
import { Input, InputRef } from "antd"
import { debounce } from 'lodash';
import { HomeTwo } from "@icon-park/react"
import Result from "@renderer/components/Result"
import useSearch from "@renderer/hooks/useSearch"
import styles from "./styles.module.scss"

export default function Search() {
  const { search, handleSearch } = useSearch()

  const [value, setValue] = useState(search);

  const inputRef = useRef<InputRef | null>(null);

  useEffect(() => {
    if (!search) {
      setValue('')
    }
  }, [search])

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

  return (
    <main className={`${styles.main} drag`}>
      <section className={`${styles.search} nodrag`}>
        <Input
          ref={inputRef}
          value={value}
          autoFocus
          variant="borderless"
          onChange={handleChange}
          className={`${styles.input} nodrag`}
        />
        <div
          className={styles.home}
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
