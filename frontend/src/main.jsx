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
import Profile from './components/Profile/Profile';
import EventsHelp from './components/EventsHelp/EventsHelp';

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
      {
        path: '/profile',
        element: <Profile></Profile>,
      },
      {
        path: '/event',
        element: <EventsHelp></EventsHelp>,
      },
    ]
  },
  
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
