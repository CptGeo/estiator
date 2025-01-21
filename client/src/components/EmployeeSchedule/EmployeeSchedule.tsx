import EmployeeCalendar from "@components/EmployeeCalendar/EmployeeCalendar";
import RangeCalendarField from "@components/Fields/RangerCalendar";
import SelectField from "@components/Fields/Select";
import TimeField from "@components/Fields/Time";
import type { Schedule, UserData } from "@core/types";
import { ScheduleStatus } from "@core/types";
import { formatDate, postReq } from "@core/utils";
import type { CalendarDate } from "@internationalized/date";
import { getLocalTimeZone, parseTime, today } from "@internationalized/date";
import { Button, SelectItem } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

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
      schedules: { start: today(getLocalTimeZone()), end: today(getLocalTimeZone()) }
    },
    mode: "all"
  });

  const queryClient = useQueryClient();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: ScheduleRequest) => postReq(`users/${employee.id}/schedules`, data),
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
        <div className="flex w-full lg:max-w-[1000px] justify-start items-start flex-wrap md:flex-nowrap gap-4">
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
                  <SelectItem key={ScheduleStatus.Working}>Working</SelectItem>
                  <SelectItem key={ScheduleStatus.OnLeave}>On Leave</SelectItem>
                  <SelectItem key={ScheduleStatus.Sick}>Sick</SelectItem>
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

          <div className="basis-2/3">
            <EmployeeCalendar user={employee} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
