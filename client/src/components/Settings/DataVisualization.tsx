import type { SettingsData } from "@core/types";
import { Button, SelectItem } from "@heroui/react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import SettingsListItem from "./Item";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchReq } from "@core/utils";
import { useEffect } from "react";
import { useNotification } from "@context/Notification";
import SelectField from "@components/Fields/Select";

export default function DataVisualizationSettings(props: { settings: SettingsData }) {
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
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="my-3">
        <SettingsListItem headline="Default Rows per Page" description="Specify the default items per page for data lists like tables.">
          <SelectField name="defaultPerPage" className="max-w-[100px]" >
            <SelectItem value="5">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectField>
        </SettingsListItem>
        <div className="py-10 flex gap-3 justify-end">
          <Button color="primary" type="submit" isLoading={isPending} isDisabled={!isDirty || !isValid}>Save settings</Button>
          <Button color="default" onPress={handleReset} isDisabled={!isDirty}>Reset</Button>
        </div>
      </form>
    </FormProvider>
  )
}