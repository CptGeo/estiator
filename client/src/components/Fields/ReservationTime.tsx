import type { ReactElement } from "react";
import { Time } from "@internationalized/date";
import { AccessTime } from "@mui/icons-material";
import { SelectItem } from "@nextui-org/react";
import SelectField from "@components/Fields/Select";
import type { OperationalTime } from "@core/types";

type Props = {
  name: string;
  label: string;
  placeholder: string;
  className?: string;
};

export default function ReservationTimeField(props: Props): ReactElement {
  const { name, ...rest } = props;

  /**
   * Times mock date
   *
   * @todo Business operational times should be set by the administrator and showed
   */
  const times: OperationalTime[] = [
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
    return { key: time.key, label: `${t.hour}:${t.minute}` };
  });

  return (
    <SelectField
      {...rest}
      startContent={<AccessTime fontSize="small"/>}
      name={name}>
          {parsedTime.map( (time) => {
            return <SelectItem key={time.key}>{time.label}</SelectItem>
          })}
      </SelectField>
    );
}
