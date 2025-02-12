import type { Color } from "@core/types";
import { ReservationStatus } from "@core/types";
import { Button } from "@heroui/react";
import type { PropsWithChildren, ReactElement } from "react";
import { createContext, useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
}

type ContextProps = {
  selectedValue: ReservationStatus | null;
  onChange: (...event: unknown[]) => void;
}

const reservationStatusContext = createContext<ContextProps>({ selectedValue: null, onChange: () => {} });

export default function ReservationStatusField({ name, label, children }: PropsWithChildren<Props>) {
  const methods = useFormContext();
  const ReservationStatusContextProvider = reservationStatusContext.Provider;

  return (
    <Controller {...methods.register(name)} render={({ field: { onChange, value, ref } }) => {
      return (
        <ReservationStatusContextProvider value={{ selectedValue: value, onChange: onChange }}>
          <div className="p-3 rounded-lg" ref={ref}>
            <p className="text-xs text-default-600 mb-2">{label}</p>
            <div className="flex gap-1 rounded-xl p-2 bg-default-100" >
              {children}
            </div>
          </div>
        </ReservationStatusContextProvider>)
    }} />
  )
}

export function ReservationStatusOption({ status } : { status: ReservationStatus; }): ReactElement {
  const { selectedValue, onChange } = useContext(reservationStatusContext);
  const selected = selectedValue === status;

  const colorsMap: Record<ReservationStatus, Color> = {
    [ReservationStatus.COMPLETED]: "primary",
    [ReservationStatus.CANCELLED]: "default",
    [ReservationStatus.CONFIRMED]: "success",
    [ReservationStatus.BOOKED]: "secondary",
    [ReservationStatus.PENDING]: "warning"
  }

  return <Button
    onPress={() => onChange(status)}
    value={status}
    variant={selected ? "flat" : "light"}
    color={selected ? colorsMap[status] : "default"}>{status}
  </Button>
}