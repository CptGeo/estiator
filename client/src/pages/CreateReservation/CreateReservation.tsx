import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, type ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import CalendarPlainField from "@components/Fields/CalendarPlain";
import EmailField from "@components/Fields/Email";
import InputField from "@components/Fields/Input";
import NumberField from "@components/Fields/Number";
import SelectField from "@components/Fields/Select";
import TimeField from "@components/Fields/Time";
import { SelectItem, Button, Tabs, Tab, Card, CardBody } from "@heroui/react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import PhoneCodeField from "@components/Fields/PhoneCode";
import config from "@settings";
import TablesGridSelect from "@components/Fields/TablesGridSelect";
import { ChevronRight } from "@mui/icons-material";
import useQueryTables from "@hooks/useQueryTables";
import { formatDate, getPhoneData, getRootPage, parseDurationToSeconds, postReq } from "@core/utils";
import type { CalendarDate } from "@internationalized/date";
import { getLocalTimeZone, parseTime, today } from "@internationalized/date";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@context/Notification";
import CheckboxField from "@components/Fields/Checkbox";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/Authentication";
import { UserRole } from "@core/types";

const GRID_SIZE = config.gridSize;

type FormData = {
  date: CalendarDate,
  persons: number,
  email: string,
  name: string,
  phone: string,
  surname: string,
  duration: string,
  table: string,
  time: string,
  inform: boolean,
  countryCode: string
}

