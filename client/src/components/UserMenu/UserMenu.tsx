import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@nextui-org/react";
import { ReactElement } from "react";
import { useAuth } from "../../context/Authentication";
import { UserData } from "../../core/types";
import UserAvatar from "../Avatar/User";

type Props = {
  user: UserData
}

export default function UserMenu(props: Props): ReactElement {
  const auth = useAuth();

  async function handleLogout() {
      await auth?.logoutAction();
  }

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
        <UserAvatar user={props.user} />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">Administrator</p>
          </DropdownItem>
          <DropdownItem onClick={handleLogout} key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}