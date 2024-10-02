import { Button } from "@nextui-org/react";
import { ReactElement } from "react";
import ReservationDate from "../../components/ReservationDate/ReservationDate";
import ReservationTime from "../../components/ReservationTime/ReservationTime";
import InputField from "../../components/Fields/Input";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import EmailField from "../../components/Fields/Email";


export default function ReservationPage(): ReactElement {

  const methods = useForm({
    mode: "all"
  });

  function handleSubmit(values: FieldValues) {
    alert("Form submitted successfully!");
    console.log(values);
  }

  return (
    <div className="reservation">
      <div className="container max-w-[650px] mx-auto px-3 pb-5">
        <div className="py-4">
          <h3 className="mb-0 text-xl">Reserve a table</h3>
          <p className="mt-0 text-xs text-slate-400">
            Find the best table for you.
          </p>
        </div>

        <FormProvider {...methods}>
          <form className="mx-auto" onSubmit={methods.handleSubmit(handleSubmit)} noValidate>
            <div className="flex w-full flex-wrap gap-4">
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <ReservationDate />
                <ReservationTime />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <InputField type="text" label="Name" name="name" isRequired />
                <EmailField name="email" label="Email" isRequired />
              </div>

              <Button color="primary" type="submit" variant="flat" >Reserve</Button>
            </div>
          </form>
          <DevTool control={methods.control} />
        </FormProvider>
      </div>
    </div>
  );
}
