import EmailField from "@components/Fields/Email";
import InputField from "@components/Fields/Input";
import PasswordField from "@components/Fields/Password";
import PhoneCodeField from "@components/Fields/PhoneCode";
import { useAuth } from "@context/Authentication";
import { postReq, statusError, statusSuccess } from "@core/utils";
import { Button, SelectItem } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { FieldValues, RegisterOptions } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "@context/Notification";
import SelectField from "@components/Fields/Select";
import type { ErrorResponse } from "@core/types";
import { UserRole, UserRoleName } from "@core/types";
import { userIsAllowed } from "@core/auth";

export default function RegisterForm() {
  const location = useLocation();
  const auth = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const isAdmin = userIsAllowed(auth?.user, [UserRole.ADMIN]);
  const postUrl = `auth/signup${isAdmin ? "/admin" : ""}`;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FieldValues) => postReq(postUrl, data),
    onSettled: (result) => {
      if(statusSuccess(result?.status)) {
        notify({ message: "User has been created successfully!", type: "success" });
        return navigate("/login");
      }
      if (statusError(result?.status)) {
        notify({ message: "User could not be created", description: (result?.data as ErrorResponse).message, type: "danger" });
      }
    },
    onError: (error) => {
      console.log(error);
      notify({ message: "User could not be created", description: 'Unknown error', type: "danger" });
    }
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
    await mutateAsync({
      password: values.password,
      email: values.email,
      name: values.name,
      surname: values.surname,
      phone: `${values.countryCode} ${values.phone}`,
      ...isAdmin && { userRole: values.userRole }
    });
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
                <PhoneCodeField name="countryCode" label="Country code" defaultSelectedKeys={["+30"]} variant="bordered" isRequired />
              </div>
              <div className="basis-4/6 p-1">
                <InputField
                  name="phone"
                  label="Phone number"
                  variant="bordered"
                  placeholder="Enter your phone number"
                  maxLength={64}
                  isRequired
                />
              </div>
            </div>
          </div>
        </div>
        {isAdmin &&
          <div className="mb-4">
            <p className="mb-1 text-xs italic">Permissions</p>
            <div className="flex flex-row flex-wrap mb-2">
              <div className="basis-full p-1">
                <SelectField name="userRole" label="Role" variant="bordered" isRequired>
                    <SelectItem key={UserRole.ADMIN} value={UserRole.ADMIN}>
                      {UserRoleName[UserRole.ADMIN]}
                    </SelectItem>
                    <SelectItem key={UserRole.MODERATOR} value={UserRole.MODERATOR}>
                      {UserRoleName[UserRole.MODERATOR]}
                    </SelectItem>
                </SelectField>
              </div>
            </div>
          </div>}
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
      </form>
    </FormProvider>
  );
}
