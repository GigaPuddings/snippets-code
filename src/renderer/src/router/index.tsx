import { ComponentType, lazy } from "react";
import { createHashRouter } from "react-router-dom";
// import Welcome from "@renderer/pages/Welcome";
import Home from "@renderer/pages/Layout/Home";
// import Config from "@renderer/pages/Layout/Config";
// import Preview from "@renderer/pages/Layout/Preview";

const Welcome = lazy((): Promise<{ default: ComponentType<any> }> => {
  return import('@renderer/pages/Welcome')
})
// const Home = lazy((): Promise<{ default: ComponentType<any> }> => {
//   return import('@renderer/pages/Layout/Home')
// })
const Config = lazy((): Promise<{ default: ComponentType<any> }> => {
  return import('@renderer/pages/Layout/Config')
})
const Preview = lazy((): Promise<{ default: ComponentType<any> }> => {
  return import('@renderer/pages/Layout/Preview')
})


const Category = lazy((): Promise<{ default: ComponentType<any> }> => {
  return import('@renderer/pages/Category')
})
const ContentList = lazy((): Promise<{ default: ComponentType<any> }> => {
  return import('@renderer/pages/ContentList')
})
const Content = lazy((): Promise<{ default: ComponentType<any> }> => {
  return import('@renderer/pages/Content')
})
const Setting = lazy((): Promise<{ default: ComponentType<any> }> => {
  return import('@renderer/pages/Setting')
})

// import { Category } from "@renderer/pages/Category";
// import { ContentList } from "@renderer/pages/ContentList";
// import { Content } from "@renderer/pages/Content";
// import { Setting } from "@renderer/pages/Setting";
import Notice from "@renderer/pages/Notice";
import Upgrade from "@renderer/pages/Upgrade";

import CategoryLoader from "@renderer/pages/Category/CategoryLoader";
import ContentListLoader from "@renderer/pages/ContentList/ContentListLoader";
import ContentLoader from "@renderer/pages/Content/ContentLoader";
import ContentAction from "@renderer/pages/Content/ContentAction";
import ContentListAction from "@renderer/pages/ContentList/ContentListAction";
import CategoryAction from "@renderer/pages/Category/CategoryAction";
import Layout from "@renderer/pages/Layout";

// import SettingAction from "@renderer/pages/Setting/SettingAction";
// import SettingLoader from "@renderer/pages/Setting/SettingLoader";


const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'config',
        element: <Config />,
        children: [
          {
            path: 'category',
            loader: CategoryLoader,
            action: CategoryAction,
            element: <Category />,
            children: [
              {
                index: true,
                element: <Welcome />
              },
              {
                path: 'contentList/:cid?/:type?',
                loader: ContentListLoader,
                action: ContentListAction,
                element: <ContentList />,
                children: [
                  {
                    index: true,
                    element: <Welcome />
                  },
                  {
                    path: 'content/:id',
                    loader: ContentLoader,
                    action: ContentAction,
                    element: <Content />
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'setting',
        element: <Setting />
      },
      {
        path: 'preview',
        element: <Preview />
      },
      {
        path: 'notice',
        element: <Notice />
      },
      {
        path: 'upgrade',
        element: <Upgrade />
      }
    ]
  }

])

export default router
