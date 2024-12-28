import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import registerImage from "@assets/images/register_image.jpg";
import RegisterForm from "./Form";

export default function RegisterPage(): ReactElement {
  return (
    <div className="my-10 max-w-[1000px] mx-auto">
      <PageHeader
        heading="Registration"
        subheading="Please provide your details to create a new admin user"
      />
      <div className="flex flex-row bg-foreground-50 rounded-lg shadow-xl overflow-hidden">
        <div className="basis-2/5">
          <div
            style={{ backgroundImage: `url('${registerImage}')` }}
            className="w-full h-full bg-cover bg-center relative"
          >
            <div className="bg-slate-800 bg-opacity-50 absolute left-0 top-0 w-full h-full"></div>
          </div>
        </div>
        <div className="basis-3/5 px-5 pb-10 pt-5">
          <h2 className="text-xl tracking-wide drop-shadow-md font-light mb-3">
            Registration info
          </h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
