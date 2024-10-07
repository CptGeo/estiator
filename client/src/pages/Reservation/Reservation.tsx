import { Button } from "@nextui-org/react";
import { ReactElement } from "react";
import ReservationTimeField from "../../components/Fields/ReservationTime";
import InputField from "../../components/Fields/Input";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import EmailField from "../../components/Fields/Email";
import CalendarField from "../../components/Fields/Calendar";


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
      <div className="container max-w-[1400px] mx-auto mt-3 px-3">
        <div className="py-4">
          <h3 className="mb-0 text-xl">Reserve a table</h3>
          <p className="mt-0 text-xs text-slate-400">
            Find the best table for you.
          </p>
        </div>

        <div className="flex gap-3 xs:flex-wrap">
          <div>
            <div>
              <FormProvider {...methods}>
                <form className="mx-auto" onSubmit={methods.handleSubmit(handleSubmit)} noValidate>
                  <div className="flex w-full flex-wrap gap-4">
                    <div className="flex w-full flex-wrap xl:flex-nowrap gap-4">
                      <CalendarField name="reservation-date" />
                      <ReservationTimeField name="reservation-time" />
                    </div>
                    <div className="flex w-full flex-wrap xl:flex-nowrap gap-4">
                      <InputField type="text" label="Name" name="reservation-name" isRequired />
                      <EmailField name="reservation-email" label="Email" isRequired />
                    </div>
                    <Button color="primary" type="submit" variant="flat" >Reserve</Button>
                  </div>
                </form>
                <DevTool control={methods.control} />
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
