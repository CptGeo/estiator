import { Button } from "@nextui-org/react";
import { ReservationStatus } from "@core/types";

/** @todo This could be a nice status changer */
export default function StatusGroupField(props: { status: ReservationStatus } ) {
  const status  = props.status;

  return (
    <div className="flex gap-1 rounded-xl p-2 bg-default-100">
      <Button variant={status === ReservationStatus.COMPLETED ? "flat" : "light"} color={status === ReservationStatus.COMPLETED ? "primary" : "default"}>Completed</Button>
      <Button variant={status === ReservationStatus.CONFIRMED ? "flat" : "light"} color={status === ReservationStatus.CONFIRMED ? "success" : "default"}>Confirmed</Button>
      <Button variant={status === ReservationStatus.PENDING ? "flat" : "light"} color={status === ReservationStatus.PENDING ? "warning" : "default"}>Pending</Button>
      <Button variant={status === ReservationStatus.CANCELLED ? "flat" : "light"} color={status === ReservationStatus.CANCELLED ? "default" : "default"}>Cancelled</Button>
    </div>
  )
}
