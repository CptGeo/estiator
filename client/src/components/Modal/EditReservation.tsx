import { useState } from "react";
import TimeField from "../Fields/Time";
import TablesSelect from "../Fields/Tables";
import { ReservationStatus, type ReservationData } from "@core/types";
import type { useDisclosure } from "@heroui/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import toParsedTimeString, { getFullName, patchReq } from "@core/utils";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "@components/Fields/Input";
import NumberField from "@components/Fields/Number";
import CalendarPlainField from "@components/Fields/CalendarPlain";
import { parseDate, parseTime } from "@internationalized/date";
import CheckboxField from "@components/Fields/Checkbox";
import EmailField from "@components/Fields/Email";
import { ReservationStatusOption } from "@components/Fields/ReservationStatus";
import ReservationStatusField from "@components/Fields/ReservationStatus";
import { useNotification } from "@context/Notification";

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
      inform: false
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
        inform: values.inform
      };
      await patchReq(`/reservations/${reservation.id}`, { ...data });
      notify({ message: "Reservation has been updated successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      notify({ message: "Reservation could not be updated.", type: "danger" });
    } finally {
      setLoading(false);
      onClose();
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
                <div className="w-full md:w-auto md:flex-shrink md:mb-0 mb-2">
                  <CalendarPlainField name="date" showMonthAndYearPickers />
                  <TimeField label="Select a time" name="time" placeholder="Time" isRequired />
                </div>
                <div className="w-full md:w-3/4 md:flex-grow flex flex-col gap-2">
                  <NumberField isRequired label="Persons" name="persons" />
                  <TablesSelect label="Select table" name="table" />
                  <InputField isReadOnly isDisabled label="Name" name="name"  />
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