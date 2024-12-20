import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import EmployeesList from "@components/Employees/EmployeesList";

export default function EmployeesManagementPage(): ReactElement {
  return (
    <>
      <PageHeader
        heading="Employees Management"
        subheading="Here you can manage the business staff, assign them to tables and more."
      />
      <EmployeesList />
    </>
  );
}
