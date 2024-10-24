import { Divider, Image } from "@nextui-org/react";
import { ReactElement } from "react";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

export default function Footer(): ReactElement {
  return (
    <footer className="bg-gray-700 mt-5">
      <div className="p-3 container mx-auto">
        <div className="flex gap-7">
            <div className="border-r-1 border-slate-500">
              <Image src={logo} className="pl-3 pr-5 bg-none max-w-[200px]" />
            </div>
            <ul className="list-none">
              <li><Link className="tracking-wider text-slate-200 mb-1" to="/">Home</Link></li>
              <li><Link className="tracking-wider text-slate-200 mb-1" to="/playground">Playground</Link></li>
              <li><Link className="tracking-wider text-slate-200" to="/login">Login</Link></li>
            </ul>
            <ul className="list-none bg-primary" />
            <ul className="list-none bg-primary" />
        </div>
      </div>
      <Divider/>
      <div className="p-2 container mx-auto">
        <div className="drop-shadow-lg text-center text-slate-400 tracking-wider">Copyright © 2024 Estiator.io. All rights reserved.</div>
      </div>
    </footer>
  );
}
