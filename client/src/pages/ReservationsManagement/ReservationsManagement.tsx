import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import ReservationsTable from "@components/Reservations/Table";
import useQuerySetting from "@hooks/useQuerySetting";

export default function ReservationsManagementPage(): ReactElement {
  // @todo: Put in context
  const { data: defaultRowsPerPage } = useQuerySetting("defaultRowsPerPage");

  return (
    <>
      <PageHeader
        heading="Reservations management"
        subheading="Here you can manage existing or create new reservations for your business."
      />
      {defaultRowsPerPage && <ReservationsTable defaultRowsPerPage={defaultRowsPerPage} />}
    </>
  );
}
