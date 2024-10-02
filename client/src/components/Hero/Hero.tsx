import { ArrowRightAltOutlined } from "@mui/icons-material";
import { Button } from "@nextui-org/react";
import { ReactElement } from "react";

export default function Hero(): ReactElement {
  return (
    <div className="bg-current">

      <div className="relative isolate px-6 lg:px-8">
        <div className="-z-10 absolute left-0 top-0 w-full h-full bg-gradient-to-tr from-primary-100 to-primary-300">

        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-text-slate-0 sm:text-6xl">
              Estiator.io
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-200">
                The open-source restaurant management system.
            </p>
            <div className="mt-7 flex items-center justify-center gap-x-6">
              <Button className="rounded-md" variant="solid" color="warning">Get started</Button>
              <Button className="rounded-md bg-transparent text-white opacity-75 hover:opacity-100">Learn more <ArrowRightAltOutlined /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
