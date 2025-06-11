import type { ReactElement } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Image } from "@heroui/react";
import logo from "/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@context/Authentication";
import UserMenu from "@components/UserMenu/UserMenu";
import { allRoutes, getRootPage, Routes } from "@core/utils";

export default function Navigation() {
  const navigate = useNavigate();
  const auth = useAuth();

  function AuthButtons(): ReactElement {
    return (
      <>
        <NavbarItem className="lg:flex">
          <Button onPress={() => navigate(allRoutes[Routes.LOGIN])} variant="light" color="primary">Login</Button>
        </NavbarItem>
        <NavbarItem>
          <Button onPress={() => navigate(allRoutes[Routes.CREATE_RESERVATION])} variant="solid" color="primary">Reserve a table</Button>
        </NavbarItem>
      </>
    )
  }

  function LogoLink ({ url }: { url: string }): ReactElement {
    return (
      <Link to={url}>
        <Image src={logo} className="max-w-[150px] px-4 max-h-[32px]" />
      </Link>
    )
  }

  return (
    <Navbar maxWidth="2xl" position="sticky" isBordered className="bg-transparent">
      <NavbarBrand>
          <LogoLink url={getRootPage(auth?.user?.userRole)} />
      </NavbarBrand>
      <NavbarContent justify="end">
        {auth?.user && auth.token ? <UserMenu user={auth.user} /> : <AuthButtons />}
      </NavbarContent>
    </Navbar>
  );
}
