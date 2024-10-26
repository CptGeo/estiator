import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DropdownSection } from "@nextui-org/react";
import MenuDotsIcon from "../Icons/MenuDotsIcon";

export default function DataActions() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light">
          <MenuDotsIcon className="text-2xl" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Action event example"
        variant="solid"
        onAction={(key) => alert(key)}>
        <DropdownSection title="Manage" showDivider>
          <DropdownItem key="edit" color="success">Confirm reservation</DropdownItem>
          <DropdownItem key="edit">Edit reservation</DropdownItem>
        </DropdownSection>
        <DropdownSection title="Danger zone">
          <DropdownItem key="delete" className="text-danger" color="danger">
            Cancel reservation
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}