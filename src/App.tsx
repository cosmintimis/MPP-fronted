import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'
import MasterPage from './pages/master-page'
import AddUserPage from './pages/add-user-page';
import UpdatePage from './pages/update-page';
import UserStoreContext from './store/users';
import { User } from './constants/user';
import { useEffect, useState } from 'react';

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
type Props= {
  api: {
    addUser: (user: Omit<User, 'id'>) => Promise<User>,
    deleteUser: (userId: number) => Promise<void>,
    updateUser: (user: User) => Promise<User>,
    getUsers: (flag: string) => Promise<User[]>,
    getUser: (userId: number) => Promise<User>,
  }
}
function App({api}: Props) {
  const [users, setUsers] = useState<User[]>([])
  const[flag, setFlag] = useState<string>("false");
  async function fetchUsers() {
    const users = await api.getUsers(flag);
    setUsers(users);
    console.log(users);
  }
  useEffect(() => {
    fetchUsers();
  }, [flag]);

  
  const userStore = {
    users: users,
    flag: flag,
    addUser: async (user: Omit<User, 'id'>) => {
      const userSaved = await api.addUser(user);
      setUsers([...users, userSaved]);

    },
    deleteUser: async (userId: number) => {
      await api.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    },
    updateUser: async (user: User) => {
      await api.updateUser(user);
      setUsers(users.map(u => u.id === user.id ? user : u));
    },
    getUser: api.getUser,
    changeFlag: async (flag: string) => {
      setFlag(flag);
    }
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
