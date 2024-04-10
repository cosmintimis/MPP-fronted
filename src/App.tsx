import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'
import MasterPage from './pages/master-page'
import AddUserPage from './pages/add-user-page';
import UpdatePage from './pages/update-page';
import UserStoreContext from './store/users';
import { User, UserListWithSize } from './constants/user';
import { useEffect, useState } from 'react';
import CheckInternetConnection from './components/ui/checkInternetConnection';

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
    getUsers: (sortedByUsername: string, searchByUsername: string, limit: number, skip: number) => Promise<UserListWithSize>,
    getUser: (userId: number) => Promise<User>,
    getBirthsPerYear: () => Promise<{[key: string] : number}>
  }
}
function App({api}: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [birthsPerYear, setBirthsPerYear] = useState<{[key: string] : number}>({});
  const[sortedByUsername, setSortedByUsername] = useState<string>('');
  const[searchByUsername, setSearchByUsername] = useState<string>('');
  const[limit, setLimit] = useState<number>(5);
  const[skip, setSkip] = useState<number>(0);
  const[size, setSize] = useState<number>(0);
  const [serverStatus, setServerStatus] = useState("Online");
  async function fetchUsers() {
    const UserListWithSize = await api.getUsers(sortedByUsername, searchByUsername, limit, skip);
    setUsers(UserListWithSize.users);
    setSize(UserListWithSize.size);
  }

  async function fetchBirthsPerYear() {
    const birthsPerYear = await api.getBirthsPerYear();
    setBirthsPerYear(birthsPerYear);
  }

 

  useEffect(() => {
    fetchUsers();
  }, [sortedByUsername, searchByUsername, limit, skip]);

  useEffect(() => {
    fetchBirthsPerYear();
  }, [size]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('http://localhost:8080/api/health-check');
        setServerStatus("Online");
        fetchUsers();
      } catch (error) {
        setServerStatus("Offline");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [serverStatus]);
  
  const userStore = {
    users: users,
    size: size,
    birthsPerYear: birthsPerYear,
    sortedByUsername: sortedByUsername,
    searchByUsername: searchByUsername,
    limit: limit,
    skip: skip,
    addUser: async (user: Omit<User, 'id'>) => {
      const userSaved = await api.addUser(user);
      setUsers([...users, userSaved]);
      setSize(size + 1);
    },
    deleteUser: async (userId: number) => {
      await api.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setSize(size - 1);
    },
    updateUser: async (user: User) => {
      await api.updateUser(user);
      fetchBirthsPerYear();
      setUsers(users.map(u => u.id === user.id ? user : u));
    },
    getUser: api.getUser,
    setSortedByUsername: setSortedByUsername,
    setSearchByUsername: setSearchByUsername,
    setLimit: setLimit,
    setSkip: setSkip
    }
  return (
    <>
      <CheckInternetConnection>
      <UserStoreContext.Provider value={userStore}>
        {serverStatus === "Offline" ? <div className="flex w-full h-[100vh] text-white bg-black justify-center items-center">Server is offline. Please check your server connection.</div> : 
        <RouterProvider router={router} />
        }
      </UserStoreContext.Provider>
      </CheckInternetConnection>
    </>
  )
}

export default App
