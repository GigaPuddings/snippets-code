import { useCallback, useEffect } from 'react'
import { useStore } from '@renderer/store/useStore'
import useSearch from '@renderer/hooks/useSearch'

export default (containerRef: React.RefObject<HTMLDivElement>) => {
  const { data, id, setId } = useStore((state) => state)
  const { clearSearchState } = useSearch()

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
          selectItem('enter', data[newIndex], index)
          break
        case 'Escape':
          window.api.hideWindow('search')
          break
      }

      // 只有在索引变化时才进行滚动
      if (newIndex !== index && containerRef.current) {
        const targetItem = containerRef.current.children[newIndex]
        const { top, bottom } = targetItem.getBoundingClientRect()
        const { top: containerTop, bottom: containerBottom } =
          containerRef.current.getBoundingClientRect()

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
  async function selectItem(_type: 'click' | 'enter', item: ContentType, _index: number) {
    try {
      setId(item.id) // 选中状态

      if (item.searchType === 'window') {
        window.api.openApp(item.content)
        window.api.hideWindow('search')
        clearSearchState()
        return
      }

      // 非窗口类型处理逻辑
      // if (type === 'click') {
      //   window.api.showPreviewWindow(item, index)
      // } else if (type === 'enter') {
      //   await navigator.clipboard.writeText(item.content)
      //   clearSearchState()
      // }
      await navigator.clipboard.writeText(item.content)
      window.api.hideWindow('search')
      clearSearchState()
    } catch (error) {
      console.error('Error handling selectItem:', error)
    }
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
