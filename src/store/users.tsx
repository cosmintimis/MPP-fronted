import { User } from "@/constants/user";
import { createContext, useContext } from "react";

type UserStore = {
    users: User[];
    addUser: (user: Omit<User, 'id'>) => Promise<User>;
    deleteUser: (userId: number) => Promise<void>;
    updateUser: (user: User) => Promise<User>;
    getUser: (userId: number) => Promise<User | undefined>;
}
const UserStoreContext = createContext<UserStore>({
    users: [],
    addUser: async () => { return {} as User },
    deleteUser: async () => { },
    updateUser: async () => { return {} as User },
    getUser: async () => ({} as User),
});

export default UserStoreContext;

export const useUserStore = () => {
    return useContext(UserStoreContext);
}

