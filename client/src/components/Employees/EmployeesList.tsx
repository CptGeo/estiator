import Status from "@components/Status/Employee/Status";
import { UserRoleName, type UserData } from "@core/types";
import { allRoutes, formatDateTime, getInitials, parseTimestamp, Routes } from "@core/utils";
import useQueryEmployees from "@hooks/useQueryEmployees";
import { Avatar, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { AddCircleTwoTone, BusinessCenterTwoTone, BusinessTwoTone } from "@mui/icons-material";

export default function EmployeesList() {
  const navigate = useNavigate();
  const { data: employees } = useQueryEmployees(500);

  function EmployeeCard(props: { employee: UserData } ) {
    const employee = props.employee;
    const createdDate = formatDateTime(parseTimestamp(employee.createdDate));

    return (
      <div className="w-full sm:w-[50%] md:w-[33.3%] xl:w-[25%] p-2">
        <Card className="py-1 px-1 h-full">
          <CardHeader className="pb-0 pt-2 flex-col items-start">
            <div className="flex flex-row items-center justify-between grow w-full">
              <Status status={employee.status} />
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex justify-center flex-col items-center">
                <Avatar
                  isBordered
                  src={employee.profileImage}
                  className="w-20 h-20 text-large mb-3"
                  name={getInitials(employee)} />
                <h4>{`${employee.name} ${employee.surname}`}</h4>
                <p className="text-foreground-400 text-sm"><a href={`mailto:${employee.email}`} className="break-all">{employee.email}</a></p>
                <div className="bg-content2 rounded-lg p-3 mt-3 border-1 shadow-inner shadow-slate-100 border-slate-200 w-full">
                  <ul className="flex gap-2 flex-col">
                    <ul className="inline-flex items-center gap-2">
                      <li className="inline-flex items-center text-xs gap-1"><BusinessTwoTone fontSize="small" />{UserRoleName[employee.userRole]}</li>
                      {employee.position && <li className="inline-flex items-center text-xs gap-1"><BusinessCenterTwoTone fontSize="small" />{employee.position}</li>}
                    </ul>
                  </ul>
                </div>
                <div className="flex text-xs flex-row justify-between w-full items-center mt-2">
                  <p>
                    <span className="text-foreground-400">Added on </span>
                    <span className="text-xs">{createdDate}</span>
                  </p>
                  <Link className="underline" to={`${employee.id}`}>View details</Link>
                </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return <div className="flex flex-col">
    <div className="flex flex-row justify-between items-end pb-5">
      <p className="text-default-400 text-tiny">{employees && employees.length > 0 && `Total employees: ${employees?.length}`}</p>
      <Button onPress={() => navigate(allRoutes[Routes.REGISTER])} color="primary">Register user  <AddCircleTwoTone fontSize="small" /></Button>
    </div>
    <div className="flex flex-wrap">
      {employees?.map(employee => <EmployeeCard key={employee.id} employee={employee} />)}
    </div>
  </div>
}
