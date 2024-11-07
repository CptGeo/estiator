import { Button } from "@nextui-org/react";
import classNames from "classnames";
import type { PropsWithChildren, ReactElement } from "react";
import { createContext, useContext } from "react";
import { Controller } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  defaultValue: string;
}

type ContextProps = {
  selectedValue: string | null;
  onChange: (...event: unknown[]) => void;
}

const colorPickerContext = createContext<ContextProps>({ selectedValue: null, onChange: () => {} });

export default function ColorPickerField({ name, label, defaultValue, children }: PropsWithChildren<Props>) {
  const ColorPickerContextProvider = colorPickerContext.Provider;

  return (
    <Controller name={name} defaultValue={defaultValue} render={({ field: { onChange, value, ref } }) => {
      return (
        <ColorPickerContextProvider value={{ selectedValue: value, onChange: onChange }}>
          <div className="flex-col max-w-full bg-default-100 p-3 rounded-lg flex items-start" ref={ref}>
            <p className="text-xs text-default-600 mb-2">{label}</p>
            <div className="flex flex-row gap-2 flex-wrap">
              {children}
            </div>
          </div>
        </ColorPickerContextProvider>)
    }} />
  )
}

export function ColorPickerOption({ value } : { value: string; }): ReactElement {
  const { selectedValue, onChange } = useContext(colorPickerContext);
  const selected = selectedValue === value;

  return <Button
      onClick={() => onChange(value)}
      value={value} isIconOnly
      className={classNames(value, selected ? "border-4 border-indigo-700 shadow-sm": "")}
    />
}