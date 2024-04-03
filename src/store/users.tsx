import { User } from "@/constants/user";
import { createContext, useContext } from "react";

type UserStore = {
    users: User[];
    addUser: (user: Omit<User, 'id'>) => Promise<void>;
    deleteUser: (userId: number) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    getUser: (userId: number) => Promise<User | undefined>;
    flag: string;
    changeFlag: (flag: string) => Promise<void>;
}
const UserStoreContext = createContext<UserStore>({
    users: [],
    flag: "false",
    addUser: async () => { },
    deleteUser: async () => { },
    updateUser: async () => { },
    getUser: async () => ({} as User),
    changeFlag: async () => { }
    
});

export default UserStoreContext;

export const useUserStore = () => {
    return useContext(UserStoreContext);
}

