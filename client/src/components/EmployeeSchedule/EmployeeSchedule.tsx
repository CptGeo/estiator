import EmployeeCalendar from "@components/EmployeeCalendar/EmployeeCalendar";
import RangeCalendarField from "@components/Fields/RangerCalendar";
import SelectField from "@components/Fields/Select";
import TimeField from "@components/Fields/Time";
import type { Schedule, UserData } from "@core/types";
import { ScheduleStatus } from "@core/types";
import { formatDate, postReq, statusSuccess } from "@core/utils";
import type { CalendarDate } from "@internationalized/date";
import { getLocalTimeZone, parseTime, today } from "@internationalized/date";
import { Button, SelectItem } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useNotification } from "@context/Notification";
import { useState } from "react";

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
  const [loading, setLoading] = useState(false);
  const methods = useForm<FormValues>({
    defaultValues: {
      schedules: { start: today(getLocalTimeZone()), end: today(getLocalTimeZone()) }
    },
    mode: "all"
  });

  const { notify } = useNotification();
  const queryClient = useQueryClient();

  async function handleSubmit(values: FormValues): Promise<void> {
    try {
      setLoading(true);
      const data: ScheduleRequest = {
        endTime: parseTime(values.endTime).toString(),
        startTime: parseTime(values.startTime).toString(),
        status: values.scheduleStatus,
        startDate: formatDate(values.schedules.start),
        endDate: formatDate(values.schedules.end),
      }
      const result = await postReq<Schedule[]>(`users/${employee.id}/schedules`, data);

      if (statusSuccess(result.status)) {
        result.data.forEach(schedule => {
          queryClient.invalidateQueries({ queryKey: [`users/${employee.id}/schedule/${schedule.date}`] });
          queryClient.refetchQueries({ queryKey: [`users/${employee.id}/schedule${schedule.date}`] });
        });
        notify({ message: "Employee schedule has been updated successfully!", type: "success" });
      }
    } catch (error) {
      console.error(error);
      notify({ message: "Employee schedule could not be updated.", type: "danger" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} noValidate>
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
                  isDisabled={loading}
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
