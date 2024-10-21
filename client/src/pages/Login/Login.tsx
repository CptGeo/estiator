import { ReactElement } from "react";
import { Button, Link } from "@nextui-org/react";
import { FormProvider, useForm } from "react-hook-form";
import PasswordField from "../../components/Fields/Password";
import { DevTool } from "@hookform/devtools";
import EmailField from "../../components/Fields/Email";

/**
 * @todo Convert to modal instead of page
 */
export default function LoginPage(): ReactElement {
  const methods = useForm({
    mode: "onSubmit",
  });

  return (
    <div className="container py-20 max-w-[500px] mx-auto justify-center flex-col flex items-start gap-2">
      <FormProvider {...methods}>
        <EmailField
          name="email"
          autoFocus
          isRequired
          label="Email"
          placeholder="Enter your email"
          variant="bordered"
        />
        <PasswordField
          name="password"
          label="Password"
          placeholder="Enter your password"
          isRequired
          variant="bordered"
        />
        <div className="flex py-2 px-1 justify-between gap-2">
          Don't have an account?
          <Link color="primary" href="#" size="md">
            Register here.
          </Link>
        </div>
        <Button color="primary">Sign in</Button>
        <DevTool control={methods.control} />
      </FormProvider>
    </div>
  );
}
