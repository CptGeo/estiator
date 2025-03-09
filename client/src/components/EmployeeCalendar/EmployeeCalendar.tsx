import IconButton from "@components/IconButton/IconButton";
import { DeleteIcon } from "@components/Icons/DeleteIcon";
import { ScheduleStatus, ScheduleStatuses, type Schedule, type UserData } from "@core/types";
import { dayToString, deleteReq, toParsedTimeString } from "@core/utils";
import useQueryUserScheduleByDate from "@hooks/useQueryUserScheduleByDate";
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
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNotification } from "@context/Notification";

type Props = {
  user: UserData;
};

const columns = [
  { name: "START TIME", uid: "startTime" },
  { name: "END TIME", uid: "endTime" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" }
];

export default function EmployeeCalendar({ user }: Props) {
  const [current, setCurrent] = useState(0);
  const date = today("Europe/Athens").add({ days: current });
  const { notify } = useNotification();

  const { data: schedule, isLoading } = useQueryUserScheduleByDate(
    user.id,
    date.toString()
  );
  const queryClient = useQueryClient();

  const { mutateAsync: deleteSchedule } = useMutation({
    mutationFn: (schedule: Schedule) => deleteReq(`schedules/${schedule.id}`),
    onMutate: (variables) => {
      return { schedule: variables }
    },
    onSettled: (_, __, ___, context) => queryClient.refetchQueries( { queryKey: [`users/${user.id}/schedule/${context?.schedule.date}`] }),
    onSuccess: () => notify({ message: "Employee schedule has been deleted successfully!", type: "success" }),
    onError: () => notify({ message: "Employee schedule could not be deleted.", type: "danger" })
  })

  return (
    <div className="flex flex-col">
      <div className="flex-grow w-full pb-3">
        <ButtonGroup fullWidth>
          <Button color="default" onPress={() => setCurrent(current - 1)}>
            Previous
          </Button>
          <div className="flex flex-col w-full box-border text-center bg-foreground-100">
            <h3 className="m-0 min-w-[150px]">
              {dayToString(getDayOfWeek(date, "en-UK"))}
            </h3>
            <p className="text-xs m-0">{date.toString()}</p>
          </div>
          <Button color="default" onPress={() => setCurrent(current + 1)}>
            Next
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex">
        <Table
          topContentPlacement="outside"
          aria-label="Example table with custom cells"
          bottomContentPlacement="outside"
          className="min-h-40"
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
            emptyContent={<p>No scheduled work at current date</p>}
            isLoading={isLoading}
            items={[schedule] as Iterable<Schedule>}
            loadingContent={<Spinner label="Loading..." />}
          >
            {(schedule: Schedule) => {
            return <TableRow>
                <TableCell className="w-[40%]" textValue="Start Time">
                  <Chip color="success" className="text-white">
                    {toParsedTimeString(schedule.startTime)}
                  </Chip>
                </TableCell>
                <TableCell className="w-[40%]" textValue="End Time">
                  <Chip color="success" className="text-white">
                    {toParsedTimeString(schedule.endTime)}
                  </Chip>
                </TableCell>
                <TableCell className="w-[40%]" textValue="Status">
                  <Chip variant="dot" color={schedule.status == ScheduleStatus.WORKING ? "success" : schedule.status == ScheduleStatus.SICK ? "warning" : "primary"}>
                    {ScheduleStatuses[schedule.status]}
                    </Chip>
                </TableCell>
                <TableCell className="w-[40%]" textValue="Actions">
                  <IconButton
                    withConfirmation
                    tooltip="Delete schedule"
                    confirmationTooltip="Are you sure you want to proceed?"
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="solid"
                    onPress={() => deleteSchedule(schedule)}
                  >
                    <DeleteIcon className="text-lg text-content1" />
                  </IconButton>
                </TableCell>
              </TableRow>
            }}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
