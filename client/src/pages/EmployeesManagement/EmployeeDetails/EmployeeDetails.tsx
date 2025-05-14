import EmployeeInfo from "@components/Employees/EmployeeInfo/EmployeeInfo";
import EmployeeSchedule from "@components/EmployeeSchedule/EmployeeSchedule";
import useQueryUser from "@hooks/useQueryUser";
import { Skeleton } from "@heroui/react";
import NotFound from "@pages/Errors/ResourceNotFound";
import { type ReactElement } from "react";
import { useParams } from "react-router-dom";

export default function EmployeeDetails(): ReactElement {
  const { id } = useParams();
  const { data } = useQueryUser(id, { registered: true });

  if (!data) {
    return (
      <>
        <Skeleton className="w-[150px] h-[30px] mb-1" />
        <Skeleton className="min-w-[200px] w-[50%] h-[20px]" />
      </>
    )
  }
  if (!data.id) {
    return <NotFound resourceName="Employee" url={window.location.pathname} />
  }

  return (
    <>
      <EmployeeInfo employee={data} />
      <EmployeeSchedule employee={data} />
    </>
  );
}