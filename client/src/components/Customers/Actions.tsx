import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DropdownSection, useDisclosure } from "@heroui/react";
import MenuDotsIcon from "@components/Icons/MenuDotsIcon";
import type { UserData } from "@core/types";
import { UserRole } from "@core/types";
import type { Key } from "react";
import { userIsAllowed } from "@core/auth";
import { useAuth } from "@context/Authentication";
import RemoveCustomerModal from "@components/Modal/RemoveCustomer";
import EditCustomerModal from "@components/Modal/EditCustomer";

type Props = {
  customer: UserData;
}

enum Action {
  EDIT = "edit",
  REMOVE = "remove"
};

export default function CustomersActions(props: Props) {
  const customer = props.customer;

  const edit = useDisclosure();
  const remove = useDisclosure();

  const auth = useAuth();
  const user = auth?.user;
  const isAllowed = userIsAllowed(user, [UserRole.ADMIN]);

  function handleAction(key: Key) {
    switch(key) {
      case Action.EDIT:
        edit.onOpen();
        break;
      case Action.REMOVE:
        remove.onOpen();
        break;
    }
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="light">
            <MenuDotsIcon className="text-2xl" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Action event example"
          variant="solid"
          onAction={handleAction}>
          <DropdownSection title="Manage">
            <DropdownItem key={Action.EDIT}>Edit customer</DropdownItem>
          </DropdownSection>
          {isAllowed ? <DropdownSection title="Danger zone">
            <DropdownItem key={Action.REMOVE} className="text-danger" color="danger">
              Remove
            </DropdownItem>
          </DropdownSection> : null}
        </DropdownMenu>
      </Dropdown>
      <RemoveCustomerModal customer={customer} {...remove} />
      <EditCustomerModal customer={customer} {...edit} />
    </>
  );
}