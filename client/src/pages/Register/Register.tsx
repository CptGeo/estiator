import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Link } from "@nextui-org/react";
import PasswordField from "@components/Fields/Password";
import { DevTool } from "@hookform/devtools";
import EmailField from "@components/Fields/Email";
import { useAuth } from "@context/Authentication";
import PageHeader from "@components/PageHeader/PageHeader";
import InputField from "@components/Fields/Input";
import registerImage from "@assets/images/register_image.jpg";

/**
 * @todo Convert to modal instead of page
 */
export default function RegisterPage(): ReactElement {
  const auth = useAuth();
  const location = useLocation();

  const methods = useForm({
    mode: "onSubmit",
  });

  if (auth?.user && auth.token) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(values: FieldValues) {
    const { password, email } = values;

    if (auth?.loginAction) {
      await auth.loginAction({ password, username: email });
    }
  }

  return (
    <div className="my-10 max-w-[1000px] mx-auto">
      <PageHeader
        heading="Registration"
        subheading="Please provide your details to create a new admin user"
      />
      <div className="flex flex-row bg-foreground-50 rounded-lg shadow-xl overflow-hidden">
        <div className="basis-1/2">
          <div style={{ backgroundImage: `url('${registerImage}')` }} className="w-full h-full bg-cover bg-center relative">
            <div className="bg-slate-800 bg-opacity-50 absolute left-0 top-0 w-full h-full"></div>
          </div>
        </div>
        <div className="basis-1/2 px-5 pb-5 pt-2">
        <h2 className="text-xl tracking-wide drop-shadow-md font-light mb-3">Registration info</h2>
        <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full flex flex-col"
        >
          {/* ACCOUNT INFO */}
          <div className="mb-4">
            <p className="mb-1 text-xs italic">Account info</p>
            <div className="mb-2 p-1">
              <EmailField
                name="email"
                autoFocus
                isRequired
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
              />
            </div>
            <div className="flex flex-row gap-3 mb-2">
              <div className="basis-1/2 p-1">
                <PasswordField
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  isRequired
                  variant="bordered"
                />
              </div>
              <div className="basis-1/2 p-1">
                <PasswordField
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Enter your password"
                  isRequired
                  variant="bordered"
                />
              </div>
            </div>
          </div>
          {/*  */}

          {/* PERSONAL INFO */}
          <div className="mb-4">
            <p className="mb-1 text-xs italic">Personal info</p>
            <div className="flex flex-row flex-wrap mb-2">
              <div className="basis-1/2 p-1">
                <InputField
                  name="name"
                  label="Name"
                  isRequired
                  variant="bordered"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="basis-1/2 p-1">
                <InputField
                  name="surname"
                  label="Surname"
                  isRequired
                  variant="bordered"
                  placeholder="Enter your last name"
                />
              </div>
              <div className="basis-full p-1">
                <InputField
                  name="phone"
                  label="Phone number"
                  isRequired
                  variant="bordered"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>
          {/*  */}
          <div className="flex pb-2 px-1 gap-2">
            Are you a client?
            <Link color="primary" href="#" size="md">
              Register a client account here.
            </Link>
          </div>
          <Button type="submit" color="primary" isLoading={auth?.loading}>
            Register
          </Button>
          {location.state && !auth?.loading && (
            <p className="text-xs text-danger">{location.state}</p>
          )}
          <DevTool control={methods.control} />
        </form>
      </FormProvider>
        </div>
      </div>

    </div>
  );
}
