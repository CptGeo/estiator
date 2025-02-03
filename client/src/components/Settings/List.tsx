import TextareaField from "@components/Fields/Textarea";
import type { SettingsData } from "@core/types";
import { Tabs, Tab, Button } from "@heroui/react";
import { DevTool } from "@hookform/devtools";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import SettingsListItem from "./Item";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchReq } from "@core/utils";
import { useEffect } from "react";
import InputField from "@components/Fields/Input";
import { useNotification } from "@context/Notification";

export default function SettingsList(props: { settings: SettingsData }) {
  const { settings } = props;

  const queryClient = useQueryClient();
  const { notify } = useNotification();

  const methods = useForm({
    defaultValues: settings,
    mode: "onChange"
  });

  useEffect(() => {
    if (settings) {
      methods.reset(settings);
    }
  }, [settings]);

  const { isDirty, isValid } = methods.formState;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FieldValues) => patchReq("settings", data),
    onSettled: () => { queryClient.refetchQueries( { queryKey: ["settings"] }) },
    onSuccess: () => notify({ message: "Settings were saved successfully.", type: "success" }),
    onError: () => notify({ message: "Settings could not be saved.", type: "danger" })
  });

  async function handleSubmit(e: FieldValues) {
    await mutateAsync(e);
  }

  function handleReset() {
    methods.reset(settings, { keepDefaultValues: true, keepDirty: false });
  }

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        <Tab key="business" title="Preferences">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} className="my-3">
              <SettingsListItem headline="Business name" description="Provide the name of your business.">
                <InputField name="businessName" placeholder="Add you business name here..." label="Business name" isRequired maxLength={30} minLength={3} />
              </SettingsListItem>
              <SettingsListItem headline="Business description" description="Provide a brief description of your business. This text will appear in emails and various sections of the admin dashboard.">
                <TextareaField maxLength={40} name="businessDescription" placeholder="Add you business description here..." label="Business description" />
              </SettingsListItem>
              <div className="py-10 flex gap-3 justify-end">
                <Button color="primary" type="submit" isLoading={isPending} isDisabled={!isDirty || !isValid}>Save settings</Button>
                <Button color="default" onPress={handleReset} isDisabled={!isDirty}>Reset</Button>
              </div>
            </form>
            <DevTool control={methods.control} />
          </FormProvider>
        </Tab>
      </Tabs>
    </div>
  )
}