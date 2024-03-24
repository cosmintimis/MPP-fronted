import React from "react";
import { USERS } from "@/constants/user";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { SparklesCore } from "@/components/ui/sparkles";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { displayAlert } from "@/components/ui/custom-alert";

export default function AddUserPage() {

    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const formSchema = z.object({
        userId: z.coerce.number(),
        username: z.string(),
        email: z.string(),
        password: z.string(),
        avatar: z.string(),
        birthdate: z.date(),
        rating: z.coerce.number(),
        address: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: 0,
            username: "",
            email: "",
            password: "",
            avatar: "",
            birthdate: new Date(),
            rating: 0.1,
            address: "",

        },
    });

    function addEntity(values: z.infer<typeof formSchema>) {
        const alertContainer = document.getElementById("alert-container");
        const userExists = USERS.find((user) => user.userId === values.userId);
        if (userExists) {
            if (alertContainer) {
                displayAlert(alertContainer, "error", "User already exists");
            }
            return;
        }

        if (
            values.userId < 1 ||
            !(Number(values.userId) === values.userId && values.userId % 1 === 0) ||
            values.username === "" ||
            values.email === "" ||
            values.password === "" ||
            values.avatar === "" ||
            typeof values.birthdate === 'undefined' || (!values.birthdate) ||
            !(Number(values.rating) === values.rating && values.rating % 1 !== 0) ||
            values.address === ""
        ) {
            if (alertContainer) {
            displayAlert(alertContainer, "warning", "Please fill all the fields");
            }
            return;
        }

        USERS.push({
            ...values,
        });
        if(alertContainer){
            displayAlert(alertContainer, "success", "User added successfully");
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
                        <form onSubmit={form.handleSubmit(addEntity)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="userId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">ID</FormLabel>
                                        <FormControl className="w-80">
                                            <Input data-testid="input-userid" placeholder="..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">Username</FormLabel>
                                        <FormControl className="w-80">
                                            <Input data-testid="input-username" placeholder="..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">Email</FormLabel>
                                        <FormControl>
                                            <Input data-testid="input-email" placeholder="..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">Password</FormLabel>
                                        <FormControl>
                                            <Input data-testid="input-password" placeholder="..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">Avatar</FormLabel>
                                        <FormControl>
                                            <Input data-testid="input-avatar" placeholder="..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="birthdate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white text-white">Birthdate</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button

                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[320px] justify-start text-left font-normal",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent  className="w-auto p-0">
                                                    <Calendar
                                                    
                                                        initialFocus
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            setDate(date);
                                                            if (date) {
                                                                field.onChange(date)
                                                            }
                                                        }
                                                        }
                                                        weekStartsOn={1}

                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">Rating</FormLabel>
                                        <FormControl>
                                            <Input data-testid="input-grade" placeholder="..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">Address</FormLabel>
                                        <FormControl>
                                            <Input data-testid="input-address" placeholder="..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                data-testid="submit-add-btn"
                                className="bg-green-500 hover:bg-green-600 px-10"
                                type="submit"
                            >
                                <PlusCircledIcon className="w-6 h-6 mr-1" />
                                Add
                            </Button>
                            <Link to={"/"} data-testid="link-home-page" className="text-white underline mt-4 pl-20">Back to home</Link>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
};