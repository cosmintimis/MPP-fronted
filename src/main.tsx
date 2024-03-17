import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import UpdatePage from './pages/update-page.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AddUserPage from './pages/add-user-page.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element : <App />
  },
  {
    path: "/update/:userId",
    element: <UpdatePage />
  },
  {
    path: "/addUser",
    element: <AddUserPage />
  }

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

