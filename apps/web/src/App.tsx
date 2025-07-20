import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router";

import Content from "./components/Content";
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Protected from "./components/Protected";
import { UserProvider, useUser } from "./contexts/UserContext";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Main } from "./components/Main";
import { TypographyH1 } from "./components/ui/typographyH1";
import { fetchMe, refreshToken } from "./lib/auth";
import type { User } from "./types/types";

function App() {
  const [user, setUser] = useUser();
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const logOutCallback = async () => {
    const result = await fetch("https://localhost:4000/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user?.id,
      }),
    });
    setUser(null);

    console.log(result);
    toast("You are now logged out. 👋");

    navigate("/");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const res = await refreshToken();
      if (res.ok) {
        await fetchMe().then((result) => {
          setUser(result as User);
          if (!result) navigate("/login");
          else navigate(location.pathname);
        });
      } else {
        navigate("/login");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <div className="h-screen">
      <Navigation className="sticky top-0" logOutCallback={logOutCallback} />
      <Main>
        <TypographyH1>This is JWT Auth Demo! 🔐</TypographyH1>
        {loading ? (
          <></>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/protected" element={<Protected />} />
            <Route path="/" element={<Content />} />
          </Routes>
        )}
      </Main>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
