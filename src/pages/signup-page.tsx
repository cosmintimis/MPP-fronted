
import { signup } from "@/api/auth"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Swal from "sweetalert2";
import { useEffect, useState } from "react"
import { Link, useNavigate, NavigateFunction } from "react-router-dom"
import { useUserStore } from "@/store/users"

export function SignupPage() {
    let navigate: NavigateFunction = useNavigate();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { isAuthenticated } = useUserStore();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home");
        }
    }, [isAuthenticated]);

    async function handleSignup() {
        try {
            if (username === "" || email === "" || password === "") {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please fill out all fields",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }
            await signup(username, email, password);
            navigate("/login");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "try again!",
            });
        }
    }

    return (
        <div className="flex justify-center items-center w-full h-[100vh] flex-col">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="username"
                                placeholder=""
                                required
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleSignup} className="w-full">
                            Create an account
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/">
                            <p className="text-blue-500">Log in</p>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
