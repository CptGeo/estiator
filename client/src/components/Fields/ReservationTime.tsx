import { Time } from "@internationalized/date";
import { AccessTime } from "@mui/icons-material";
import { SelectItem } from "@nextui-org/react";
import { ReactElement } from "react";
import SelectField from "./Select";


type Props = {
  name: string;
};

export default function ReservationTimeField(props: Props): ReactElement {
  const { name } = props;

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

  const parsedTime = times.map(time => { 
    const t = new Time(time.hour, time.minute);
    return {key: time.key, label: `${t.hour}:${t.minute}`}  
  });

  return (
    <SelectField 
      className="max-w-xs"
      label="Reservation time"
      placeholder="Select time"
      startContent={<AccessTime fontSize="small"/>}
      name={name}>
          {parsedTime.map( (time) => {
            return <SelectItem key={time.key}>{time.label}</SelectItem>
          })}
      </SelectField>
    );
}
