import { User } from "@/constants/user";
import axios from "axios";

const BASE_URL = 'http://localhost:8080';

async function getUsers(): Promise<User[]> {
    const response = await axios(`${BASE_URL}/api/users`, { method: 'GET' });
    return response.data.map((user: User) => {
        user.birthdate = new Date(user.birthdate);
        return user;
    });
}
async function addUser(user: Omit<User, 'id'>): Promise<User> {
    return {} as User;
}
async function deleteUser(userId: number) {
    await axios(`${BASE_URL}/api/users/${userId}`, { method: 'DELETE' });
}
async function updateUser(user: User): Promise<User> {
    await axios(`${BASE_URL}/api/users/${user.id}`, { method: 'PUT', data: user });
    return user;
}
async function getUser(userId: number): Promise<User> {
    const response = await axios(`${BASE_URL}/api/users/${userId}`, { method: 'GET' });
    const user = {
        ...response.data,
        birthdate: new Date(response.data.birthdate)
    };
    return user;
}



export {
    addUser,
    deleteUser,
    updateUser,
    getUser,
    getUsers
}