import { type ReactElement } from "react";
import phones from "../../../phones.json";
import { Avatar, Select, SelectItem } from "@heroui/react";
import { Controller } from "react-hook-form";
import type { ControlledSelectProps } from "./types";
import { getAssetUrl } from "@core/utils";

export default function PhoneCodeField(props: Omit<ControlledSelectProps, "children">): ReactElement {
  const { name, defaultSelectedKeys, ...rest } = props;

  return (
    <Controller defaultValue={defaultSelectedKeys} name={name} render={({ field: { onChange, onBlur, value, ref } }) => {
      return (<Select
        {...rest}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        isVirtualized
        ref={ref}
        defaultSelectedKeys={Array.isArray(value) ? value : [value]}
        classNames={{
          base: "max-w-xs",
          trigger: "min-h-12 py-2",
        }}
        isMultiline={true}
        items={Object.entries(phones)}
        placeholder="Select country code"
        renderValue={(items) => {
          return (
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <div className="flex flex-row gap-2 items-center" key={item.key}>
                  <Avatar alt={item.data?.[1].country} title={item.data?.[1].country} className="w-5 h-5 shrink-0" src={getAssetUrl(`/flags/${item.data?.[0]}.png`)} />
                  <span className="text-md text-default-400 shrink-0">{item.data?.[1].extension}</span>
                </div>
              ))}
            </div>
          );
        }}
        selectionMode="single"
        variant="bordered"
      >
        {(phone) => {
          return (
            <SelectItem
              key={phone[1]?.extension}
              content={phone[1]?.country}
              textValue={phone[1]?.country}
              startContent={<Avatar alt={phone[1].country} title={phone[1].country} className="w-6 h-6" src={getAssetUrl(`/flags/${phone[0]}.png`)} />}
            >
            {phone[1].country}
          </SelectItem>
          );
        }}
      </Select>)
    }} />
  );
}