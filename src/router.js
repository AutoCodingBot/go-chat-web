import { createBrowserRouter} from 'react-router-dom'


import Login from './chat/Login'
import Panel from './chat/Panel'
import NotFound from './chat/NotFound'


const router = createBrowserRouter([
    // 首页
    {
        path:'/',
        element:<Login/>,
    },

    {
        path:'/login',
        element:<Login/>,
    },

    {
        path:'/panel/:user',
        element:<Panel/>
    },

    //404
    {
        path:'*',
        element:<NotFound/>
    },
    //测试
    // {
    //     path:'test',
    //     element:<Test/>
    // }
])
export default router