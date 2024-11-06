import type { useDisclosure } from "@nextui-org/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "@components/Fields/Input";
import NumberField from "@components/Fields/Number";
import CalendarPlainField from "@components/Fields/CalendarPlain";
import CheckboxField from "@components/Fields/Checkbox";
import EmailField from "@components/Fields/Email";
import { useState } from "react";
import { client } from "@core/request";
import TimeField from "@components/Fields/Time";
import { ReservationStatus } from "@core/types";
import { today } from "@internationalized/date";

type Props = ReturnType<typeof useDisclosure>;

export default function CreateReservationModal(props: Props) {
  const { isOpen, onOpenChange, onClose } = props;
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      date: today("GMT").add({ days: 1 }),
      persons: 1,
      time: "08:00"
    }
  });

  async function onSubmit(values: FieldValues): Promise<void> {
    try {
      setLoading(true);
      const data = {
        date: values.date.toString(),
        persons: values.persons,
        user: {
          name: values.name,
          surname: values.surname,
          email: values.email,
          phone: values.phone
        },
        table: values.table,
        time: values.time,
        status: ReservationStatus.CONFIRMED
      };
      await client.post(`/reservations`, { ...data });
    } catch (error) {
      console.error(error);
    } finally {
      methods.reset({ persons: 5 });
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
                New reservation<br />
              </ModalHeader>
              <ModalBody>
              <div className="gap-4 md:flex">
                <div className="w-full md:w-auto md:flex-shrink md:mb-0 mb-2">
                  <CalendarPlainField name="date" showMonthAndYearPickers />
                  <TimeField label="Time" name="time" placeholder="Time" isRequired />
                </div>
                <div className="w-full md:w-3/4 md:flex-grow flex flex-col gap-2">
                  <NumberField isRequired label="Persons" name="persons" />
                  <InputField isRequired label="Table" name="table" />
                  <InputField isRequired label="Name" name="name" />
                  <InputField isRequired label="Surname" name="surname"/>
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
                <Button color="primary" type="submit" isLoading={loading}>
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