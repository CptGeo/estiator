import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";

export default function Navigation() {
  return (
    <Navbar className="bg-transparent">
      <NavbarBrand>
        <p className="font-bold text-inherit">estiator.io</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button onClick={() => alert("Login")} variant="light" color="primary">Login</Button>
        </NavbarItem>
        <NavbarItem>
          <Button onClick={() => alert("Register")} variant="solid" color="primary">Register</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
