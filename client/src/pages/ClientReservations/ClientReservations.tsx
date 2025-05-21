import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import ClientReservationsTable from "@components/ClientReservations/Table";

export default function ClientReservations(): ReactElement {

  return (
    <>
      <PageHeader
        heading="My Reservations"
        subheading="Here you can see your active and completed reservations."
      />
      <ClientReservationsTable />
    </>
  );
}
