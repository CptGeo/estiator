import type { ReactElement } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Image } from "@nextui-org/react";
import logo from "@assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/Authentication";
import UserMenu from "@components/UserMenu/UserMenu";

export default function Navigation() {
  const navigate = useNavigate();
  const auth = useAuth();

  function AuthButtons(): ReactElement {
    return (
      <>
        <NavbarItem className="lg:flex">
          <Button onClick={() => navigate("/login")} variant="light" color="primary">Login</Button>
        </NavbarItem>
        <NavbarItem>
          <Button onClick={() => navigate("/register")} variant="solid" color="primary">Register</Button>
        </NavbarItem>
      </>
    )
  }

  return (
    <Navbar maxWidth="2xl" position="sticky" isBordered className="bg-transparent">
      <NavbarBrand>
        <Image src={logo} className="max-w-[150px] px-4 max-h-[32px]" />
      </NavbarBrand>
      <NavbarContent justify="end">
        {auth?.user && auth.token ? <UserMenu user={auth.user} /> : <AuthButtons />}
      </NavbarContent>
    </Navbar>
  );
}
