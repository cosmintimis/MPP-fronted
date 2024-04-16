import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'
import MasterPage from './pages/master-page'
import AddUserPage from './pages/add-user-page';
import UpdateUserPage from './pages/update-user-page';
import UserStoreContext from './store/users';
import { Product, User, UserListWithSize } from './constants/user';
import { useEffect, useState } from 'react';
import CheckInternetConnection from './components/ui/checkInternetConnection';
import AddEditProductPage from './pages/add-edit-product-page';
import { addProduct } from './api/products';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MasterPage />
  },
  {
    path: "/update/:userId",
    element: <UpdateUserPage />
  },
  {
    path: "/addUser",
    element: <AddUserPage />
  },
  {
    path: "/addEditProduct/:productId?",
    element: <AddEditProductPage />
  }
]);
type Props = {
  api: {
    addUser: (user: Omit<User, 'id'>) => Promise<User>,
    deleteUser: (userId: number) => Promise<void>,
    updateUser: (user: User) => Promise<User>,
    getUsers: (sortedByUsername: string, searchByUsername: string, limit: number, skip: number, startBirthDate: string, endBirthDate: string) => Promise<UserListWithSize>,
    getUser: (userId: number) => Promise<User>,
    getBirthsPerYear: () => Promise<{ [key: string]: number }>,
    addProduct: (product: Omit<Product, 'id'>, userId: number) => Promise<Product>,
    deleteProduct: (productId: number) => Promise<void>,
    updateProduct: (product: Product) => Promise<Product>
  }
}
function App({ api }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [birthsPerYear, setBirthsPerYear] = useState<{ [key: string]: number }>({});
  const [sortedByUsername, setSortedByUsername] = useState<string>('');
  const [searchByUsername, setSearchByUsername] = useState<string>('');
  const [limit, setLimit] = useState<number>(5);
  const [skip, setSkip] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [serverStatus, setServerStatus] = useState("Online");
  const [startBirthDate, setStartBirthDate] = useState<Date | undefined>();
  const [endBirthDate, setEndBirthDate] = useState<Date | undefined>();
  const [selectedUserId, setSelectedUserId] = useState(-1);
  async function fetchUsers() {

    if(startBirthDate === undefined || endBirthDate === undefined){

      const UserListWithSize = await api.getUsers(sortedByUsername, searchByUsername, limit, skip, '', '');
      setUsers(UserListWithSize.users);
      setSize(UserListWithSize.size);
    }
    else{

      const UserListWithSize = await api.getUsers(sortedByUsername, searchByUsername, limit, skip, startBirthDate.toISOString().split('T')[0], endBirthDate.toISOString().split('T')[0]);
      setUsers(UserListWithSize.users);
      setSize(UserListWithSize.size);

    }
  }

  async function fetchBirthsPerYear() {
    const birthsPerYear = await api.getBirthsPerYear();
    setBirthsPerYear(birthsPerYear);
  }



  useEffect(() => {
    fetchUsers();
  }, [sortedByUsername, searchByUsername, limit, skip, serverStatus, startBirthDate, endBirthDate]);

  useEffect(() => {
    fetchBirthsPerYear();
  }, [size, serverStatus]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('http://localhost:8080/api/health-check');
        if (serverStatus === "Offline") {
          setServerStatus("Online");
        }
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
    startBirthDate: startBirthDate,
    endBirthDate: endBirthDate,
    selectedUserId: selectedUserId,
    addUser: async (user: Omit<User, 'id'>) => {
      const userSaved = await api.addUser(user);
      setUsers([...users, userSaved]);
      setSize(size + 1);
      fetchUsers();
    },
    deleteUser: async (userId: number) => {
      await api.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setSize(size - 1);
      fetchUsers();
    },
    updateUser: async (user: User) => {
      await api.updateUser(user);
      fetchBirthsPerYear();
      setUsers(users.map(u => u.id === user.id ? user : u));
      fetchUsers();
    },
    getUser: api.getUser,
    setSortedByUsername: setSortedByUsername,
    setSearchByUsername: setSearchByUsername,
    setLimit: setLimit,
    setSkip: setSkip,
    setStartBirthDate: setStartBirthDate,
    setEndBirthDate: setEndBirthDate,
    setSelectedUserId: setSelectedUserId,
    addProduct: async (product: Omit<Product, 'id'>, userId: number) => {
      await api.addProduct(product, userId);
      fetchUsers();
    },
    deleteProduct: async (productId: number) => {
      await api.deleteProduct(productId);
      fetchUsers();
    },
    updateProduct: async (product: Product) => {
      await api.updateProduct(product);
      fetchUsers();
    }
  }
  return (
    <>
      {/* <CheckInternetConnection> */}
        <UserStoreContext.Provider value={userStore}>
          {serverStatus === "Offline" ? <div className="flex w-full h-[100vh] text-white bg-black justify-center items-center">Server is offline. Please check your server connection.</div> :
            <RouterProvider router={router} />
          }
        </UserStoreContext.Provider>
      {/* </CheckInternetConnection> */}
    </>
  )
}

export default App
