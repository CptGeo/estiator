import { Button } from "@nextui-org/react";
import type { ReservationStatus } from "@core/types";

/** @todo This could be a nice status changer */
export default function StatusGroupField(props: { status: ReservationStatus } ) {
  const status  = props.status;

  return (
    <div className="flex gap-1 rounded-xl p-2 bg-default-100">
      <Button variant={status === "completed" ? "flat" : "light"} color={status === "completed" ? "primary" : "default"}>Completed</Button>
      <Button variant={status === "confirmed" ? "flat" : "light"} color={status === "confirmed" ? "success" : "default"}>Confirmed</Button>
      <Button variant={status === "pending" ? "flat" : "light"} color={status === "pending" ? "warning" : "default"}>Pending</Button>
      <Button variant={status === "cancelled" ? "flat" : "light"} color={status === "cancelled" ? "default" : "default"}>Cancelled</Button>
    </div>
  )
}
