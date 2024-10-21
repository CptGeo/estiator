import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link, Image } from "@nextui-org/react";
import logo from "../../assets/images/logo.png";

export default function Navigation() {
  return (
    <Navbar maxWidth="2xl" position="sticky" isBordered className="bg-transparent">
      <NavbarBrand>
        <Image src={logo} className="max-w-[150px] px-4" />
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem className="lg:flex">
          <Link href="/" className="text-slate-700 cursor-pointer">Home</Link>
        </NavbarItem>
        <NavbarItem className="lg:flex">
          <Link href="/playground" className="text-slate-700 cursor-pointer">Playground</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="lg:flex">
          <Button onClick={() => alert("Login")} variant="light" color="primary">Login</Button>
        </NavbarItem>
        <NavbarItem>
          <Button onClick={() => alert("Register")} variant="solid" color="primary">Register</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
