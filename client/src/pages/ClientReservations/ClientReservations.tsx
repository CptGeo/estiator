import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import useQuerySetting from "@hooks/useQuerySetting";
import ClientReservationsTable from "@components/ClientReservations/Table";

export default function ClientReservations(): ReactElement {
  // @todo: Put in context
  const { data: defaultRowsPerPage } = useQuerySetting("defaultRowsPerPage");

  return (
    <>
      <PageHeader
        heading="My Reservations"
        subheading="Here you can see your active and completed reservations."
      />
      {defaultRowsPerPage && <ClientReservationsTable defaultRowsPerPage={defaultRowsPerPage} />}
    </>
  );
}
