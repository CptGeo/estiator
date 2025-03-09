import { useState } from "react";
import TimeField from "../Fields/Time";
import TablesSelectField from "../Fields/TablesSelect";
import { ReservationStatus, type ReservationData } from "@core/types";
import type { useDisclosure } from "@heroui/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, SelectItem } from "@heroui/react";
import { getFullName, parseDurationToSeconds, patchReq, toDurationString, toParsedTimeString } from "@core/utils";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import NumberField from "@components/Fields/Number";
import CalendarPlainField from "@components/Fields/CalendarPlain";
import { parseDate, parseTime, today } from "@internationalized/date";
import CheckboxField from "@components/Fields/Checkbox";
import EmailField from "@components/Fields/Email";
import { ReservationStatusOption } from "@components/Fields/ReservationStatus";
import ReservationStatusField from "@components/Fields/ReservationStatus";
import { useNotification } from "@context/Notification";
import InputField from "@components/Fields/Input";
import SelectField from "@components/Fields/Select";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function EditReservationModal(props: Props) {
  const { reservation, isOpen, onOpenChange, onClose } = props;
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      date: parseDate(reservation.date),
      time: toParsedTimeString(reservation.time),
      persons: reservation.persons.toString(),
      table: String(reservation?.table?.id),
      status: reservation.status,
      name: reservation.createdFor.name,
      duration: toDurationString(reservation.duration),
      surname: reservation.createdFor.surname,
      phone: reservation.createdFor.phone,
      email: reservation.createdFor.email,
    }
  });

  async function onSubmit(values: FieldValues): Promise<void> {
    try {
      setLoading(true);
      const data = {
        date: values.date.toString(),
        persons: values.persons,
        table: { id: values.table != "" ? Number(values.table) : null },
        time: parseTime(values.time).toString(),
        status: values.status,
        duration: parseDurationToSeconds(values.duration),
      };
      await patchReq(`/reservations/${reservation.id}`, { ...data }, { params: { inform: values.inform } });
      notify({ message: "Reservation has been updated successfully!", type: "success" });
      onClose();
    } catch (error) {
      console.error(error);
      notify({ message: "Reservation could not be updated.", type: "danger" });
    } finally {
      setLoading(false);
    }
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
                Editing reservation of <em>{getFullName(reservation.createdFor)}</em><br />
              </ModalHeader>
              <ModalBody>
              <div className="gap-4 md:flex">
                <div className="w-full md:w-auto md:flex-shrink md:mb-0 mb-2 flex flex-col gap-2">
                  <CalendarPlainField
                    name="date"
                    showMonthAndYearPickers
                    defaultValue={today("Europe/Athens")}
                    minValue={today("Europe/Athens")}
                  />
                  <TimeField label="Select a time" name="time" placeholder="Time" isRequired />
                  <SelectField name="duration" label="Duration">
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
                  <InputField isReadOnly isDisabled label="Name" name="name" />
                  <InputField isReadOnly isDisabled label="Surname" name="surname" />
                  <EmailField isReadOnly isDisabled label="Email" name="email" />
                  <InputField isReadOnly isDisabled label="Phone" name="phone" />
                </div>
              </div>
              <ReservationStatusField name="status" label="Status">
                <ReservationStatusOption status={ReservationStatus.CANCELLED} />
                <ReservationStatusOption status={ReservationStatus.PENDING} />
                <ReservationStatusOption status={ReservationStatus.COMPLETED} />
                <ReservationStatusOption status={ReservationStatus.CONFIRMED} />
                <ReservationStatusOption status={ReservationStatus.BOOKED} />
              </ReservationStatusField>
              <CheckboxField label="Inform client about the changes (requires user email)" name="inform" />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={loading}>
                  Update reservation
                </Button>
              </ModalFooter>
              </form>
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    )
}