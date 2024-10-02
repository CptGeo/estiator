import { Button, Input } from "@nextui-org/react";
import { ReactElement } from "react";
import ReservationDate from "../../components/ReservationDate/ReservationDate";
import ReservationTime from "../../components/ReservationTime/ReservationTime";

export default function ReservationPage(): ReactElement {


  return (
    <div className="reservation">
      <div className="container max-w-[650px] mx-auto px-3 pb-5">
        {/* title */}
        <div className="py-4">
          <h3 className="mb-0 text-xl">Reserve a table</h3>
          <p className="mt-0 text-xs text-slate-400">
            Find the best table for you.
          </p>
        </div>

        <form className="mx-auto" noValidate>
          <div className="flex w-full flex-wrap gap-4">
						<div className="flex w-full flex-wrap md:flex-nowrap gap-4">
							<ReservationDate />
							<ReservationTime />
						</div>
						<div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            	<Input type="Name" label="Name" name="name" />
            	<Input type="email" label="Email" />
						</div>

						<Button color="primary" type="submit" variant="flat" >Reserve</Button>
						
          </div>
        </form>
      </div>
    </div>
  );
}
