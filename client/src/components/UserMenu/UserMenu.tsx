import { Dropdown, DropdownItem, DropdownMenu } from "@heroui/react";
import type { ReactElement } from "react";
import { useAuth } from "@context/Authentication";
import { UserRole, UserRoleName, type UserData } from "@core/types";
import UserAvatar from "@components/Avatar/User";

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
        <UserAvatar user={props.user} />
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p>{UserRoleName?.[auth?.user?.userRole || UserRole.UNKNOWN]}</p>
          </DropdownItem>
          <DropdownItem onPress={handleLogout} key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}