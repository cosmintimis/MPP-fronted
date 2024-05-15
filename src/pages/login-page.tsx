import { login } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/users";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function LoginPage() {
  let navigate: NavigateFunction = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useUserStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated]);

  async function handleLogin() {

    try {
      await login(username, password);
      setIsAuthenticated(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid username or password",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-[100vh] flex-col">
      <div className="h-[500px]">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your username below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="username"
                type="username"
                required
                onChange={(e) => setUsername(e.target.value)}
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
          </CardContent>
          <CardFooter>
            <div className="flex flex-col w-full">
              <Button onClick={handleLogin}> Sign in</Button>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline">
                  Sign up
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
