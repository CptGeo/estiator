import EmployeeCalendar from "@components/EmployeeCalendar/EmployeeCalendar";
import RangeCalendarField from "@components/Fields/RangerCalendar";
import SelectField from "@components/Fields/Select";
import TimeField from "@components/Fields/Time";
import type { Schedule, UserData } from "@core/types";
import { ScheduleStatus } from "@core/types";
import { formatDate, postReq } from "@core/utils";
import type { CalendarDate } from "@internationalized/date";
import { parseTime, today } from "@internationalized/date";
import { Button, SelectItem } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useNotification } from "@context/Notification";

type Props = {
  employee: UserData;
}

type FormValues = {
  schedules: {
    start: CalendarDate,
    end: CalendarDate
  },
  startTime: string;
  endTime: string;
  scheduleStatus: ScheduleStatus;
}

type ScheduleRequest = {
  endTime: string,
  startTime: string,
  status: ScheduleStatus,
  startDate: string,
  endDate: string
}

export default function EmployeeSchedule({ employee }: Props) {
  const methods = useForm<FormValues>({
    defaultValues: {
      schedules: { start: today("Europe/Athens"), end: today("Europe/Athens") }
    },
    mode: "all"
  });

  const { notify } = useNotification();

  const queryClient = useQueryClient();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: ScheduleRequest) => postReq(`users/${employee.id}/schedules`, data),
    onSuccess: () => notify({ message: "Employee schedule has been updated successfully!", type: "success" }),
    onError: () => notify({ message: "Employee schedule could not be updated.", type: "danger" }),
  })

  async function handleSubmit(values: FormValues) {
    const formatted = {
      endTime: parseTime(values.endTime).toString(),
      startTime: parseTime(values.startTime).toString(),
      status: values.scheduleStatus,
      startDate: formatDate(values.schedules.start),
      endDate: formatDate(values.schedules.end),
    }

    const result = await mutateAsync(formatted) as Schedule[];

    result.forEach(schedule => {
      queryClient.invalidateQueries({ queryKey: [`users/${employee.id}/schedule/${schedule.date}`] });
      queryClient.refetchQueries({ queryKey: [`users/${employee.id}/schedule${schedule.date}`] });
    });

  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <h3 className="opacity-65 uppercase text-sm py-3">Schedule</h3>
        <div className="flex w-full justify-start items-start flex-wrap md:flex-nowrap gap-4">
          <div>
            <div className="p-1">
              <RangeCalendarField name="schedules" />
            </div>
          </div>
          <div className="flex w-full flex-col max-w-[300px]">
            <div className="w-full p-1">
              <div className="w-full flex-nowrap flex gap-2 mb-3">
                <TimeField
                  label="Start time"
                  name="startTime"
                  placeholder="Time"
                  isRequired
                />
              </div>
            </div>
            <div className="w-full p-1">
              <div className="w-full flex-nowrap flex gap-2 mb-3">
                <TimeField
                  label="End time"
                  name="endTime"
                  placeholder="Time"
                  isRequired
                />
              </div>
            </div>
            <div className="w-full p-1">
              <div className="w-full flex-nowrap flex gap-2 mb-3">
                <SelectField name="scheduleStatus" label="Schedule status" isRequired>
                  <SelectItem key={ScheduleStatus.WORKING}>Working</SelectItem>
                  <SelectItem key={ScheduleStatus.ON_LEAVE}>On Leave</SelectItem>
                  <SelectItem key={ScheduleStatus.SICK}>Sick</SelectItem>
                </SelectField>
              </div>
            </div>
            <div className="w-full p-1">
              <div className="w-full flex-nowrap flex gap-2 mb-3">
                <Button
                  variant="solid"
                  className="max-w-[350px] w-full text-md py-6"
                  color="primary"
                  isDisabled={isPending}
                  type="submit">
                  Update schedule
                </Button>
              </div>
            </div>
          </div>
          <EmployeeCalendar user={employee} />
        </div>
      </form>
    </FormProvider>
  );
}
