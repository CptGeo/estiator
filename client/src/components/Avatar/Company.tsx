import { User } from "@heroui/react";
import type { CompanyData } from "@core/types";

export default function CompanyAvatar(props: { company: CompanyData, menuOpen: boolean } ) {
  const { name, description } = props.company;

  return (
    <User
      as="button"
      avatarProps={{
        radius: "none",
        className: "shrink-0 mt-1",
        size: "md",
        name: `${name.charAt(0)}${name.charAt(1)}`.toUpperCase()
      }}
      {...props.menuOpen && { description }}
      {...props.menuOpen ? { name: name } : { name: "" }}
      className="transition-transform text-slate-300 items-start"
      classNames={{ description: "text-left" }}
    />
  );
}
