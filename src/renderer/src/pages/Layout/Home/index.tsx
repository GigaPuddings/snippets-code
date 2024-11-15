import { MutableRefObject, useEffect, useRef } from "react"
import useIgnoreMouseEvents from "@renderer/hooks/useIgnoreMouseEvents"
import Error from '@renderer/components/Error'
import Search from "@renderer/components/Search"
import { useStore } from "@renderer/store/useStore"

function Home(): JSX.Element {
  const mainRef = useRef<HTMLDivElement | null>(null)
  const { config, setConfig, theme } = useStore(state => state)

  const { shortCut } = config
  const { setIgnoreMouseEvents } = useIgnoreMouseEvents()
  useEffect(() => {

    // 鼠标穿透
    setIgnoreMouseEvents(mainRef as MutableRefObject<HTMLDivElement>)

    // 注册快捷键
    window.api.shortCut(shortCut.search, 'search')
    window.api.shortCut(shortCut.config, 'config')

    // 初始化存储数据
    window.api.initTable()

    // 更新存储信息
    window.api.on('update-databaseDirectory', (configPath) => {
      setConfig({ ...config, databaseDirectory: configPath as string });
    })

  }, [config, theme])


  return (
    <main className="relative" ref={mainRef}>
      <Error />
      <Search />
    </main>
  )
}

export default Home
