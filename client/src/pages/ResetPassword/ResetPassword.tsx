import { useEffect, useState, type ReactElement } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { FieldValues, RegisterOptions } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import EmailField from "@components/Fields/Email";
import { useAuth } from "@context/Authentication";
import PageHeader from "@components/PageHeader/PageHeader";
import { Button } from "@heroui/react";
import { allRoutes, postReq, Routes, sleep, statusError, statusSuccess } from "@core/utils";
import { useNotification } from "@context/Notification";
import PasswordField from "@components/Fields/Password";
import { ErrorResponse } from "@core/types";

/**
 * @todo Convert to modal instead of page
 */
export default function ResetPasswordPage(): ReactElement {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();
  const [ URLSearchParams ] = useSearchParams();
  const uuid = URLSearchParams.get("uuid");

  useEffect(() => {
    if (!uuid) {
      navigate(allRoutes[Routes.LOGIN]);
    }
  }, [uuid]);

  const methods = useForm({
    mode: "onSubmit",
  });

  async function onSubmit(values: FieldValues) {
    const { password } = values;

    setLoading(true);

    const result = await postReq("/auth/setNewPassword", { resetPasswordToken: uuid, password });

    if(statusError(result.status)) {
      notify({ message: "Set new password", description: (result?.data as ErrorResponse).message, type: "danger" })
    }

    if (statusSuccess(result.status)) {
      notify({ message: "Set new password", description: "You password has been reset successfully. Please, try logging in.", type: "success" })
    }

    setLoading(false);
    navigate(allRoutes[Routes.LOGIN]);
  }

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

  return (
    <div className="py-20 max-w-[500px] mx-auto">
      <PageHeader heading="Set new password" subheading="You have requested to reset your password. Please, set a new password for your account." />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate className="w-full gap-2 flex flex-col">
          <div className="flex flex-col gap-3 mb-2">
              <PasswordField
                name="password"
                label="Password"
                placeholder="Enter your password"
                isRequired
                variant="bordered"
                rules={passwordRules}
              />
              <PasswordField
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Enter your password again"
                isRequired
                variant="bordered"
                rules={confirmPasswordRules}
              />
          </div>
          <Button type="submit" color="primary" isLoading={loading}>Reset Password</Button>
        </form>
      </FormProvider>
    </div>
  );
}
