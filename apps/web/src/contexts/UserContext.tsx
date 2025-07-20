import { createContext, useContext, useState } from "react";
import type { User } from "../types/types";

export type UserContextType = [
  User | null | undefined,
  React.Dispatch<React.SetStateAction<User | null | undefined>>,
];

// export const UserContext = React.createContext([]);

const UserContext = createContext<UserContextType>([undefined, () => {}]);

const useUserState = () => {
  return useState<User | null>();
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useUserState();

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error("useUser must be used within UserProvider");
  return userContext;
};
