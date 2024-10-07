import { Button, SelectItem } from "@nextui-org/react";
import { ReactElement } from "react";
import ReservationTimeField from "../../components/Fields/ReservationTime";
import InputField from "../../components/Fields/Input";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import EmailField from "../../components/Fields/Email";
import CalendarField from "../../components/Fields/Calendar";
import CheckboxField from "../../components/Fields/Checkbox";
import NumberField from "../../components/Fields/Number";
import SelectField from "../../components/Fields/Select";


export default function PlaygroundPage(): ReactElement {

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
          <h3 className="mb-0 text-xl">Playground</h3>
          <p className="mt-0 text-xs text-slate-400">
            Look how kids are having fun. Go join them...
          </p>
        </div>
        <div className="flex gap-3 xs:flex-wrap">
          <div>
            <div>
              <FormProvider {...methods}>
                <form className="mx-auto" onSubmit={methods.handleSubmit(handleSubmit)} noValidate>
                  <div className="flex w-full flex-wrap gap-4">
                    <CalendarField name="date-field" />
                    <ReservationTimeField name="time-field" label="Reservation Time" placeholder="Select reservation time"/>
                    <SelectField name="select" label="Default select field">
                      <SelectItem key="selection-1">Selection 1</SelectItem>
                      <SelectItem key="selection-2">Selection 2</SelectItem>
                    </SelectField>
                    <InputField type="text" name="text-field" label="Input Field" isRequired />
                    <EmailField name="email-field" label="Email" isRequired />
                    <NumberField name="number-field" label="Number Field" isRequired />
                    <CheckboxField name="checkbox-field" label="Checkbox field" />
                    <Button color="primary" type="submit" variant="flat" >Submit</Button>
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
