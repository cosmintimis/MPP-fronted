import { User } from "@/constants/user";
import { createContext, useContext } from "react";

type UserStore = {
    users: User[];
    birthsPerYear: { [key: string]: number };
    size: number;
    sortedByUsername: string;
    searchByUsername: string;
    limit: number;
    skip: number;
    startBirthDate: Date | undefined;
    endBirthDate: Date | undefined;
    addUser: (user: Omit<User, 'id'>) => Promise<void>;
    deleteUser: (userId: number) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    getUser: (userId: number) => Promise<User | undefined>;
    setSortedByUsername: (sortedByUsername: string) => void;
    setSearchByUsername: (searchByUsername: string) => void;
    setLimit: (limit: number) => void;
    setSkip: (skip: number) => void;
    setStartBirthDate: (startBirthDate: Date) => void;
    setEndBirthDate: (endBirthDate: Date) => void;
}
const UserStoreContext = createContext<UserStore>({
    users: [],
    size: 0,
    birthsPerYear: {},
    sortedByUsername: '',
    searchByUsername: '',
    limit: 0,
    skip: 0,
    startBirthDate: undefined,
    endBirthDate: undefined,
    addUser: async () => { },
    deleteUser: async () => { },
    updateUser: async () => { },
    getUser: async () => ({} as User),
    setSortedByUsername: () => { },
    setSearchByUsername: () => { },
    setLimit: () => { },
    setSkip: () => { },
    setStartBirthDate: () => { },
    setEndBirthDate: () => { },
});

export default UserStoreContext;

export const useUserStore = () => {
    return useContext(UserStoreContext);
}

