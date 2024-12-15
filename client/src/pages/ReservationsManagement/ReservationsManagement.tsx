import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import ReservationsTable from "@components/Reservations/Table";

export default function ReservationsManagementPage(): ReactElement {
  return (
    <>
      <PageHeader
        heading="Reservations management"
        subheading="Here you can manage existing or create new reservations for your business."
      />
      <ReservationsTable />
    </>
  );
}
