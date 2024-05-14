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


let fakeId = -1;
let newUsersToBeAdded = [] as User[];
let usersThatNeedToBeUpdated = [] as User[];
let usersThatNeedToBeDeleted = [] as number[];
let chartData = {} as { [key: string]: number };

type Props = {
  api: {
    addUser: (user: Omit<User, 'id'>) => Promise<User>,
    deleteUser: (userId: number) => Promise<void>,
    updateUser: (user: User) => Promise<User>,
    getUsers: (sortedByUsername: string, searchByUsername: string, pageSize: number, currentPage: number, startBirthDate: string, endBirthDate: string) => Promise<UserListWithSize>,
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
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [serverStatus, setServerStatus] = useState("Online");
  const [startBirthDate, setStartBirthDate] = useState<Date | undefined>();
  const [endBirthDate, setEndBirthDate] = useState<Date | undefined>();
  const [selectedUserId, setSelectedUserId] = useState(-1);

  async function fetchUsers() {

    if(startBirthDate === undefined || endBirthDate === undefined){

      const UserListWithSize = await api.getUsers(sortedByUsername, searchByUsername, pageSize, currentPage, '', '');
      setUsers(UserListWithSize.users);
      setSize(UserListWithSize.size);
    }
    else{

      const UserListWithSize = await api.getUsers(sortedByUsername, searchByUsername, pageSize, currentPage, startBirthDate.toISOString().split('T')[0], endBirthDate.toISOString().split('T')[0]);
      setUsers(UserListWithSize.users);
      setSize(UserListWithSize.size);

    }
  }

  async function fetchBirthsPerYear() {
    if(serverStatus === "Offline"){

      const charDataUpdated = {...chartData};

      for(let i = 0; i < usersThatNeedToBeDeleted.length; i++){
        const userId = usersThatNeedToBeDeleted[i];
        const user = users.find(u => u.id === userId);
        if(!user) continue;
        const birthYear = user.birthdate.getFullYear().toString();
        if(charDataUpdated[birthYear] > 1){
          charDataUpdated[birthYear] -= 1;
        }
        else{
          delete charDataUpdated[birthYear];
        }
      }

      for(let i = 0; i < newUsersToBeAdded.length; i++){
        const user = newUsersToBeAdded[i];
        const birthYear = user.birthdate.getFullYear().toString();
        if(charDataUpdated[birthYear]){
          charDataUpdated[birthYear] += 1;
        }
        else{
          charDataUpdated[birthYear] = 1;
        }
      }

      setBirthsPerYear(charDataUpdated);
    }
    else{
      const birthsPerYear = await api.getBirthsPerYear();
      setBirthsPerYear(birthsPerYear);

      chartData = {...birthsPerYear};

    }
  }



  useEffect(() => {
    fetchUsers();
  }, [sortedByUsername, searchByUsername, pageSize, currentPage, serverStatus, startBirthDate, endBirthDate]);

  useEffect(() => {
    fetchBirthsPerYear();
  }, [size, serverStatus]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('http://localhost:8080/api/health-check');
        if (serverStatus === "Offline") {
          setServerStatus("Online");
          await syncData();
          fetchUsers();
        }
      } catch (error) {
        setServerStatus("Offline");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [serverStatus]);

 

  useEffect(() => {

    // const socket = new WebSocket('ws://localhost:8080/websocket-broadcaster');
    
    // socket.onopen = () => {
    //   console.log('open');
    // };

    // socket.onmessage = (e: MessageEvent) => {
    //   fetchBirthsPerYear();
    // }

    // socket.onclose = () => {
    //   console.log('close');
    // }

  },[serverStatus]);


 async function syncData(){
      for(let i = 0; i < newUsersToBeAdded.length; i++){
        await api.addUser(newUsersToBeAdded[i]);
      }
      for(let i = 0; i < usersThatNeedToBeUpdated.length; i++){
        await api.updateUser(usersThatNeedToBeUpdated[i]);
      }
      for(let i = 0; i < usersThatNeedToBeDeleted.length; i++){
        await api.deleteUser(usersThatNeedToBeDeleted[i]);
      }
      newUsersToBeAdded = [];
      usersThatNeedToBeUpdated = [];
      usersThatNeedToBeDeleted = [];
    
  }

  const userStore = {
    users: users,
    size: size,
    birthsPerYear: birthsPerYear,
    sortedByUsername: sortedByUsername,
    searchByUsername: searchByUsername,
    pageSize: pageSize,
    currentPage: currentPage,
    startBirthDate: startBirthDate,
    endBirthDate: endBirthDate,
    selectedUserId: selectedUserId,
    addUser: async (user: Omit<User, 'id'>) => {
      if(serverStatus === "Offline"){
      const newUser = {...user, id: fakeId};
      fakeId = fakeId - 1;
      setUsers([...users, newUser]);
      newUsersToBeAdded.push(newUser);
      fetchBirthsPerYear();
      }else
      { 
        const userSaved = await api.addUser(user);
        setUsers([...users, userSaved]);
        setSize(size + 1);
        fetchUsers();}
    },
    deleteUser: async (userId: number) => {
     if(serverStatus === "Offline"){
      setUsers(users.filter(u => u.id !== userId));
      if(userId > 0)
        usersThatNeedToBeDeleted.push(userId); 
      else{
        newUsersToBeAdded = newUsersToBeAdded.filter(u => u.id !== userId);
      }
      fetchBirthsPerYear();
     }
     else{
        await api.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        setSize(size - 1);
        fetchUsers();
     }
    },
    updateUser: async (user: User) => {
      if(serverStatus === "Offline"){
        const userIndex = users.findIndex(u => u.id === user.id);
        if(user.id > 0)
          {
            usersThatNeedToBeUpdated.push(user);

            if(user.birthdate != users[userIndex].birthdate){
              const birthYear = user.birthdate.getFullYear().toString();
              const oldBirthYear = users[userIndex].birthdate.getFullYear().toString();
              if(chartData[birthYear]){
                chartData[birthYear] += 1;
              }
              else{
                chartData[birthYear] = 1;
              }
              if(chartData[oldBirthYear]){
                chartData[oldBirthYear] -= 1;
              }
              else{
                delete chartData[oldBirthYear];
              }
            }
          }
        const newUsers = [...users];
        newUsers[userIndex] = user;
        setUsers(newUsers);
        newUsersToBeAdded = newUsersToBeAdded.map(u => u.id === user.id ? user : u);
    
        fetchBirthsPerYear();
      }
      else{
        await api.updateUser(user);
        fetchBirthsPerYear();
        setUsers(users.map(u => u.id === user.id ? user : u));
        fetchUsers();
      }
    },
    getUser: api.getUser,
    setSortedByUsername: setSortedByUsername,
    setSearchByUsername: setSearchByUsername,
    setPageSize: setPageSize,
    setCurrentPage: setCurrentPage,
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
      <CheckInternetConnection>
        <UserStoreContext.Provider value={userStore}>
          {/* {serverStatus === "Offline" ? <div className="flex w-full h-[100vh] text-white bg-black justify-center items-center">Server is offline. Please check your server connection.</div> :  }*/}
            <RouterProvider router={router} />
        </UserStoreContext.Provider>
      </CheckInternetConnection>
    </>
  )
}

export default App
