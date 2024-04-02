import { User } from "@/constants/user";
import { createContext, useContext } from "react";

type UserStore = {
    users: User[];
    addUser: (user: Omit<User, 'id'>) => Promise<void>;
    deleteUser: (userId: number) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    getUser: (userId: number) => Promise<User | undefined>;
}
const UserStoreContext = createContext<UserStore>({
    users: [],
    addUser: async () => { },
    deleteUser: async () => { },
    updateUser: async () => { },
    getUser: async () => ({} as User),
});

export default UserStoreContext;

export const useUserStore = () => {
    return useContext(UserStoreContext);
}

