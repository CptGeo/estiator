import IconButton from "@components/IconButton/IconButton";
import { ScheduleStatus, ScheduleStatuses, type Schedule, type UserData } from "@core/types";
import { deleteReq, toParsedTimeString } from "@core/utils";
import useQueryUserScheduleByDate from "@hooks/useQueryUserScheduleByDate";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import type {
  DateValue
} from "@heroui/react";
import {
  Button,
  Calendar,
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
import { useCallback, useMemo, useState } from "react";
import { useNotification } from "@context/Notification";
import { DeleteTwoTone, HistoryTwoTone } from "@mui/icons-material";
import useQueryUserSchedules from "@hooks/useQueryUserSchedules";

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
  const [current, setCurrent] = useState<DateValue>(today(getLocalTimeZone()));
  const { notify } = useNotification();

  const { data: schedule, isLoading } = useQueryUserScheduleByDate(
    user.id,
    current.toString()
  );
  const { data: allTimeSchedule } = useQueryUserSchedules(user.id, {}, 8000);
  const availableDates = useMemo(() => (allTimeSchedule ?? [])?.map(schedule => parseDate(schedule.date)), [allTimeSchedule]) ?? [];

  const isDateUnavailable = useCallback((date: DateValue) => {
    for(const d of availableDates) {
      if (date.compare(d) === 0) {
        return false;
      }
    }

    return true;
  }, [availableDates]);

  const queryClient = useQueryClient();

  const { mutateAsync: deleteSchedule } = useMutation({
    mutationFn: (schedule: Schedule) => deleteReq(`schedules/${schedule.id}`),
    onMutate: (variables) => {
      return { schedule: variables }
    },
    onSettled: (_, __, ___, context) => queryClient.refetchQueries({ queryKey: [`users/${user.id}/schedule/${context?.schedule.date}`] }),
    onSuccess: () => notify({ message: "Employee schedule has been deleted successfully!", type: "success" }),
    onError: () => notify({ message: "Employee schedule could not be deleted.", type: "danger" })
  })

  function renderReset() {
    return (
      <div className="w-full">
        <Button className="w-full rounded-none" color="warning" variant="flat" onPress={() => {
          setCurrent(today(getLocalTimeZone()))
          setCurrent(today(getLocalTimeZone()))
        }}>
          <HistoryTwoTone className="text-lg" />
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-6">
        <Calendar
          minValue={availableDates[0]}
          maxValue={availableDates[availableDates.length - 1]}
          isDateUnavailable={isDateUnavailable}
          value={current}
          showMonthAndYearPickers
          bottomContent={renderReset()}
          onChange={(e: DateValue) => { setCurrent(e) }}
        />
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
                      <DeleteTwoTone className="text-lg text-content1" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              }}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