export default function CreateReservationPage(): ReactElement {
  const auth = useAuth();
  const isClient = auth?.user?.userRole === UserRole.CLIENT;
  const methods = useForm<FormData>({
    mode: "onChange",
    ...isClient && {
      defaultValues: {
        email: auth.user?.email,
        name: auth.user?.name,
        surname: auth.user?.surname,
        phone: getPhoneData(auth.user?.phone).phoneNumber,
        countryCode: getPhoneData(auth.user?.phone).countryCode,
      }
    }
  });

  const { notify } = useNotification();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FieldValues) => postReq("reservations", data, { params: { inform: data?.inform } }),
    onSuccess: () => notify({ message: "Reservations has been created successfully!", type: "success" }),
    onError: () => notify({ message: "Reservations could not be created.", type: "danger" }),
    onSettled: () => {
      methods.reset();
      navigate(getRootPage(auth?.user?.userRole));
    }
  })

  const formRef = useRef<HTMLFormElement>(null);
  const { watch, formState } = methods;

  const { isValid } = formState;

  const date = watch("date");
  const time = watch("time");
  const duration = watch("duration");

  function checkValid(fields: string[]) {
    return fields.some(item => {
      return formState.errors[item as keyof FormData] || (!formState.errors[item as keyof FormData] && !formState.dirtyFields[item as keyof FormData]);
    });
  }

  const tableInvalid = useCallback(() => {
    return checkValid(["table"]);
  }, [formState.errors, formState.dirtyFields]);

  const { data } = useQueryTables(
    3000,
    { enabled: isValid },
    { date, time, duration: parseDurationToSeconds(duration) },
  );

  // reset selected table when fetched tables are updated
  useEffect(() => {
    methods.resetField("table");
  }, [data]);

  const step1Button = useRef<HTMLButtonElement>(null);
  const step2Button = useRef<HTMLButtonElement>(null);
  const step3Button = useRef<HTMLButtonElement>(null);

  const findTable = useCallback((id: string) => {
    return data?.find(item => item.id === id);
  }, [watch("table")]);

  async function onSubmit(values: FieldValues): Promise<void> {
    const data = {
      date: values.date.toString(),
      persons: values.persons,
      email: values.email,
      name: values.name,
      phone: `${values.countryCode} ${values.phone}`,
      surname: values.surname,
      duration: parseDurationToSeconds(values.duration),
      ...(values.table && { table: { id: Number(values.table) } }),
      time: parseTime(values.time).toString(),
      inform: values.inform,
      status: 0,
      statusValue: 0,
    };

    await mutateAsync(data);
  }

  function checkKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter") e.preventDefault();
  }

  return (
    <div className="max-w-[900px] mx-auto mt-10">
      <PageHeader
        heading="Create a new reservation"
        subheading="Here you can create a new reservation. Add your information and then select a table to proceed."
      />

      <FormProvider {...methods}>
        <form ref={formRef} onSubmit={methods.handleSubmit(onSubmit)} noValidate onKeyDown={(e) => checkKeyDown(e)} className="flex w-full flex-col">
          <Tabs aria-label="Reservation Steps" variant="solid" color="primary">
            <Tab tabRef={step1Button} key="reservationInfo" title="1. Reservation Info">
              <div className="gap-10 md:flex">
                <div className="w-full md:w-auto md:flex-shrink md:mb-0 mb-2 flex flex-col gap-4">
                  <CalendarPlainField
                    name="date"
                    showMonthAndYearPickers
                    required
                    minValue={today(getLocalTimeZone())}
                  />
                  <TimeField label="Select a time" name="time" placeholder="Time" isRequired />
                  <SelectField name="duration" label="Duration" isRequired >
                    <SelectItem key="00:30">00:30</SelectItem>
                    <SelectItem key="01:00">01:00</SelectItem>
                    <SelectItem key="01:30">01:30</SelectItem>
                    <SelectItem key="02:00">02:00</SelectItem>
                    <SelectItem key="02:30">02:30</SelectItem>
                    <SelectItem key="03:00">03:00</SelectItem>
                    <SelectItem key="03:30">03:30</SelectItem>
                    <SelectItem key="04:00">04:00</SelectItem>
                  </SelectField>
                </div>
                <div className="w-full md:w-3/4 md:flex-grow flex flex-col gap-4">
                  <NumberField isRequired label="Persons" name="persons" min={1} max={20} />
                  <InputField isRequired label="Name" name="name" />
                  <InputField label="Surname" name="surname" />
                  <EmailField isRequired label="Email" name="email" />
                  <div className="flex flex-nowrap basis-full gap-4">
                    <div className="basis-3/6 sm:basis-2/6">
                      <PhoneCodeField name="countryCode" label="Country code" />
                    </div>
                    <div className="basis-3/6 sm:basis-4/6">
                      <InputField
                        name="phone"
                        label="Phone number"
                        maxLength={64}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <Button
                  size="lg"
                  isDisabled={!isValid}
                  color="warning"
                  onPress={() => { (step2Button.current as HTMLButtonElement).click() }}
                >
                  Choose a table <ChevronRight />
                </Button>
              </div>
            </Tab>
            <Tab tabRef={step2Button} key="tableSelection" title="2. Table Selection" isDisabled={!isValid}>
              <TablesGridSelect name="table" tables={data} size={GRID_SIZE} />
              <div className="flex justify-end mt-5">
                <Button
                  size="lg"
                  isDisabled={tableInvalid()}
                  color="warning"
                  onPress={() => { (step3Button.current as HTMLButtonElement).click() }}
                >
                  Summarize <ChevronRight />
                </Button>
              </div>
            </Tab>

            <Tab tabRef={step3Button} key="summary" title="3. Summary" isDisabled={tableInvalid() || !isValid}>
              <div className="flex flex-col justify-between mt-5 gap-5">
                <Card>
                  <CardBody>
                    <div className="grid grid-cols-12 py-3 border-dotted border-b-2"><span className="col-span-3 text-sm text-foreground-500">Name:</span><span className="col-span-9">{methods.watch("name")}</span></div>
                    <div className="grid grid-cols-12 py-3 border-dotted border-b-2"><span className="col-span-3 text-sm text-foreground-500">Surname:</span><span className="col-span-9">{methods.watch("surname") || "-"}</span></div>
                    <div className="grid grid-cols-12 py-3 border-dotted border-b-2"><span className="col-span-3 text-sm text-foreground-500">Email:</span><span className="col-span-9">{methods.watch("email")}</span></div>
                    <div className="grid grid-cols-12 py-3 border-dotted border-b-2"><span className="col-span-3 text-sm text-foreground-500">Date:</span><span className="col-span-9">{watch("date") ? formatDate(watch("date")).toString() : "-"}</span></div>
                    <div className="grid grid-cols-12 py-3 border-dotted border-b-2"><span className="col-span-3 text-sm text-foreground-500">Time:</span><span className="col-span-9">{methods.watch("time")}</span></div>
                    <div className="grid grid-cols-12 py-3 border-dotted border-b-2"><span className="col-span-3 text-sm text-foreground-500">Duration:</span><span className="col-span-9">{methods.watch("duration")}</span></div>
                    <div className="grid grid-cols-12 py-3 border-dotted border-b-2"><span className="col-span-3 text-sm text-foreground-500">Table:</span><span className="col-span-9">{findTable(methods.watch("table"))?.label ?? "-"}</span></div>
                    <div className="grid grid-cols-12 py-3"><span className="col-span-3 text-sm text-foreground-500">Phone:</span>
                      <span className="col-span-9">{methods.watch("countryCode") && methods.watch("phone") ? `${methods.watch("countryCode")} ${methods.watch("phone")}` : "-"}</span>
                    </div>
                  </CardBody>
                </Card>
                <CheckboxField label={`${isClient ? "Receive reservation details on email" : "Send reservation details to client via email"}`} defaultSelected name="inform" />
                <Button
                  className="bg-gradient-to-tr from-success-400 to-primary-400 text-white shadow-lg text-lg ml-auto"
                  size="lg"
                  isDisabled={tableInvalid() || !isValid}
                  isLoading={isPending}
                  type="submit">
                  Create Reservation <ChevronRight />
                </Button>
              </div>
            </Tab>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
}
