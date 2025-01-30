import type { useDisclosure } from "@heroui/react";
import ConfirmationModal from "@components/Modal/Confirmation";
import type { UserData } from "@core/types";
import { useState } from "react";
import { deleteReq, getFullName } from "@core/utils";
import { useNotification } from "@context/Notification";

type Props = {
  customer: UserData;
} & ReturnType<typeof useDisclosure>;

export default function RemoveCustomerModal(props: Props) {
  const { customer, ...disclosureProps } = props;
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  async function handleAction() {
    try {
      setLoading(true);
      await deleteReq(`/users/${customer.id}`);
      notify({ message: "Customer has been deleted successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      notify({ message: "Customer could not be deleted", type: "danger" });
    } finally {
      setLoading(false);
      disclosureProps.onClose();
    }
  }

  return (
    <ConfirmationModal
      {...disclosureProps}
      title="Remove customer"
      cancelText="Abort"
      confirmText="Remove"
      confirmButtonProps={{ color: "danger", isLoading: loading }}
      body={
        <p>
          Customer {getFullName(customer)} will be <strong>removed.</strong>
          <br />
          Are you sure you want to continue?
        </p>
      }
      callback={handleAction}
    />
  );
}
