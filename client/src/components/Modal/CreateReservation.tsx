import type { CalendarDate, useDisclosure } from "@heroui/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, SelectItem } from "@heroui/react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "@components/Fields/Input";
import NumberField from "@components/Fields/Number";
import CalendarPlainField from "@components/Fields/CalendarPlain";
import CheckboxField from "@components/Fields/Checkbox";
import EmailField from "@components/Fields/Email";
import TimeField from "@components/Fields/Time";
import { getLocalTimeZone, parseTime, today } from "@internationalized/date";
import TablesSelectField from "../Fields/TablesSelect";
import { useMutation } from "@tanstack/react-query";
import { getFullName, getPhoneData, parseDurationToSeconds, postReq, statusError, statusSuccess } from "@core/utils";
import { useNotification } from "@context/Notification";
import SelectField from "@components/Fields/Select";
import type { ErrorResponse, Key, UserData } from "@core/types";
import useQueryCustomers from "@hooks/useQueryCustomers";
import AutocompleteField from "@components/Fields/Autocomplete";
import PhoneCodeField from "@components/Fields/PhoneCode";
import useQueryTables from "@hooks/useQueryTables";

type Props = ReturnType<typeof useDisclosure>;

type FormValues = {
  date: CalendarDate;
  persons: number;
  email: string;
  name: string;
  phone: string;
  surname: string;
  duration: string;
  table?: { id: number }
  time: string;
  status: number;
  statusValue: number;
  existingUser: boolean;
  countryCode: string;
}

export default function CreateReservationModal(props: Props) {
  const { isOpen, onOpenChange, onClose } = props;
  const { notify } = useNotification();
  const { data: clients } = useQueryCustomers();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: unknown) => postReq("reservations", data),
    onError: () => notify({ message: "Reservations could not be created.", type: "danger" }),
    onSettled: (response) => {
      if (statusSuccess(response?.status)) {
        notify({ message: "Reservations has been created successfully!", type: "success" })
        methods.reset();
        onClose();
      }
      if (statusError(response?.status)) {
        notify({
          message: "Reservations could not be created.",
          description: (response?.data as ErrorResponse).message,
          type: "danger" })
      }
    }
  })

  const methods = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      date: today(getLocalTimeZone()).add({ days: 1 }),
      persons: 1
    }
  });

  const existing = methods.watch("existingUser");
  const time = methods.watch("time");
  const date = methods.watch("date");
  const duration = methods.watch("duration");
  const isValid = !!time && !!date && !!duration;

  const { data: tables, isLoading } = useQueryTables(
    3000,
    { enabled: isValid },
    { date, time, duration: parseDurationToSeconds(duration) },
  );

  async function onSubmit(values: FieldValues): Promise<void> {
    const data = {
      date: values.date.toString(),
      persons: values.persons,
      email: values.email,
      name: values.name,
      phone: values.phone,
      surname: values.surname,
      duration: parseDurationToSeconds(values.duration),
      ...(values.table && { table: { id: Number(values.table) } }),
      time: parseTime(values.time).toString(),
      status: 0,
      statusValue: 0,
    };
    await mutateAsync(data);
  }

  function parseClients(clients: UserData[] | undefined)  {
    if (!clients) return [];

    return clients.map(client => {
      return {
        title: `${getFullName(client)} (${client.email})`,
        key: client.email,
      };
    })
  }

  function setCustomerData(key: Key | null) {
    if (!existing) return;
    const client = clients?.find(cl =>  cl.email ? cl.email.toString() === key?.toString() : false);

    if (!client) {
      methods.setError("email", { message: "Selected user is invalid" });
      return;
    }

    methods.setValue("name", client.name);
    methods.setValue("surname", client.name);
    methods.setValue("phone", getPhoneData(client.phone).phoneNumber);
    methods.setValue("countryCode", getPhoneData(client.phone).countryCode);
    methods.trigger();
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top"
      size="4xl"
      backdrop="opaque"
      onClose={methods.reset}
    >
      <ModalContent>
        {(onClose) => (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              <ModalHeader className="gap-1">
                New reservation<br />
              </ModalHeader>
              <ModalBody>
                <div className="gap-4 md:flex">
                  <div className="w-full md:w-auto md:flex-shrink md:mb-0 mb-2 flex flex-col gap-2">
                    <CalendarPlainField
                      name="date"
                      showMonthAndYearPickers
                      defaultValue={today(getLocalTimeZone())}
                      minValue={today(getLocalTimeZone())}
                    />
                    <TimeField className="mt-3" label="Select a time" name="time" placeholder="Time" isRequired />
                    <SelectField name="duration" label="Duration" isRequired>
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
                  <div className="w-full md:w-3/4 md:flex-grow flex flex-col gap-2">
                    <NumberField isRequired label="Persons" name="persons" />
                    <TablesSelectField label="Select table" name="table" tables={tables} isLoading={isLoading} />
                    <CheckboxField className="mt-3" onValueChange={() => {
                      methods.setValue("name", "");
                      methods.setValue("email", "");
                      methods.setValue("surname", "");
                      methods.setValue("phone", "");
                    }} name="existingUser" label="Select existing customer" />
                    {!existing && <EmailField isRequired label="Email" name="email" />}
                    {existing && <AutocompleteField
                      defaultItems={parseClients(clients)}
                      label="Email"
                      name="email"
                      isRequired
                      onSelectionChange={(key) => {
                        setCustomerData(key);
                      }}
                    />}
                    <InputField isRequired label="Name" name="name" isDisabled={existing} />
                    <InputField isRequired label="Surname" name="surname" isDisabled={existing} />
                    <div className="flex flex-nowrap basis-full gap-2">
                      <div className="basis-2/6">
                        <PhoneCodeField name="countryCode" label="Country code" isRequired isDisabled={existing} />
                      </div>
                      <div className="basis-4/6">
                        <InputField
                          name="phone"
                          label="Phone number"
                          maxLength={64}
                          isDisabled={existing}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <CheckboxField label="Inform client about the created reservation (requires user email)" defaultSelected name="inform" />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isPending}>
                  Create reservation
                </Button>
              </ModalFooter>
            </form>
          </FormProvider>
        )}
      </ModalContent>
    </Modal>
  )
}