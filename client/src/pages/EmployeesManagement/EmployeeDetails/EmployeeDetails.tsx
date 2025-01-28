import EmployeeInfo from "@components/Employees/EmployeeInfo/EmployeeInfo";
import EmployeeSchedule from "@components/EmployeeSchedule/EmployeeSchedule";
import useQueryUser from "@hooks/useQueryUser";
import { Skeleton } from "@heroui/react";
import NotFound from "@pages/Errors/ResourceNotFound";
import { type ReactElement } from "react";
import { useParams } from "react-router-dom";

export default function EmployeeDetails(): ReactElement {
  const { id } = useParams();
  const { data: employee, isError } = useQueryUser(id, { registered: true });

  if (!employee) {
    if (isError) {
      return <NotFound resourceName="Employee" url={window.location.pathname} />
    }
    return (
      <>
        <Skeleton className="w-[150px] h-[30px] mb-1" />
        <Skeleton className="min-w-[200px] w-[50%] h-[20px]" />
      </>
    )
  }

  return (
    <>
      <EmployeeInfo employee={employee} />
      <EmployeeSchedule employee={employee} />
    </>
  );
}