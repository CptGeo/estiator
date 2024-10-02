import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";
import { ReactElement } from "react";

export default function ReservationDate(): ReactElement {
  // Dummy max date
  const maxValue = new CalendarDate(2024, 11, 1);

  // Min date starting from tomorrow
  const minValue = today(getLocalTimeZone()).add({ days: 1 });

  return (
    <DatePicker
      label="Reservation date"
      className="max-w-50"
      isRequired
      minValue={minValue}
      defaultValue={minValue}
      maxValue={maxValue}
      onChange={(e) => console.log(e)}
    />
  );
}
