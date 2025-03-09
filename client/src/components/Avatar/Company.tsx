import { User } from "@heroui/react";
import type { CompanyData } from "@core/types";

export default function CompanyAvatar(props: { company: CompanyData }) {
  const { name, description } = props.company;

  return (
    <User
      name={name}
      as="button"
      avatarProps={{
        radius: "none",
        className: "shrink-0 mt-1",
        size: "md",
        name: `${name.charAt(0)}${name.charAt(1)}`.toUpperCase(),
      }}
      description={description}
      className="transition-transform text-slate-300 items-start"
      classNames={{ description: "text-left" }}
    />
  );
}
