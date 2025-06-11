import type { ReactElement } from "react";
import type { AutocompleteItemProps } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Controller } from "react-hook-form";
import type { ControlledAutocompleteProps } from "@components/Fields/types";
import type { Key } from "@core/types";

type AutocompleteOption = {
  key: string | number,
  label: string,
  description: string
}

export default function AutocompleteField(props: Omit<ControlledAutocompleteProps, 'children'>): ReactElement {
  const { defaultItems, onChange: onChangeCustom, name, isRequired = false, rules, onSelectionChange, ...rest } = props;

  return (
    <Controller rules={{ ...rules, required: isRequired }} defaultValue={defaultItems} name={name} render={({ field: { onChange, onBlur, value, ref } }) => {
      return (
        <Autocomplete<AutocompleteItemProps<AutocompleteOption>>
          {...rest}
          isRequired={isRequired}
          name={name}
          onSelectionChange={(key: Key | null) => {
            onSelectionChange?.(key);
            onChange(key);
          }}
          onChange={(e) => {
            onChange(e);
            if (onChangeCustom) {
              onChangeCustom(e);
            }
          }}
          onBlur={onBlur}
          ref={ref}
          selectedKey={value}
          items={defaultItems}
        >
          {/* {children} */}
          {(item) => <AutocompleteItem key={item.key}>{item.title}</AutocompleteItem>}
        </Autocomplete>
      );
    } } />
  );
}
