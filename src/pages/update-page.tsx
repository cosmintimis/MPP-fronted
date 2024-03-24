import React from "react";
import { Link, useParams } from "react-router-dom";
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
import { SparklesCore } from "@/components/ui/sparkles";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { displayAlert } from "@/components/ui/custom-alert";


export default function UpdatePage() {
    const { userId } = useParams<{ userId: string }>();


    const user = USERS.find((user) => (user.userId).toString() === userId);

    const [date, setDate] = React.useState<Date | undefined>(user?.birthdate);


    const formSchema = z.object({
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
            username: user?.username,
            email: user?.email,
            password: user?.password,
            avatar: user?.avatar,
            birthdate: user?.birthdate,
            rating: user?.rating,
            address: user?.address,
        },
    });

    function updateEntity(values: z.infer<typeof formSchema>) {
        const alertContainer = document.getElementById("alert-container"); 
        const index = USERS.findIndex((user) => (user.userId).toString() === userId);
        if (index === -1) {
            return;
        }

        if (
            values.username === "" ||
            values.email === "" ||
            values.password === "" ||
            typeof values.birthdate === 'undefined' ||
            !(Number(values.rating) === values.rating && values.rating % 1 !== 0) ||
            values.address === ""
        ) {
            if (alertContainer) {
                displayAlert(alertContainer, "warning", "Please fill all the fields");
                }
            return;
        }
       
        USERS[index] = {
            ...USERS[index],
            ...values,
        };
    
        if(alertContainer){
            displayAlert(alertContainer, "success", "User updated successfully");
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
                        className="w-full h-full"
                        particleColor="#FFFFFF"
                    />
                </div>
                <div id="alert-container"></div>
                <div className="flex justify-center z-10">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(updateEntity)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">Username</FormLabel>
                                        <FormControl className="w-80">
                                            <Input data-testid="input-username-update" placeholder="..." {...field} />
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
                                            <Input data-testid="input-email-update" placeholder="..." {...field} />
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
                                            <Input    
                                            data-testid="input-password-update"  placeholder="..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white" >Avatar</FormLabel>
                                        <FormControl>
                                            <Input data-testid="input-avatar-update" placeholder="..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="birthdate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-start text-white">Birthdate</FormLabel>
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
                                                <PopoverContent className="w-auto p-0">
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
                                            <Input
                                            type="number" data-testid="input-grade-update"  placeholder="..." {...field} />
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
                                            <Input data-testid="input-address-update" placeholder="..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button data-testid="submit-update-btn" type="submit" variant={"adding"}>
                                <UpdateIcon className="w-5 h-5 mr-1" />
                                Update
                            </Button>
                            <Link to={"/"} data-testid="link-home-page" className="text-white underline mt-4 pl-20">Back to home</Link>
                        </form>
                    </Form>
                   
                </div>
            </div>
        </>
    );


};