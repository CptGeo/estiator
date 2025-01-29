import { useState } from "react";
import { UserRole, UserRoleName, type UserData } from "@core/types";
import type { useDisclosure } from "@heroui/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, SelectItem } from "@heroui/react";
import { getFullName, patchReq } from "@core/utils";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "@components/Fields/Input";
import CheckboxField from "@components/Fields/Checkbox";
import EmailField from "@components/Fields/Email";
import { useNotification } from "@context/Notification";
import PhoneCodeField from "@components/Fields/PhoneCode";
import SelectField from "@components/Fields/Select";

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
      phone: customer.phone?.split(" ")[1],
      userRole: customer.userRole
    }
  });

  async function onSubmit(values: FieldValues): Promise<void> {
    try {
      setLoading(true);
      const data = {
        name: values.name,
        surname: values.surname,
        email: values.email,
        phone: `${values.countryCode} ${values.phone}`,
        userRole: values.userRole,
        inform: values.inform
      };
      console.log(data);
      return;
      await patchReq(`/users/${customer.id}`, { ...data });
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
                  <SelectField name="userRole" label="Role">
                    <SelectItem key={UserRole.CLIENT} value={UserRole.CLIENT}>{UserRoleName[UserRole.CLIENT]}</SelectItem>
                    <SelectItem key={UserRole.GUEST} value={UserRole.GUEST}>{UserRoleName[UserRole.GUEST]}</SelectItem>
                  </SelectField>
                  <div className="flex flex-nowrap basis-full">
                    <div className="basis-2/6 p-1">
                      <PhoneCodeField name="countryCode" label="Country code" />
                    </div>
                    <div className="basis-4/6 p-1">
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