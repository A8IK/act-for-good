import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import "./index.css";
import SignUp from './components/SignUp/SignUp'
import Login from './components/Login/Login';
import Root from './components/Root/Root/Root';

const router = createBrowserRouter([
  {
    path:'/',
    element: <Root></Root>,
    children: [
      {
        path: '/',
        element: <SignUp></SignUp>
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
    ]
  },
  
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
