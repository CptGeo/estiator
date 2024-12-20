import type { ReactElement } from "react";
import { Image } from "@nextui-org/react";
import logo from "@assets/images/logo.png";

export default function Footer(): ReactElement {
  return (
    <footer className="bg-gray-700 mt-5">
      <div className="p-3 container mx-auto">
        <div className="flex gap-7 items-center">
            <div className="border-r-1 border-slate-500">
              <Image src={logo} className="pl-3 pr-5 py-2 bg-none max-w-[200px]" />
            </div>
            <p className="drop-shadow-lg text-center text-slate-400 tracking-wider">Copyright © 2024 Estiator.io. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
