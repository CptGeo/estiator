import { DropdownTrigger, User } from "@nextui-org/react";
import { UserData } from "../../core/types";

export default function UserAvatar(props: { user: UserData }) {
  const { name, surname, username } = props.user;

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
          description={`@${username}`}
          name={`${name} ${surname}`}
      />
    </DropdownTrigger>
  );
}
