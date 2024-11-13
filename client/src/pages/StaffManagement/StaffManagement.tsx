import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";

export default function StaffManagementPage(): ReactElement {
  return (
    <>
      <PageHeader
        heading="Staff Management"
        subheading="Here you can manage the business staff, assign them to tables and more"
      />
    </>
  );
}
