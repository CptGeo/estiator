import type { ReactElement } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@nextui-org/react";
import PasswordField from "@components/Fields/Password";
import { DevTool } from "@hookform/devtools";
import EmailField from "@components/Fields/Email";
import { useAuth } from "@context/Authentication";
import PageHeader from "@components/PageHeader/PageHeader";

/**
 * @todo Convert to modal instead of page
 */
export default function LoginPage(): ReactElement {
  const auth = useAuth();
  const location = useLocation();

  const methods = useForm({
    mode: "onSubmit",
  });

  if (auth?.user && auth.token) {
    return <Navigate to="/" replace />
  }

  async function onSubmit(values: FieldValues) {
    const { password, email } = values;

    if (auth?.loginAction) {
      await auth.loginAction({ password, username: email });
    }
  }

  return (
    <div className="py-20 max-w-[500px] mx-auto">
      <PageHeader heading="Login" subheading="You can enter your credentials to access the application, or register a new user." />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full gap-2 flex flex-col">
          <EmailField
            name="email"
            autoFocus
            isRequired
            label="Email"
            defaultValue="george@gmail.com"
            placeholder="Enter your email"
            variant="bordered"
            />
          <PasswordField
            name="password"
            label="Password"
            defaultValue="1234"
            placeholder="Enter your password"
            isRequired
            variant="bordered"
            />
          <div className="flex pb-2 px-1 gap-2">
            Don&apos;t have an account?
            <Link className="text-blue-600" to="/register">
              Register here.
            </Link>
          </div>
          <Button type="submit" color="primary" isLoading={auth?.loading}>Sign in</Button>
          {location.state && !auth?.loading && <p className="text-xs text-danger">{location.state}</p>}
          <DevTool control={methods.control} />
        </form>
      </FormProvider>
    </div>
  );
}
