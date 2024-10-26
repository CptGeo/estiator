import { DatePicker } from "@nextui-org/react";
import { today } from "@internationalized/date";

export default function DateTimeField() {
  return (
      <DatePicker
        className="max-w-xs"
        granularity="day"
        defaultValue={today("GMT")}
      />
  );
}