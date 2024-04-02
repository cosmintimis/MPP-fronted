import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'
import MasterPage from './pages/master-page'
import AddUserPage from './pages/add-user-page';
import UpdatePage from './pages/update-page';
import UserStoreContext from './store/users';
import { USERS, User } from './constants/user';
import { useEffect, useState } from 'react';
import { addUser, deleteUser, getUser, getUsers, updateUser } from './api/users';



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
  const [users, setUsers] = useState<User[]>([])
  async function fetchUsers() {
    const users = await getUsers();
    setUsers(users);
  }
  useEffect(() => {
    fetchUsers();
  }, []);


  const userStore = {
    users: users,
    addUser: async (user: Omit<User, 'id'>) => {
      const userSaved = await addUser(user);
      setUsers([...users, userSaved]);

    },
    deleteUser: async (userId: number) => {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    },
    updateUser: async (user: User) => {
      await updateUser(user);
      setUsers(users.map(u => u.id === user.id ? user : u));
    },
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
