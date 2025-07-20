import React, { useEffect, useState, useContext } from "react";
import { useUser } from "../contexts/UserContext";

const Protected = () => {
  const [user] = useUser();
  const [content, setContent] = useState("You need to login");

  useEffect(() => {
    async function fetchProtected() {
      const result = await (
        await fetch("https://localhost:4000/protected", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      if (result.data) setContent(result.data);
    }
    fetchProtected();
  }, [user]);

  return <>{content}</>;
};

export default Protected;
