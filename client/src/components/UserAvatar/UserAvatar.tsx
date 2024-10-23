import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@nextui-org/react";
import { ReactElement } from "react";
import { useAuth } from "../../context/Authentication";
import { UserData } from "../../core/types";

type Props = {
  user: UserData
}

export default function UserAvatar(props: Props): ReactElement {
  const { name, surname, username } = props.user;
  const auth = useAuth();

  async function handleLogout() {
      await auth?.logoutAction();
  }

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              name: `${name.charAt(0).toUpperCase()} ${surname.charAt(0).toUpperCase()}`
            }}
            className="transition-transform"
            description={`@${username}`}
            name={`${name} ${surname}`}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">@{username}</p>
          </DropdownItem>
          <DropdownItem onClick={handleLogout} key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}