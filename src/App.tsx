import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'
import MasterPage from './pages/master-page'
import AddUserPage from './pages/add-user-page';
import UpdatePage from './pages/update-page';
import UserStoreContext from './store/users';
import { USERS, User } from './constants/user';
import { useState } from 'react';



const router = createBrowserRouter([
  {
    path: '/',
    element: <MasterPage />
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
function App() {
  const [users, setUsers] = useState<User[]>(USERS)

  async function addUser(user: Omit<User, 'id'>): Promise<User> {
    const savedUser = { id: users.length + 1, ...user }
    setUsers([...users, savedUser])
    return savedUser
  }
  async function deleteUser(userId: number) {
    setUsers(users.filter(user => user.id !== userId))
  }
  async function updateUser(user: User) {
    setUsers(users.map(u => u.id === user.id ? user : u))
    return user;
  }
  async function getUser(userId: number) {
    return users.find(user => user.id === userId)
  }

  const userStore = {
    users: users,
    addUser,
    deleteUser,
    updateUser,
    getUser,
  }
  return (
    <>
      <UserStoreContext.Provider value={userStore}>
        <RouterProvider router={router} />
      </UserStoreContext.Provider>
    </>
  )
}

export default App
