import { useCallback, useEffect } from 'react'
import { useStore } from '@renderer/store/useStore'

export default (containerRef: React.RefObject<HTMLDivElement>) => {
  const { data, setData, setSearch, id, setId } = useStore((state) => state)

  const handleKeyEvent = useCallback(
    (e: KeyboardEvent) => {
      if (data.length === 0) return
      const index = data.findIndex((item) => item.id === id)
      let newIndex = index

      switch (e.code) {
        case 'ArrowUp':
          e.preventDefault()
          newIndex = (index - 1 + data.length) % data.length
          setId(data[newIndex].id)
          break
        case 'ArrowDown':
          e.preventDefault()
          newIndex = (index + 1) % data.length
          setId(data[newIndex].id)
          break
        case 'Enter':
          // 系统已安装程序调起
          if (data[newIndex].searchType === 'window') {
            window.api.openApp(data[newIndex].content)
          }
          selectItem(id)
          break
        case 'Escape':
          window.api.hideWindow('search')
          break
      }

      // 只有在索引变化时才进行滚动
      if (newIndex !== index && containerRef.current) {
        const targetItem = containerRef.current.children[newIndex]
        const { top, bottom } = targetItem.getBoundingClientRect()
        const { top: containerTop, bottom: containerBottom } = containerRef.current.getBoundingClientRect()

        // 检查目标项是否在可见区域内
        if (bottom > containerBottom) {
          containerRef.current.scrollTop += bottom - containerBottom + 10 // 滚动到目标项的底部
        } else if (top < containerTop) {
          containerRef.current.scrollTop -= containerTop - top // 滚动到目标项的顶部
        }
      }
    },
    [data, id]
  )

  // 选中代码行
  async function selectItem(id: number) {
    const content = data.find((item) => item.id === id)?.content
    if (content) await navigator.clipboard.writeText(content)
    setData([])
    setSearch('')
    window.api.hideWindow('search')
  }

  // 键盘事件
  useEffect(() => {
    document.addEventListener('keydown', handleKeyEvent)
    return () => {
      document.removeEventListener('keydown', handleKeyEvent)
    }
  }, [handleKeyEvent])

  // 默认选中第一条
  useEffect(() => {
    setId(data[0]?.id || 0)
  }, [data])

  return { data, id, selectItem }
}
