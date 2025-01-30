import { DropdownTrigger, User } from "@heroui/react";
import type { UserData } from "@core/types";
import { getInitials } from "@core/utils";

export default function UserAvatar(props: { user: UserData }) {
  const { name, surname, email } = props.user;

  return (
    <DropdownTrigger>
      <User
        as="button"
        avatarProps={{
          isBordered: true,
          name: getInitials(props.user)
        }}
        classNames={{ name: "max-md:hidden", description: "max-md:hidden" }}
        className="transition-transform"
        description={email}
        name={`${name} ${surname}`}
      />
    </DropdownTrigger>
  );
}
