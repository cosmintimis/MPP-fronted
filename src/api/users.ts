import { User, UserListWithSize } from "@/constants/user";
import axios from "axios";

const BASE_URL = 'http://localhost:8080';

async function getUsers(sortedByUsername: string, searchByUsername: string, pageSize: number, currentPage: number, startBirthDate: string, endBirthDate: string ): Promise<UserListWithSize> {
    const response = await axios(`${BASE_URL}/api/users?sortedByUsername=${sortedByUsername}&searchByUsername=${searchByUsername}&pageSize=${pageSize}&currentPage=${currentPage}&startBirthDate=${startBirthDate}&endBirthDate=${endBirthDate}`, { method: 'GET',  headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    } });
    const users = response.data.users.map((user: any) => {
        return {
            ...user,
            birthdate: new Date(user.birthdate)
        }
    }
    );
    const size = response.data.size;
    return { users, size };
}

async function checkServerStatus(): Promise<boolean> {
    try {
        await axios(`${BASE_URL}/api/health-check`, { method: 'GET' });
        return true;
    } catch (error) {
        return false;
    }

}

async function getBirthsPerYear(): Promise<{[key: string] : number}> {
    const response = await axios(`${BASE_URL}/api/users/births-per-year`, { method: 'GET',  headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    } });
    return response.data;
}

async function addUser(user: Omit<User, 'id'>): Promise<User> {
    await axios(`${BASE_URL}/api/users`, { method: 'POST', data: user,  headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    } });
    return user as User;
}
async function deleteUser(userId: number) {
    await axios(`${BASE_URL}/api/users/${userId}`, { method: 'DELETE',  headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    } });
}
async function updateUser(user: User): Promise<User> {
    await axios(`${BASE_URL}/api/users/${user.id}`, { method: 'PUT', data: user,  headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    } });
    return user;
}
async function getUser(userId: number): Promise<User> {
    const response = await axios(`${BASE_URL}/api/users/${userId}`, { method: 'GET',  headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    } });
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
    getUsers,
    getBirthsPerYear,
    checkServerStatus
}