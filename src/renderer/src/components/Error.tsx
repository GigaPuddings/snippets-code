import { useStore } from "@renderer/store/useStore"
import { Alert } from "antd";
import { useEffect } from "react"

function Error() {
  const { error, setError } = useStore(state => state)
  useEffect(() => {
    const id = setTimeout(() => setError(''), 2000);
    return () => clearTimeout(id)
  }, [error])

  if (!error) return <></>

  return (
    <main className="absolute top-0 left-0 z-10 w-full">
      <Alert message={error} type="error" showIcon />
    </main>
  )
}

export default Error
