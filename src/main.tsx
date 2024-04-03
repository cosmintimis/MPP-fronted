import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { addUser, deleteUser, getUser, getUsers, updateUser } from './api/users';
import React from 'react';

const api = {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App api={api} />
  </React.StrictMode>
);

