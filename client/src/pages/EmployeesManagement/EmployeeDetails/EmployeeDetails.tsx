import EmployeeInfo from "@components/Employees/EmployeeInfo/EmployeeInfo";
import useQueryEmployee from "@hooks/useQueryEmployee";
import { Skeleton } from "@nextui-org/react";
import { type ReactElement } from "react";
import { useParams } from "react-router-dom";

export default function EmployeeDetails(): ReactElement {
  const { id } = useParams();
  const { data: employee } = useQueryEmployee(id);

  if (!employee) {
    return (
      <>
        <Skeleton className="w-[150px] h-[30px] mb-1" />
        <Skeleton className="min-w-[200px] w-[50%] h-[20px]" />
      </>
    )
  }

  return <EmployeeInfo employee={employee} />
}