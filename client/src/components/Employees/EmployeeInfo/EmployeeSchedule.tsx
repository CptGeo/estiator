import CheckboxField from "@components/Fields/Checkbox";
import TimeControlled from "@components/Fields/TimeControlled";
import { useFormContext } from "react-hook-form";

export default function EmployeeSchedule() {
  const { watch } = useFormContext();

  const offDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const off = new Map();

  for (const day of offDays) {
    off.set(day, watch(`${day}Off`));
  }

  console.log(off);

  return (
    <div className="flex flex-col mb-5">
      <h2 className="opacity-65 uppercase text-sm py-3">Schedule</h2>
      <div className="overflow-auto">
        <div className="flex flex-row justify-between gap-3 min-w-[800px] pb-2">
          <div className="w-[14.2%] p-2 rounded-lg bg-default-100">
            <h3 className="border-b-1 border-opacity-10 mb-2 text-xs uppercase text-center opacity-85 pb-1 font-semibold">
              Monday
            </h3>
            <div className="flex flex-col gap-1 mb-2">
              <TimeControlled
                hourCycle={24}
                name="monCheckin"
                label="Check-in"
                isDisabled={off.get("mon")}
              />
              <TimeControlled
                hourCycle={24}
                name="monCheckout"
                label="Check-out"
                isDisabled={off.get("mon")}
              />
            </div>
            <CheckboxField name="monOff" label="Day off" size="sm" />
          </div>
          <div className="w-[14.2%] p-2 rounded-lg bg-default-100">
            <h3 className="border-b-1 border-opacity-10 mb-2 text-xs uppercase text-center opacity-85 pb-1 font-semibold">
              Tuesday
            </h3>
            <div className="flex flex-col gap-1 mb-2">
              <TimeControlled
                hourCycle={24}
                name="tueCheckin"
                label="Check-in"
                isDisabled={off.get("tue")}
              />
              <TimeControlled
                hourCycle={24}
                name="tueCheckout"
                label="Check-out"
                isDisabled={off.get("tue")}
              />
            </div>
            <CheckboxField name="tueOff" label="Day off" size="sm" />
          </div>
          <div className="w-[14.2%] p-2 rounded-lg bg-default-100">
            <h3 className="border-b-1 border-opacity-10 mb-2 text-xs uppercase text-center opacity-85 pb-1 font-semibold">
              Wednesday
            </h3>
            <div className="flex flex-col gap-1 mb-2">
              <TimeControlled
                hourCycle={24}
                name="wedCheckin"
                label="Check-in"
                isDisabled={off.get("wed")}
              />
              <TimeControlled
                hourCycle={24}
                name="wedCheckout"
                label="Check-out"
                isDisabled={off.get("wed")}
              />
            </div>
            <CheckboxField name="wedOff" label="Day off" size="sm" />
          </div>
          <div className="w-[14.2%] p-2 rounded-lg bg-default-100">
            <h3 className="border-b-1 border-opacity-10 mb-2 text-xs uppercase text-center opacity-85 pb-1 font-semibold">
              Thursday
            </h3>
            <div className="flex flex-col gap-1 mb-2">
              <TimeControlled
                hourCycle={24}
                name="thuCheckin"
                label="Check-in"
                isDisabled={off.get("thu")}
              />
              <TimeControlled
                hourCycle={24}
                name="thuCheckout"
                label="Check-out"
                isDisabled={off.get("thu")}
              />
            </div>
            <CheckboxField name="thuOff" label="Day off" size="sm" />
          </div>
          <div className="w-[14.2%] p-2 rounded-lg bg-default-100">
            <h3 className="border-b-1 border-opacity-10 mb-2 text-xs uppercase text-center opacity-85 pb-1 font-semibold">
              Friday
            </h3>
            <div className="flex flex-col gap-1 mb-2">
              <TimeControlled
                hourCycle={24}
                name="friCheckin"
                label="Check-in"
                isDisabled={off.get("fri")}
              />
              <TimeControlled
                hourCycle={24}
                name="friCheckout"
                label="Check-out"
                isDisabled={off.get("fri")}
              />
            </div>
            <CheckboxField name="friOff" label="Day off" size="sm" />
          </div>
          <div className="w-[14.2%] p-2 rounded-lg bg-default-100">
            <h3 className="border-b-1 border-opacity-10 mb-2 text-xs uppercase text-center opacity-85 pb-1 font-semibold">
              Saturday
            </h3>
            <div className="flex flex-col gap-1 mb-2">
              <TimeControlled
                hourCycle={24}
                name="satCheckin"
                label="Check-in"
                isDisabled={off.get("sat")}
              />
              <TimeControlled
                hourCycle={24}
                name="satCheckout"
                label="Check-out"
                isDisabled={off.get("sat")}
              />
            </div>
            <CheckboxField name="satOff" label="Day off" size="sm" />
          </div>
          <div className="w-[14.2%] p-2 rounded-lg bg-default-100">
            <h3 className="border-b-1 border-opacity-10 mb-2 text-xs uppercase text-center opacity-85 pb-1 font-semibold">
              Sunday
            </h3>
            <div className="flex flex-col gap-1 mb-2">
              <TimeControlled
                hourCycle={24}
                name="sunCheckin"
                label="Check-in"
                isDisabled={off.get("sun")}
              />
              <TimeControlled
                hourCycle={24}
                name="sunCheckout"
                label="Check-out"
                isDisabled={off.get("sun")}
              />
            </div>
            <CheckboxField name="sunOff" label="Day off" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
