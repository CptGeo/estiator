import { Time } from "@internationalized/date";
import { AccessTime } from "@mui/icons-material";
import { Select, SelectItem } from "@nextui-org/react";
import { ReactElement } from "react";


export default function ReservationTime(): ReactElement {
  const times = [
    {
      key: 0,
      hour: 13,
      minute: 30
    },
    {
      key: 1,
      hour: 14,
      minute: 30
    },
    {
      key: 2,
      hour: 15,
      minute: 30
    },
  ];

  return (
    <Select
      name="reservation-time"
      className="max-w-xs"
      label="Reservation time"
      placeholder="Select time"
      startContent={<AccessTime fontSize="small" />}
    >
      {times.map( (time) => {
        const t = new Time(time.hour, time.minute);
        return <SelectItem key={time.key}>{t.hour}:{t.minute}</SelectItem>
      })}
    </Select>
  );
}
