import { Select } from "@nextui-org/react";
import { ReactElement, ReactNode } from "react";
import { Controller } from "react-hook-form";


type Props = {
  name: string;
  label: string;
  className: string;
  placeholder: string;
  startContent: ReactNode;
  children: JSX.Element[];
};

export default function SelectField(props: Props): ReactElement {
  const { name, label, className, placeholder, startContent, children } = props;

  return (
    <Controller name={name} render={({ field: { onChange, onBlur, value, ref }}) => {
      return <Select
        name={name}
        className={className}
        label={label}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        value={value}
        startContent={startContent}>{children}</Select>
    } } />
  );
}
