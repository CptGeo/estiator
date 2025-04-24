import { type ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import EmailField from "@components/Fields/Email";
import InputField from "@components/Fields/Input";
import PhoneCodeField from "@components/Fields/PhoneCode";
import { Button, Spinner } from "@heroui/react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import useQueryMe from "@hooks/useQueryMe";
import { getPhoneData, patchReq } from "@core/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@context/Notification";
import { DietaryPreferenceOption, type UserData } from "@core/types";
import CheckboxField from "@components/Fields/Checkbox";
import useQueryDietaryPreferences from "@hooks/useQueryDietaryPreferences";
import { Egg, Grass, KebabDining, NoFood } from "@mui/icons-material";

const IconsMap = {
  [DietaryPreferenceOption.GLUTEN_FREE]: <NoFood />,
  [DietaryPreferenceOption.HALAL]: <KebabDining />,
  [DietaryPreferenceOption.VEGAN]: <Grass />,
  [DietaryPreferenceOption.VEGETARIAN]: <Egg />,
}

export default function ClientSettings(): ReactElement {
  const { data: customer, isLoading, refetch, isRefetching } = useQueryMe();
  const { data: dietaryPreferences } = useQueryDietaryPreferences();
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const methods = useForm({
    defaultValues: async () => {
      const { data } = await refetch();

      const phoneData = getPhoneData(data?.phone);
      return {
        name: data?.name,
        surname: data?.surname,
        email: data?.email,
        countryCode: phoneData.countryCode,
        phone: phoneData.phoneNumber,
        dietaryPreferences: data?.dietaryPreferences.map(item => item.id)
      }
    }
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: UserData) => patchReq(`users/me`, data),
    onSuccess: () => notify({ message: "Employee information has been updated successfully!", type: "success" }),
    onError: () => notify({ message: "Employee information could not be updated.", type: "danger" }),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["users/me"] })
    }
  })

  const { isDirty, isValid } = methods.formState;

  async function onSubmit(values: FieldValues) {
    await mutateAsync({
      name: values?.name,
      surname: values?.surname,
      phone: `${values?.countryCode} ${values?.phone}`,
      dietaryPreferences: values?.dietaryPreferences.map((item: string) => { return { id: item } }),
      id: customer?.id
    } as UserData);
    methods.reset(values);
  }

  if (isLoading || isRefetching) {
    return <Spinner />
  }

  return (
    <div>
      <PageHeader
        heading="My Settings"
        subheading="Here you can edit your personal information."
      />
      <div className="max-w-[800px]">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="gap-4 md:flex mb-5 flex-row basis-full flex-wrap">
              <div className="w-full md:w-3/4 md:flex-grow flex flex-col gap-2">
                <h3 className="opacity-65 uppercase text-sm py-1">
                  Customer Details
                </h3>
                <InputField isRequired label="Name" name="name" />
                <InputField isRequired label="Surname" name="surname" />
                <EmailField isRequired label="Email" name="email" isDisabled />
                <div className="flex flex-nowrap basis-full gap-2">
                  <div className="basis-2/6">
                    <PhoneCodeField name="countryCode" label="Country code" isRequired />
                  </div>
                  <div className="basis-4/6">
                    <InputField
                      name="phone"
                      label="Phone number"
                      maxLength={64}
                    />
                  </div>
                </div>
              <h3 className="opacity-65 uppercase text-sm mt-3 py-1">
                Dietary Preferences
              </h3>
              <div className="grid grid-cols-2">
                {dietaryPreferences?.map(preference => {
                  return <div key={preference.id} className="flex flex-col mb-2">
                    <CheckboxField label={preference.name} name="dietaryPreferences" value={preference.id.toString()} />
                      <small className="pl-7 text-foreground-600 inline-flex flex-row items-start gap-2">
                        {IconsMap[preference.id]}
                        {preference.description}
                      </small>
                  </div>
                })}
                </div>
              </div>
              <div className="basis-full justify-end flex gap-2">
                <Button
                  color="warning"
                  type="button"
                  onPress={() => methods.reset()}
                  isDisabled={!isDirty}
                  >
                    Reset
                </Button>
                <Button color="primary" type="submit" isLoading={isPending} isDisabled={!isDirty || !isValid}>
                    Save
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
