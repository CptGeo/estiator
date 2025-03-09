import { ScheduleStatus, ScheduleStatuses, type Schedule } from "@core/types";
import { dayToString, getFullName, toParsedTimeString } from "@core/utils";
import { getDayOfWeek, today } from "@internationalized/date";
import {
  Button,
  ButtonGroup,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from "@heroui/react";
import { useCallback, useState } from "react";
import useQuerySchedules from "@hooks/useQuerySchedules";
import { Link } from "react-router-dom";
import { HistoryTwoTone } from "@mui/icons-material";

const columns = [
  { name: "Employee", uid: "employee" },
  { name: "Role", uid: "role" },
  { name: "Start Time", uid: "startTime" },
  { name: "End Time", uid: "endTime" },
  { name: "Status", uid: "status" },
];

export default function EmployeesStatusWidget() {
  const [current, setCurrent] = useState(0);
  const currentDate = today("Europe/Athens").add({ days: current });
  const previousDate = currentDate.subtract({ days: 1 });
  const nextDate = currentDate.add({ days: 1 });

  const { data: schedules, isLoading } = useQuerySchedules(3000, {}, { date: currentDate.toString() });

  const renderRow = useCallback((schedule: Schedule) => {
    return (
      <TableRow key={schedule.id.toString()}>
        <TableCell className="w-[30%]" textValue="Date">
          <User
            avatarProps={{ radius: "full", size: "sm" }}
            classNames={{
              description: "text-default-500"
            }}
            description={schedule.user?.email || schedule.user?.phone}
            name={getFullName(schedule.user)}
          />
        </TableCell>
        <TableCell className="w-[30%]" textValue="Start Time">
          <p className="text-tiny">
            {schedule.user.position}
          </p>
        </TableCell>
        <TableCell className="w-[10%]" textValue="Start Time">
            {toParsedTimeString(schedule.startTime)}
        </TableCell>
        <TableCell className="w-[10%]" textValue="End Time">
            {toParsedTimeString(schedule.endTime)}
        </TableCell>
        <TableCell className="w-[10%]" textValue="Status">
          <Chip variant="dot" color={schedule.status == ScheduleStatus.WORKING ? "success" : schedule.status == ScheduleStatus.SICK ? "warning" : "primary"}>
            {ScheduleStatuses[schedule.status]}
          </Chip>
        </TableCell>
      </TableRow>
    )
  }, [schedules])

  function TopContent() {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-foreground-500 font-bold">Daily Employees</h4>
          <p className="mt-0 text-xs text-slate-400">View the daily status of your employees.</p>
        </div>
        <div className="flex-grow w-full">
          <ButtonGroup fullWidth>
            <Button isIconOnly color="warning" variant="solid" isDisabled disableRipple disableAnimation />
            <Button color="default" variant="flat" onPress={() => setCurrent(current - 1)}>
              <div className="flex flex-col w-full box-border text-center">
                <h5 className="m-0 text-[0.8rem]">
                  {dayToString(getDayOfWeek(previousDate, "en-UK"))}
                </h5>
                <p className="text-[0.8rem] m-0">{previousDate.toString()}</p>
              </div>
            </Button>
            <Button color="primary" variant="solid">
              <div className="flex flex-col w-full box-border text-center">
                <h3 className="m-0">
                  {dayToString(getDayOfWeek(currentDate, "en-UK"))}
                </h3>
                <p className="text-[1rem] m-0">{currentDate.toString()}</p>
              </div>
            </Button>
            <Button color="default" variant="flat" onPress={() => setCurrent(current + 1)}>
              <div className="flex flex-col w-full box-border text-center">
                <h3 className="m-0 text-[0.8rem]">
                  {dayToString(getDayOfWeek(nextDate, "en-UK"))}
                </h3>
                <p className="text-[0.8rem] m-0">{nextDate.toString()}</p>
              </div>
            </Button>
            <Tooltip content="Reset to current date" showArrow placement="right">
              <Button isIconOnly color="warning" className="text-background" onPress={() => setCurrent(0)}>
                <HistoryTwoTone className="text-lg" />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </div>
      </div>
    )
  }

  return (
    <Table
      classNames={{ emptyWrapper: "h-16" }}
      aria-label="Example table with custom cells"
      topContent={<TopContent />}
      bottomContent={<small><Link className="text-primary px-1" to={"/employees-management"}>View employees management</Link></small>}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={<p>No schedules on current date</p>}
        isLoading={isLoading}
        items={(schedules || []) as Iterable<Schedule>}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(schedule: Schedule) => renderRow(schedule)}
      </TableBody>
    </Table>
  );
}
