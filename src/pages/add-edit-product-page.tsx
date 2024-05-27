import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircledIcon, UpdateIcon } from "@radix-ui/react-icons";
import { SparklesCore } from "@/components/ui/sparkles";
import { Link, useParams } from "react-router-dom";
import { displayAlert } from "@/components/ui/custom-alert";
import { useUserStore } from "@/store/users";
import { useEffect } from "react";

export default function AddEditProductPage() {
    const { productId } = useParams<{ productId: string }>();
    const { selectedUserId, users, addProduct, updateProduct } = useUserStore();

    const userIndex = users.findIndex(user => user.id === selectedUserId);


    const formSchema = z.object({
        name: z.string().min(1, { message: 'Avatar is required' }),
        description: z.string().min(1, { message: 'Avatar is required' }),
        price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function updateProductDefault() {
        if (!productId) {
            form.reset({
                name: '',
                description: '',
                price: 0,
            });
        }
        else {
            const productIndex = users[userIndex].products.findIndex(product => product.id === parseInt(productId));
            const product = users[userIndex].products[productIndex];
            form.reset({
                name: product.name,
                description: product.description,
                price: parseFloat(product.price.toFixed(2)),
            });
        }

    }

    useEffect(() => {
        updateProductDefault();
    }, []);

    async function addUpdateEntity(values: z.infer<typeof formSchema>) {
        const alertContainer = document.getElementById("alert-container");


        if (!productId) {
            await addProduct(values, selectedUserId);
        }
        else {
            await updateProduct({
                id: parseInt(productId),
                ...values,
            });
        }

        if (alertContainer) {
            displayAlert(alertContainer, "success", "Successfully!");
        }
    }

    return (
        <>
            <div className="h-[100vh] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
                <div className="w-full absolute inset-0 h-screen z-0">
                    <SparklesCore
                        id="tsparticlesfullpage"
                        background="transparent"
                        minSize={0.6}
                        maxSize={1.4}
                        particleDensity={50}
                        speed={0.2}
                        className="w-full h-full"
                        particleColor="#FFFFFF"
                    />
                </div>
                <div id="alert-container"></div>
                <div className="flex justify-center z-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(addUpdateEntity)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field, }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">Name</FormLabel>
                                        <FormControl className="w-80">
                                            <Input data-testid="input-username" placeholder="..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}

                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">Description</FormLabel>
                                        <FormControl>
                                            <Input data-testid="input-email" placeholder="..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">Price</FormLabel>
                                        <FormControl>
                                            <Input data-testid="input-password" placeholder="..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {productId ?
                                <Button data-testid="submit-update-btn" type="submit" variant={"adding"}>
                                    <UpdateIcon className="w-5 h-5 mr-1" />
                                    Update
                                </Button>
                                : <Button
                                    data-testid="submit-add-btn"
                                    className="bg-green-500 hover:bg-green-600 px-10"
                                    type="submit"
                                >
                                    <PlusCircledIcon className="w-6 h-6 mr-1" />
                                    Add
                                </Button>
                            }
                            <Link to={"/home"} data-testid="link-home-page" className="text-white underline mt-4 pl-20">Back to home</Link>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
};