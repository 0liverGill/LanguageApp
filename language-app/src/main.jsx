import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TextReader from './TextReader.jsx'

import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
{path:"/",element:<App/>},
{path:"/textReader/:id/:page/:game",element:<TextReader/>},
//{path:"/dashboard",element: <Dashboard />},
//{path:"/about",element:<About />},,
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

