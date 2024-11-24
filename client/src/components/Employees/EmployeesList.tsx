import MailIcon from "@components/Icons/MailIcon";
import MenuDotsIcon from "@components/Icons/MenuDotsIcon";
import IconSuitcase from "@components/Icons/SuitcaseIcon";
import TableClockIcon from "@components/Icons/TableClockIcon";
import type { EmployeeData } from "@core/types";
import { Roles } from "@core/types";
import useQueryEmployees from "@hooks/useQueryEmployees";
import { parseDate } from "@internationalized/date";
import { Avatar, Button, Card, CardBody, CardHeader, Chip } from "@nextui-org/react";

export default function EmployeesList() {
  const { data: employees } = useQueryEmployees(500);

  function EmployeeCard(props: { employee: EmployeeData } ) {
    const employee = props.employee;

    return (
      <div className="w-full sm:w-[50%] md:w-[33.3%] xl:w-[25%] p-2">
        <Card className="py-1 px-1 h-full">
          <CardHeader className="pb-0 pt-0 flex-col items-start">
            <div className="flex flex-row items-center justify-between grow w-full">
              <Chip color="success" className="text-white" variant="solid">Active</Chip>
              <Button isIconOnly variant="light"><MenuDotsIcon className="text-xl" /></Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex justify-center flex-col items-center">
                <Avatar
                  isBordered
                  src={employee.profileImage}
                  className="w-20 h-20 text-large mb-3"
                  name={`${employee.name.charAt(0).toUpperCase()} ${employee.surname
                    .charAt(0)
                    .toUpperCase()}`}
                    />
                <h4>{`${employee.name} ${employee.surname}`}</h4>
                <p className="text-foreground-400 text-sm">{Roles[employee.role]}</p>
                <div className="bg-content2 rounded-lg p-3 mt-3 border-1 shadow-inner shadow-slate-100 border-slate-200 w-full">
                  <ul className="flex gap-2 flex-col">
                    <ul className="inline-flex items-center gap-2">
                      <li className="inline-flex items-center text-xs gap-1"><IconSuitcase />{Roles[employee.role]}</li>
                      <li className="inline-flex items-center text-xs gap-1"><TableClockIcon /> Fulltime</li>
                    </ul>
                    <li className="inline-flex items-center text-xs gap-1"><MailIcon /><a href={`mailto:${employee.email}`} className="break-all">{employee.email}</a></li>
                  </ul>
                </div>
                <div className="flex text-xs flex-row justify-between w-full items-center mt-2">
                  <p>
                    <span className="text-foreground-400">Joined at </span>
                    {parseDate(employee.registrationDate).toString()}
                  </p>
                  <a href="#" className="underline">View details</a>
                </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return <div className="flex flex-wrap">
    {employees?.map(employee => <EmployeeCard key={employee.id} employee={employee} />)}
  </div>
}
