import { type ReactElement } from "react";
import phones from "../../../phones.json";
import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import type { ControlledAutocompleteProps } from "./types";
import { getAssetUrl } from "@core/utils";
import { Controller } from "react-hook-form";

export default function CountryCodeField(props: Omit<ControlledAutocompleteProps, "children">): ReactElement {
  const { name, label, defaultSelectedKey = phones.gr.extension, isRequired, rules, ...rest } = props;

  return <Controller
    defaultValue={defaultSelectedKey}
    name={name}
    rules={{ ...rules, required: isRequired }}
    render={({ field: { onChange, onBlur, value, ref } }) => <Autocomplete {...rest} isRequired={isRequired} onSelectionChange={onChange} onBlur={onBlur} selectedKey={value} ref={ref} label={label}>
      {Object.entries(phones).map(phone => <AutocompleteItem
        startContent={<Avatar className="w-6 h-6" src={getAssetUrl(`/flags/${phone[0]}.png`)} />} key={phone[1].extension}>{`${phone[1].country} (${phone[1].extension})`}
      </AutocompleteItem>)}
    </Autocomplete>}>
  </Controller>
}