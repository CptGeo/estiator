import { ReservationData } from "../../core/types";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { getFullName } from "../../core/utils";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import InputField from "../Fields/Input";
import NumberField from "../Fields/Number";
import CalendarPlainField from "../Fields/CalendarPlain";
import { parseDate } from "@internationalized/date";
import CheckboxField from "../Fields/Checkbox";
import EmailField from "../Fields/Email";
import { DevTool } from "@hookform/devtools";
import { useState } from "react";
import { client } from "../../core/request";
import TimeField from "../Fields/Time";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function EditReservationModal(props: Props) {
  const { reservation, isOpen, onOpenChange, onClose } = props;
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      date: parseDate(reservation.date),
      name: reservation.user.name,
      surname: reservation.user.surname,
      email: reservation.user.email,
      persons: reservation.persons.toString(),
      table: reservation.table.toString()
    }
  });

  async function onSubmit(values: FieldValues): Promise<void> {
    try {
      setLoading(true);
      const data = {
        date: values.date.toString(),
        persons: values.persons,
        table: values.table,
        time: values.time
      };
      await client.patch(`/reservation/${reservation.id}`, { ...data });
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
      >
        <ModalContent>
          {(onClose) => (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ModalHeader className="gap-1">
                Editing reservation of <em>{getFullName(reservation.user)}</em><br />
              </ModalHeader>
              <ModalBody>
              <div className="flex flex-row gap-4">
                <div className="flex-shrink">
                  <CalendarPlainField name="date" showMonthAndYearPickers defaultValue={parseDate(reservation.date)} />
                  <TimeField label="Time" name="time" placeholder="Time" defaultSelectedKeys={[reservation.time]} />
                </div>
                <div className="flex-grow w-3/4 flex flex-col gap-2">
                  <NumberField isRequired label="Persons" name="persons" defaultValue={reservation.persons.toString()} />
                  <NumberField isRequired label="Table" name="table" defaultValue={reservation.table.toString()} />
                  <InputField isRequired label="Name" name="name" readOnly isDisabled defaultValue={reservation.user.name} />
                  <InputField isRequired label="Surname" readOnly isDisabled name="surname" defaultValue={reservation.user.surname} />
                  <EmailField isRequired label="Email" readOnly isDisabled name="email" defaultValue={reservation.user.email} />
                  <InputField label="Phone" readOnly isDisabled name="phone" defaultValue={reservation.user.phone} />
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
                  Update
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