import { ReservationData } from "../../core/types";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { getFullName } from "../../core/utils";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "../Fields/Input";
import NumberField from "../Fields/Number";
import CalendarPlainField from "../Fields/CalendarPlain";
import { parseDate } from "@internationalized/date";
import CheckboxField from "../Fields/Checkbox";
import EmailField from "../Fields/Email";
import StatusGroupField from "../Fields/StatusGroup";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function EditReservationModal(props: Props) {
  const { reservation, isOpen, onOpenChange } = props;

  const methods = useForm({
    mode: "onChange"
  });

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
              <ModalHeader className="gap-1">
                Editing reservation of <em>{getFullName(reservation.user)}</em><br />
              </ModalHeader>
              <ModalBody>
              <div className="flex flex-row gap-4">
                <div>
                  <CalendarPlainField name="date" showMonthAndYearPickers defaultValue={parseDate(reservation.date)} />
                </div>
                <div className="flex-grow flex flex-col gap-2">
                  <InputField isRequired label="Name" name="name" defaultValue={reservation.user.name} />
                  <InputField isRequired label="Surname" name="surname" defaultValue={reservation.user.surname} />
                  <EmailField isRequired label="Email" name="email" defaultValue={reservation.user.email} />
                  <NumberField isRequired label="Persons" name="persons" defaultValue={reservation.persons.toString()} />
                  <NumberField isRequired label="Table" name="table" defaultValue={reservation.table.toString()} />
                </div>
              </div>

              {/* @todo Needs implementation */}
              <StatusGroupField status={reservation.status} />

              <CheckboxField label="Inform client about the changes (requires user email)" defaultSelected name="inform" />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Update
                </Button>
              </ModalFooter>
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    )
}