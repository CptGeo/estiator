import { Time } from "@internationalized/date";
import { AccessTime } from "@mui/icons-material";
import type { SelectProps } from "@nextui-org/react";
import { SelectItem } from "@nextui-org/react";
import type { ReactElement } from "react";
import SelectField from "@components/Fields/Select";
import type { OperationalTime } from "@core/types";

type Props = {
  name: string;
  label: string;
} & Omit<SelectProps, "children"> ;

export default function TimeField(props: Props): ReactElement {
  const { name, defaultSelectedKeys, ...rest } = props;

  /**
   * Times mock date
   *
   * @todo Business operational times should be set by the administrator and showed
   */
  const times: OperationalTime[] = [
    { key: 0, hour: 8, minute: 0 },
    { key: 1, hour: 8, minute: 30 },
    { key: 2, hour: 9, minute: 0 },
    { key: 3, hour: 9, minute: 30 },
    { key: 4, hour: 10, minute: 0 },
    { key: 5, hour: 10, minute: 30 },
    { key: 6, hour: 11, minute: 0 },
    { key: 7, hour: 11, minute: 30 },
    { key: 8, hour: 12, minute: 0 },
    { key: 9, hour: 12, minute: 30 },
    { key: 10, hour: 13, minute: 0 },
    { key: 11, hour: 13, minute: 30 },
    { key: 12, hour: 14, minute: 0 },
    { key: 13, hour: 14, minute: 30 },
    { key: 14, hour: 15, minute: 0 },
    { key: 15, hour: 15, minute: 30 },
    { key: 16, hour: 16, minute: 0 },
    { key: 17, hour: 16, minute: 30 },
    { key: 18, hour: 17, minute: 0 },
    { key: 19, hour: 17, minute: 30 },
    { key: 20, hour: 18, minute: 0 },
    { key: 21, hour: 18, minute: 30 },
    { key: 22, hour: 19, minute: 0 },
    { key: 23, hour: 19, minute: 30 },
    { key: 24, hour: 20, minute: 0 },
    { key: 25, hour: 20, minute: 30 },
    { key: 26, hour: 21, minute: 0 },
    { key: 27, hour: 21, minute: 30 },
    { key: 28, hour: 22, minute: 0 },
    { key: 29, hour: 22, minute: 30 },
    { key: 30, hour: 23, minute: 0 },
    { key: 31, hour: 23, minute: 30 }
  ];

  const parsedTime = times.map(time => {
    const t = new Time(time.hour, time.minute);
    const label = t.toString().slice(0, -3);
    return { key: label, label };
  });

  return (
    <SelectField
      {...rest}
      defaultSelectedKeys={defaultSelectedKeys}
      startContent={<AccessTime fontSize="small"/>}
      name={name}>
          {parsedTime.map( (time) => {
            return <SelectItem key={time.key}>{time.label}</SelectItem>
          })}
      </SelectField>
    );
}
