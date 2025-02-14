import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import ReservationWidget from "@components/Widget/Reservation";
import MonthReservations from "@components/Minicard/MonthReservations";
import TotalCapacity from "@components/Minicard/TotalCapacity";
import TotalTables from "@components/Minicard/TotalTables";
import TableAvailabilityWidget from "@components/Widget/TableAvailability";
import EmployeesStatusWidget from "@components/Widget/EmployeesStatus";

export default function DashboardPage(): ReactElement {
  return (
    <>
      <PageHeader
        heading="Dashboard"
      />
      <div className="gap-7 flex flex-row flex-nowrap mb-5 w-full shrink-0 p-1 overflow-auto relative no-scrollbar">
        <MonthReservations />
        <TotalTables />
        <TotalCapacity />
      </div>
      <div className="grid grid-cols-4 md:grid-cols-12 gap-8 p-1">
        <div className="gap-8 col-span-full sm:col-span-12 md:col-span-12 lg:col-span-10 xl:col-span-7 grid grid-cols-8">
          <div className="col-span-full">
            <ReservationWidget />
          </div>
          <div className="col-span-6">
            <EmployeesStatusWidget />
          </div>
        </div>
        <div className="gap-4 col-span-full sm:col-span-8 md:col-span-9 lg:col-span-7 xl:col-span-3">
          <TableAvailabilityWidget />
        </div>
      </div>
    </>
  );
}
