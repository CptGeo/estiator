import { Button } from "@heroui/react";
import { Star, StarOutline } from "@mui/icons-material";
import type { SyntheticEvent } from "react";
import { useState } from "react";
import type { PressEvent } from "@react-types/shared";
import type { RegisterOptions } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

const MAX_RATING = 6;

const TEXT_VALUE = [
  "Utter disaster",
  "Very disappointing",
  "Below average",
  "It was fine",
  "Very good",
  "Outstanding!"
]

export default function ReviewStars({ name, label, isRequired = false }: { name: string, label: string, isRequired?: boolean }) {
  const methods = useFormContext();

  const rules: RegisterOptions = {
      required: {
        message: "This field is required",
        value: isRequired ? isRequired : false
    }
  }

  return <Controller rules={rules} {...methods.register(name)} render={({ field: { value, onChange }, fieldState: { error } }) => {
    const [hoveredCount, setHoveredCount] = useState(0);

    function handleHover(e: SyntheticEvent<HTMLButtonElement>) {
      const ratingString = (e.target as HTMLButtonElement).value ?? "0";
      const rating = Number.parseInt(ratingString, 10);
      setHoveredCount(rating);
    }

    function handleMouseLeave() {
      setHoveredCount(0);
    }

    function handlePress(e: PressEvent) {
      const ratingString = (e.target as HTMLButtonElement).value ?? "0";
      const rating = Number.parseInt(ratingString, 10);
      onChange(rating === value ? undefined : rating);
    }

    function getIcon(key: number) {
      if (value == undefined) {
        return key <= hoveredCount ? <Star /> : <StarOutline />;
      }
      return key <= value ? <Star /> : <StarOutline />;
    }

    function getTextValue() {
      if (value) {
        return TEXT_VALUE[value - 1];
      }

      return TEXT_VALUE[hoveredCount - 1];
    }
    return <div>
      <label className="text-[14px]">{label}</label>
      <div className="flex flex-nowrap gap-5 items-center">
        <div className="flex flex-nowrap">
          {Array(MAX_RATING).fill(0).map((_, i) => {
            return <Button key={i + 1} value={i + 1} size="sm" color="warning" isIconOnly variant="light" style={{ backgroundColor: 'unset' }} onPress={handlePress} onMouseLeave={handleMouseLeave} onMouseEnter={handleHover}>{getIcon(i + 1)}</Button>
          })}
        </div>
        {(value || hoveredCount > 0) && (
          <>
            <p className="text-foreground-600">—</p>
            <p className="text-foreground-600 italic">{getTextValue()}</p>
          </>
        )
        }
      </div>
      {error && <small className="text-red-600">{error.message}</small>}
    </div>
  }} />
}