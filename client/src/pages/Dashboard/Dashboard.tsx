import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import ReservationWidget from "@components/Widget/Reservation";

export default function DashboardPage(): ReactElement {
  return (
    <>
      <PageHeader
        heading="Dashboard"
        subheading="Here you can manage existing or create new reservations for your business."
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="grid gap-4">
          <div className="h-auto max-w-full rounded-lg">
            {/* Render widget here */}
            <ReservationWidget />
          </div>
        </div>
      </div>
    </>
  );
}