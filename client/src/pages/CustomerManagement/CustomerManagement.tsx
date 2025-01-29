import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import CustomersTable from "@components/Customers/Table";

export default function ReservationsManagementPage(): ReactElement {
  return (
    <>
      <PageHeader
        heading="Customers management"
        subheading="Here you can manage you business customer accounts"
      />
      <CustomersTable />
    </>
  );
}
