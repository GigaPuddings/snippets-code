import React from "react";
import { Outlet } from "react-router-dom";
// 右击菜单
import { MantineProvider } from '@mantine/core';
import { ContextMenuProvider } from 'mantine-contextmenu';
import { useStore } from "@renderer/store/useStore";

const Layout: React.FC = () => {
  const theme = useStore(state => state.theme)
  return (
    <div>
      <MantineProvider defaultColorScheme={theme}>
        <ContextMenuProvider>
            <Outlet />
        </ContextMenuProvider>
      </MantineProvider>
    </div>
  )
}

export default Layout;
