import { useEffect } from "react";
import { NavLink } from "react-router";
import { useUser } from "../contexts/UserContext";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";

export type NavigationProps = {
  className: string;
  logOutCallback: () => void;
};

const Navigation = ({ logOutCallback, className }: NavigationProps) => {
  const [user] = useUser();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <header className={cn("bg-background p-2", className)}>
      <div className="flex justify-between">
        <div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink to="/">Home</NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink to="/protected">Protected</NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {user ? null : (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <NavLink to="/signup">Sign up</NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {user ? (
          <div>
            <Button variant="outline" onClick={logOutCallback}>
              Log Out
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navigation;
