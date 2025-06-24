import { useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import EmailField from "@components/Fields/Email";
import PageHeader from "@components/PageHeader/PageHeader";
import { Button } from "@heroui/react";
import { allRoutes, postReq, Routes, sleep } from "@core/utils";
import { useNotification } from "@context/Notification";

/**
 * @todo Convert to modal instead of page
 */
export default function PasswordResetPage(): ReactElement {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const methods = useForm({
    mode: "onSubmit",
  });

  async function onSubmit(values: FieldValues) {
    const { email } = values;

    setLoading(true);

    await postReq("/auth/resetPassword", { email });
    await sleep(2000); // 3s delay to limit load

    setLoading(false);
    notify({ description: 'If an account exists for the email you provided, we will be sending a password reset link. Please, check your email', message: 'Password reset', type: "warning" });
    navigate(allRoutes[Routes.LOGIN]);
  }

  return (
    <div className="py-20 max-w-[500px] mx-auto">
      <PageHeader heading="Reset password" subheading="Add your account email. You will receive a link through which you can reset your password." />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate className="w-full gap-2 flex flex-col">
          <EmailField
            name="email"
            autoFocus
            isRequired
            label="Email"
            placeholder="Enter your email"
            variant="bordered"
          />
          <Button type="submit" color="primary" isLoading={loading}>Send reset link</Button>
        </form>
      </FormProvider>
    </div>
  );
}
