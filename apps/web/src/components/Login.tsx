import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useUser } from "../contexts/UserContext";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "./ui/typographyH2";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { TypographyP } from "./ui/typographyP";
import { fetchMe } from "@/lib/auth";
import type { User } from "@/types/types";

const Login = () => {
  const [user, setUser] = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("https://localhost:4000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(async (res) => {
        console.log(res);
        if (res.ok) {
          return fetchMe();
        } else {
          const result = await res.json();
          toast.error("Login failed.", { description: result.error });
          console.log(result, res.statusText);
          throw result.error;
        }
      })
      .then((result) => {
        console.log(result);
        toast.success("You are logged in! 🙌");
        setUser(result as User);
        navigate("/");
      });
  };

  useEffect(() => {
    if (user) navigate("/");
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.name === "email") {
      setEmail(e.currentTarget.value);
    } else {
      setPassword(e.currentTarget.value);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <TypographyH2 className="border-b-0">Login</TypographyH2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={password}
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-full" type="submit">
                Login
              </Button>
              <div className="text-center">
                <TypographyP>
                  Don&apos;t have an account?{" "}
                  <NavLink
                    to="/signup"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </NavLink>
                </TypographyP>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;
