import { User } from "@/constants/user";
import axios from "axios";

const BASE_URL = 'https://serverpp.yellowpond-bda2a511.westeurope.azurecontainerapps.io';

export async function login(username: string, password: string): Promise<void> {
    const response = await axios(`${BASE_URL}/api/auth/signin`, { method: 'POST', data: { username, password } });
    const { token, ...user} = response.data;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
   
}

export async function signup(username: string, email: string, password: string): Promise<void> {
    await axios(`${BASE_URL}/api/auth/signup`, { method: 'POST', data: { username, email, password} });
}

export const getCurrentUser = () => {
    const userString = localStorage.getItem('currentUser');
    if(userString){
        const json = JSON.parse(userString);
        const user: User = {
            id: json.id,
            username: json.username,
            email: json.email,
            avatar: json.avatar,
            password: json.password,
            birthdate: new Date(json.birthdate),
            rating: json.rating,
            address: json.address,
            products: json.products,
            roles: json.roles
        }
        return user;
        }
    return undefined;
}
