import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { addUser, deleteUser, getUser, getUsers, updateUser, getBirthsPerYear } from './api/users';
import React from 'react';
import { addProduct, deleteProduct, updateProduct } from './api/products.ts';

const api = {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  getBirthsPerYear,
  addProduct,
  deleteProduct,
  updateProduct
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App api={api} />
  </React.StrictMode>
);

