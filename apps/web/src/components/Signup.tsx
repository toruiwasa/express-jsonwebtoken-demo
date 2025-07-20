import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { TypographyH2 } from "./ui/typographyH2";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await (
      await fetch("https://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
    ).json();

    if (!result.error) {
      toast.success("User created. Please Login!");
      console.log(result.message);
      navigate("/");
    } else {
      toast.error("Sign up failed.", {
        description: result.error,
      });
      console.error(result.error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.name === "email") {
      setEmail(e.currentTarget.value);
    } else {
      setPassword(e.currentTarget.value);
    }
  };

  return (
    <Card className="w-full max-w-sm place-self-center">
      <CardHeader>
        <TypographyH2 className="border-b-0">Sign up</TypographyH2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
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
              <Label>Password</Label>
              <Input
                value={password}
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Sign up
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Signup;
