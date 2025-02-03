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

export default function SettingsList(props: { settings: SettingsData }) {
  const { settings } = props;

  const queryClient = useQueryClient();

  const methods = useForm({
    defaultValues: settings
  });

  useEffect(() => {
    if (settings) {
      methods.reset(settings);
    }
  }, [settings]);

  const enabled = methods.formState.isDirty && methods.formState.isValid;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: SettingsData) => patchReq("settings", data),
    onSettled: () => queryClient.refetchQueries( { queryKey: ["settings"] }),
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
                <InputField name="businessName" placeholder="Add you business name here..." label="Business name" />
              </SettingsListItem>
              <SettingsListItem headline="Business description" description="Provide a brief description of your business. This text will appear in emails and various sections of the admin dashboard.">
                <TextareaField name="businessDescription" placeholder="Add you business description here..." label="Business description" />
              </SettingsListItem>
              <div className="py-10 flex gap-3 justify-end">
                <Button color="primary" type="submit" isLoading={isPending} isDisabled={!enabled}>Save settings</Button>
                <Button color="default" onPress={handleReset}>Reset</Button>
              </div>
            </form>
            <DevTool control={methods.control} />
          </FormProvider>
        </Tab>
      </Tabs>
    </div>
  )
}