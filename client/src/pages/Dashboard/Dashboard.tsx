import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import ReservationWidget from "@components/Widget/Reservation";
import MonthReservations from "@components/Minicard/MonthReservations";
import TotalCapacity from "@components/Minicard/TotalCapacity";

export default function DashboardPage(): ReactElement {
  return (
    <>
      <PageHeader
        heading="Dashboard"
      />
      <div className="gap-7 flex flex-row flex-nowrap mb-5 w-full shrink-0 p-1 overflow-auto relative no-scrollbar">
        <MonthReservations />
        <TotalCapacity />
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4 p-1">
        <div className="grid gap-4 col-span-full sm:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="h-auto max-w-full rounded-lg">
            <ReservationWidget />
          </div>
        </div>
      </div>
    </>
  );
}
