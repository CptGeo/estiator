import { DropdownTrigger, User } from "@heroui/react";
import type { UserData } from "@core/types";

export default function UserAvatar(props: { user: UserData }) {
  const { name, surname, email } = props.user;

  return (
    <DropdownTrigger>
      <User
        as="button"
        avatarProps={{
          isBordered: true,
          name: `${name.charAt(0).toUpperCase()} ${surname
            .charAt(0)
            .toUpperCase()}`,
          }}
          classNames={{ name: "max-md:hidden", description: "max-md:hidden" }}
          className="transition-transform"
          description={email}
          name={`${name} ${surname}`}
      />
    </DropdownTrigger>
  );
}
