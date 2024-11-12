import { Outlet } from 'react-router-dom'
import '@mantine/core/styles.layer.css';
import 'mantine-contextmenu/styles.layer.css';
import { Suspense } from 'react';
import Loading from '@renderer/pages/Layout/Loading'

function Config() {
  return (
    <>
      <Suspense fallback={<Loading />}>
          <Outlet />
      </Suspense>
    </>

  )
}

export default Config
