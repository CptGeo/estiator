import EmailField from "@components/Fields/Email";
import InputField from "@components/Fields/Input";
import SelectField from "@components/Fields/Select";
import ConfirmationModal from "@components/Modal/Confirmation";
import Status from "@components/Status/Employee/Status";
import { UserRole, UserRoleName, UserStatus, UserStatuses, type UserData } from "@core/types";
import { allRoutes, deleteReq, formatDateTime, getInitials, getPhoneData, parseTimestamp, patchReq, Routes } from "@core/utils";
import { SelectItem, Button, Image, useDisclosure, Avatar } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ReactElement } from "react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "@context/Notification";
import { ArrowBackTwoTone, DeleteOutlineTwoTone } from "@mui/icons-material";
import PhoneCodeField from "@components/Fields/PhoneCode";

export default function EmployeeInfo(props: {
  employee: UserData;
}): ReactElement {
  const employee = props.employee;

  const { notify } = useNotification();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const modal = useDisclosure();

  const { isPending: savePending, mutateAsync: usersMutateAsync } = useMutation({
    mutationFn: (data: UserData) => patchReq(`users/${data.id}`, data),
    onSuccess: () => notify({ message: "Employee information has been updated successfully!", type: "success" }),
    onError: () => notify({ message: "Employee information could not be updated.", type: "danger" })
  })

  const { isPending: deletePending, mutateAsync: deleteItem } = useMutation({
    mutationFn: (id: unknown) => deleteReq(`users/${id}`),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["users"] })
    }
  });

  const { phoneNumber, countryCode } = getPhoneData(employee.phone);

  const defaultValues = {
    name: employee?.name,
    surname: employee?.surname,
    email: employee?.email,
    phone: phoneNumber,
    countryCode: countryCode,
    userRole: employee?.userRole,
    position: employee?.position,
    status: employee?.status
  }

  const methods = useForm({
    defaultValues,
    mode: "all",
  });

  const { formState: { isValid, isDirty } } = methods;

  async function handleSubmit(values: FieldValues) {
    await usersMutateAsync({
      name: values.name,
      surname: values.surname,
      phone: `${values.countryCode} ${values.phone}`,
      id: employee.id,
      userRole: values.userRole,
      position: values.position,
      status: values?.status
    } as UserData);

    queryClient.refetchQueries({ queryKey: [`users/${employee.id}`] });
    queryClient.refetchQueries({ queryKey: [`users/${employee.id}/schedule`] });
    queryClient.refetchQueries({ queryKey: ["users"] });
  }

  async function handleDelete(id: unknown) {
    // delete item
    await deleteItem(id);

    // navigate after half second
    setTimeout(() => {
      navigate(allRoutes[Routes.EMPLOYEES]);
    }, 500)
  }

  function getFallbackSrc(employee: UserData) {
    return `https://ui-avatars.com/api/?size=300&name=${getInitials(employee)}`
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} noValidate className="mb-5">
        <div className="flex flex-col gap-7 mb-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Link to={allRoutes[Routes.EMPLOYEES]}>
                <ArrowBackTwoTone className="text-3xl hover:bg-slate-300 rounded-full" />
              </Link>
              <Avatar
                isBordered
                src={employee.profileImage}
                className="w-16 h-16 text-large mr-1"
                name={getInitials(employee)}
              />
              <div>
                <h1 className="text-2xl">
                  {employee.name} {employee.surname}
                </h1>
                <Status status={employee.status} />
              </div>
            </div>
            <div className="flex flex-row items-center gap-4">
              <p className="text-xs text-slate-500">
                Added on {formatDateTime(parseTimestamp(employee.createdDate))}
              </p>
              <Button
                className="py-6"
                color="danger"
                variant="flat"
                isLoading={deletePending}
                onPress={modal.onOpen}
              >
                <DeleteOutlineTwoTone className="text-lg" /> Delete Employee
              </Button>
            </div>
          </div>
          <hr />
          <div className="flex flex-row flex-wrap lg:flex-nowrap gap-10">
            <div className="w-full lg:w-1/5 p-1">
              <h3 className="opacity-65 uppercase text-sm py-3">
                Profile Image
              </h3>
              <div className="text-center [&_div]:bg-center w-full">
                <Image
                  src={employee.profileImage}
                  fallbackSrc={getFallbackSrc(employee)}
                  width={250}
                  height={250}
                  loading="eager"
                  className="w-full mb-3 object-cover"
                />
              </div>
            </div>
            <div className="w-full lg:w-2/5 p-1">
              <h3 className="opacity-65 uppercase text-sm py-3">
                Employee Details
              </h3>
              <div className="flex flex-col gap-2">
                <InputField
                  name="name"
                  label="First name"
                  isRequired
                  maxLength={25}
                />
                <InputField
                  name="surname"
                  label="Last name"
                  isRequired
                  maxLength={25}
                />
                <EmailField name="email" label="Email Address" isRequired isDisabled />
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
              </div>
            </div>
            <div className="w-full lg:w-1/4 p-1">
              <h3 className="opacity-65 uppercase text-sm py-3">
                Role & Responsibilities
              </h3>
              <div className="flex flex-col gap-2">
                <SelectField name="userRole" label="Role">
                  {Object.values(UserRole).filter(item => item !== UserRole.UNKNOWN).map((item: UserRole) => {
                    return (
                      <SelectItem key={item} value={item}>
                        {UserRoleName[item]}
                      </SelectItem>
                    );
                  })}
                </SelectField>
                <InputField
                  name="position"
                  label="Position"
                  isRequired
                  maxLength={50}
                />
                <h3 className="opacity-65 uppercase text-sm py-3">Status</h3>
                <SelectField name="status" label="Status" defaultSelectedKeys={employee?.tables?.map(table => table.id) || []}>
                  {Object.values(UserStatus).map((item: UserStatus) => {
                    return (
                      <SelectItem key={item} value={item}>
                        {UserStatuses[item]}
                      </SelectItem>
                    );
                  })}
                </SelectField>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex gap-3">
          <Button
            variant="solid"
            className="text-md py-6 px-10"
            color="primary"
            type="submit"
            isLoading={savePending}
            isDisabled={!isDirty || !isValid}
          >
            Save profile changes
          </Button>
        </div>
      </form>
      <ConfirmationModal
        {...modal}
        body={
          <p>
            Employee{" "}
            <strong>
              {employee.name} {employee.surname}
            </strong>{" "}
            will be <strong>removed.</strong>
          </p>
        }
        title={`Remove employee ${employee.name} ${employee.surname}`}
        callback={handleDelete.bind(null, employee.id)}
      />
    </FormProvider>
  );
}
