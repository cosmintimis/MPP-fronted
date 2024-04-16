import { Product } from "@/constants/user";
import axios from "axios";



const BASE_URL = 'http://localhost:8080';

async function addProduct(product: Omit<Product, 'id'>, userId: number): Promise<Product> {
    await axios(`${BASE_URL}/api/products?userId=${userId}`, { method: 'POST', data: product });
    return product as Product;
}
async function deleteProduct(productId: number) {
    await axios(`${BASE_URL}/api/products/${productId}`, { method: 'DELETE' });
}
async function updateProduct(product: Product): Promise<Product> {
    await axios(`${BASE_URL}/api/products/${product.id}`, { method: 'PUT', data: product });
    return product;
}

export {
    addProduct,
    deleteProduct,
    updateProduct,
}