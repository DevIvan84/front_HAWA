import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import Products from './views/Products'
import NewProduct  from './views/NewProduct'
import Trucks from './views/Trucks'


export const router = createBrowserRouter([
    {
        path:'/',
        element: <Layout />,
        children: [
            {   
                index: true,
                element: <Products/>
            },
            {
                path: 'productos/nuevo',
                element: <NewProduct />
            },
            {
                path:'trucks/lista',
                element: <Trucks/>
            }
        ]
    }
])