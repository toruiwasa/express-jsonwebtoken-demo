import { Navigate } from "react-router";
import { useUser } from "../contexts/UserContext";
import { TypographyH2 } from "./ui/typographyH2";

const Content = () => {
  const [user] = useUser();
  console.log(user);
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div>
      <TypographyH2>This is the content.</TypographyH2>
    </div>
  );
};

export default Content;
