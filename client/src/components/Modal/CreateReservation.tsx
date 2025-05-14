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
import { parseDurationToSeconds, postReq, statusError, statusSuccess } from "@core/utils";
import { useNotification } from "@context/Notification";
import SelectField from "@components/Fields/Select";
import type { ErrorResponse } from "@core/types";

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
}

export default function CreateReservationModal(props: Props) {
  const { isOpen, onOpenChange, onClose } = props;
  const { notify } = useNotification();
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
    mode: "all",
    defaultValues: {
      date: today(getLocalTimeZone()).add({ days: 1 }),
      persons: 1
    }
  });

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

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top"
      size="2xl"
      backdrop="opaque"
      onClose={methods.reset}
    >
      <ModalContent>
        {(onClose) => (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                    <TimeField label="Select a time" name="time" placeholder="Time" isRequired />
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
                    <TablesSelectField label="Select table" name="table" />
                    <InputField isRequired label="Name" name="name" />
                    <InputField isRequired label="Surname" name="surname" />
                    <EmailField isRequired label="Email" name="email" />
                    <InputField label="Phone" name="phone" />
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