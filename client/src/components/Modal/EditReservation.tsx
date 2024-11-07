import { useState } from "react";
import { client } from "../../core/request";
import TimeField from "../Fields/Time";
import { DevTool } from "@hookform/devtools";
import TablesSelect from "../Fields/Tables";
import type { ReservationData } from "@core/types";
import type { useDisclosure } from "@nextui-org/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { getFullName } from "@core/utils";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "@components/Fields/Input";
import NumberField from "@components/Fields/Number";
import CalendarPlainField from "@components/Fields/CalendarPlain";
import { parseDate } from "@internationalized/date";
import CheckboxField from "@components/Fields/Checkbox";
import EmailField from "@components/Fields/Email";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function EditReservationModal(props: Props) {
  const { reservation, isOpen, onOpenChange, onClose } = props;
  const [loading, setLoading] = useState(false);
  const isRegistered = reservation.user.registered;

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      date: parseDate(reservation.date),
      time: reservation.time,
      name: reservation.user.name,
      surname: reservation.user.surname,
      email: reservation.user.email,
      phone: reservation.user.phone,
      persons: reservation.persons.toString(),
      table: String(reservation.table.id)
    }
  });

  async function onSubmit(values: FieldValues): Promise<void> {
    try {
      setLoading(true);
      const data = {
        date: values.date.toString(),
        persons: values.persons,
        ...(!reservation.user.registered && {
          user: {
            name: values.name,
            surname: values.surname,
            email: values.email,
            phone: values.phone
          },
        }),
        table: values.table,
        time: values.time,
      };
      await client.patch(`/reservations/${reservation.id}`, { ...data });
    } catch (error) {
      console.error(error);
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
                Editing reservation of <em>{getFullName(reservation.user)}</em><br />
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
                  <InputField isRequired label="Name" name="name" isDisabled={isRegistered} />
                  <InputField isRequired label="Surname" isDisabled={isRegistered} name="surname" />
                  <EmailField isRequired label="Email" isDisabled={isRegistered} name="email" />
                  <InputField label="Phone" isDisabled={isRegistered} name="phone" />
                </div>
              </div>

              {/* @todo Needs implementation */}
              {/* <StatusGroupField status={reservation.status} /> */}
              <CheckboxField label="Inform client about the changes (requires user email)" defaultSelected name="inform" />
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
              <DevTool control={methods.control} />
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    )
}