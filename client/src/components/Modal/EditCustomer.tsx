import { useState } from "react";
import { type UserData } from "@core/types";
import type { useDisclosure } from "@heroui/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { getFullName, patchReq } from "@core/utils";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "@components/Fields/Input";
import CheckboxField from "@components/Fields/Checkbox";
import EmailField from "@components/Fields/Email";
import { useNotification } from "@context/Notification";
import PhoneCodeField from "@components/Fields/PhoneCode";

type Props = {
  customer: UserData;
} & ReturnType<typeof useDisclosure>;

export default function EditCustomerModal(props: Props) {
  const { customer, isOpen, onOpenChange, onClose } = props;
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      name: customer.name,
      surname: customer.surname,
      email: customer.email,
      countryCode: [customer.phone?.split(" ")[0]],
      phone: customer.phone?.split(" ")[1]
    }
  });

  async function onSubmit(values: FieldValues): Promise<void> {
    try {
      setLoading(true);
      const data = {
        name: values.name,
        surname: values.surname,
        email: values.email,
        phone: `${values.countryCode} ${values.phone}`
      };
      await patchReq(`/users/${customer.id}`, { ...data }, { params: { inform: values.inform } });
      notify({ message: "Customer info have been updated successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      notify({ message: "Customer info could not be updated.", type: "danger" });
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
                Editing customer of <em>{getFullName(customer)}</em><br />
              </ModalHeader>
              <ModalBody>
              <div className="gap-4 md:flex">
                <div className="w-full md:w-3/4 md:flex-grow flex flex-col gap-2">
                  <InputField isRequired label="Name" name="name"  />
                  <InputField isRequired label="Surname" name="surname" />
                  <EmailField isRequired label="Email" name="email" />
                  <div className="flex flex-nowrap basis-full gap-2">
                    <div className="basis-2/6">
                      <PhoneCodeField name="countryCode" label="Country code" isRequired />
                    </div>
                    <div className="basis-4/6">
                      <InputField
                        name="phone"
                        label="Phone number"
                        maxLength={64}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <CheckboxField label="Inform client about the changes (requires user email)" name="inform" />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={loading}>
                  Update customer
                </Button>
              </ModalFooter>
              </form>
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    )
}