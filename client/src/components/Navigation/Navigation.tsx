import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Image } from "@nextui-org/react";
import logo from "../../assets/images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
export default function Navigation() {
  const navigate = useNavigate();

  return (
    <Navbar maxWidth="2xl" position="sticky" isBordered className="bg-transparent">
      <NavbarBrand>
        <Image src={logo} className="max-w-[150px] px-4" />
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem className="lg:flex">
          <NavLink to="/" className={({isActive}) => `navigation-link ${isActive ? "active" : ""}`}>Home</NavLink>
        </NavbarItem>
        <NavbarItem className="lg:flex">
          <NavLink to="/playground" className="navigation-link">Playground</NavLink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="lg:flex">
          <Button onClick={() => navigate("/login")} variant="light" color="primary">Login</Button>
        </NavbarItem>
        <NavbarItem>
          <Button onClick={() => alert("Register")} variant="solid" color="primary">Register</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
