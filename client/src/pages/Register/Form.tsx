import EmailField from "@components/Fields/Email";
import InputField from "@components/Fields/Input";
import PasswordField from "@components/Fields/Password";
import PhoneCodeField from "@components/Fields/PhoneCode";
import { useAuth } from "@context/Authentication";
import { postReq } from "@core/utils";
import { DevTool } from "@hookform/devtools";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import type { FieldValues, RegisterOptions } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { Link, Navigate, useLocation } from "react-router-dom";

export default function RegisterForm() {
  const location = useLocation();
  const auth = useAuth();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FieldValues) => postReq("users", data),
  });

  const methods = useForm({
    mode: "onChange",
  });

  const { isValid } = methods.formState;

  const passwordRules: RegisterOptions = {
    validate: (val) => {
      const { confirmPassword } = methods.getValues();
      if (confirmPassword.length === 0) {
        return true;
      }

      return confirmPassword === val || "The password and confirmation password do not match";
    }
  };

  const confirmPasswordRules: RegisterOptions = {
    validate: (val) => {
      const { password } = methods.getValues();
      if (password.length === 0) {
        return true;
      }

      return password === val || "The password and confirmation password do not match";
    }
  };

  async function onSubmit(values: FieldValues) {
    mutateAsync(values);
  }

  if (auth?.user && auth.token) {
    return <Navigate to="/" replace />;
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full flex flex-col"
        noValidate
      >
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
                rules={passwordRules}
              />
            </div>
            <div className="basis-1/2 p-1">
              <PasswordField
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Enter your password"
                isRequired
                variant="bordered"
                rules={confirmPasswordRules}
              />
            </div>
          </div>
        </div>
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
                maxLength={64}
              />
            </div>
            <div className="basis-1/2 p-1">
              <InputField
                name="surname"
                label="Surname"
                isRequired
                variant="bordered"
                placeholder="Enter your last name"
                maxLength={64}
              />
            </div>
            <div className="flex flex-nowrap basis-full">
              <div className="basis-2/6 p-1">
                <PhoneCodeField name="countryCode" label="Country code" />
              </div>
              <div className="basis-4/6 p-1">
                <InputField
                  name="phone"
                  label="Phone number"
                  variant="bordered"
                  placeholder="Enter your phone number"
                  maxLength={64}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex pb-2 px-1 gap-2">
          Are you a client?
          <Link className="text-blue-600" to="/register-client">
            Register a client account here.
          </Link>
        </div>
        <Button
          type="submit"
          color="primary"
          isLoading={isPending}
          isDisabled={!isValid}
        >
          Register
        </Button>
        {location.state && !auth?.loading && (
          <p className="text-xs text-danger">{location.state}</p>
        )}
        <DevTool control={methods.control} />
      </form>
    </FormProvider>
  );
}
