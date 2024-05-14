import { Product, User } from "@/constants/user";
import { createContext, useContext } from "react";

type UserStore = {
    users: User[];
    birthsPerYear: { [key: string]: number };
    size: number;
    sortedByUsername: string;
    searchByUsername: string;
    pageSize: number;
    currentPage: number;
    startBirthDate: Date | undefined;
    endBirthDate: Date | undefined;
    addUser: (user: Omit<User, 'id'>) => Promise<void>;
    deleteUser: (userId: number) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    getUser: (userId: number) => Promise<User | undefined>;
    setSortedByUsername: (sortedByUsername: string) => void;
    setSearchByUsername: (searchByUsername: string) => void;
    setPageSize: (pageSize: number) => void;
    setCurrentPage: (currentPage: number) => void;
    setStartBirthDate: (startBirthDate: Date) => void;
    setEndBirthDate: (endBirthDate: Date) => void;
    selectedUserId: number;
    setSelectedUserId: (selectedUser: number) => void;
    addProduct: (product: Omit<Product, 'id'>, userId: number) => Promise<void>;
    deleteProduct: (productId: number) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
}
const UserStoreContext = createContext<UserStore>({
    users: [],
    size: 0,
    birthsPerYear: {},
    sortedByUsername: '',
    searchByUsername: '',
    pageSize: 0,
    currentPage: 0,
    startBirthDate: undefined,
    endBirthDate: undefined,
    addUser: async () => { },
    deleteUser: async () => { },
    updateUser: async () => { },
    getUser: async () => ({} as User),
    setSortedByUsername: () => { },
    setSearchByUsername: () => { },
    setPageSize: () => { },
    setCurrentPage: () => { },
    setStartBirthDate: () => { },
    setEndBirthDate: () => { },
    selectedUserId: -1,
    setSelectedUserId: () => { },
    addProduct: async () => {},
    deleteProduct: async () => { },
    updateProduct: async () => { },
});

export default UserStoreContext;

export const useUserStore = () => {
    return useContext(UserStoreContext);
}

