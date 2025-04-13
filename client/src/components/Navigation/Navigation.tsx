import type { ReactElement } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Image } from "@heroui/react";
import logo from "/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@context/Authentication";
import UserMenu from "@components/UserMenu/UserMenu";
import ModeratorOnly from "@components/AuthorizationWrappers/ModeratorOnly";
import ClientOnly from "@components/AuthorizationWrappers/ClientOnly";
import NotAuthenticatedOnly from "@components/AuthorizationWrappers/NotAuthenticatedOnly";

export default function Navigation() {
  const navigate = useNavigate();
  const auth = useAuth();

  function AuthButtons(): ReactElement {
    return (
      <>
        <NavbarItem className="lg:flex">
          <Button onPress={() => navigate("/login")} variant="light" color="primary">Login</Button>
        </NavbarItem>
        <NavbarItem>
          <Button onPress={() => navigate("/create-reservation")} variant="solid" color="primary">Reserve a table</Button>
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
        <NotAuthenticatedOnly>
          <LogoLink url="/create-reservation" />
        </NotAuthenticatedOnly>

        <ModeratorOnly>
          <LogoLink url="/" />
        </ModeratorOnly>

        <ClientOnly>
          <LogoLink url="/client-settings" />
        </ClientOnly>

      </NavbarBrand>
      <NavbarContent justify="end">
        {auth?.user && auth.token ? <UserMenu user={auth.user} /> : <AuthButtons />}
      </NavbarContent>
    </Navbar>
  );
}
