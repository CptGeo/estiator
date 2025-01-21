import EmailField from "@components/Fields/Email";
import InputField from "@components/Fields/Input";
import SelectField from "@components/Fields/Select";
import BackIcon from "@components/Icons/BackIcon";
import { DeleteIcon } from "@components/Icons/DeleteIcon";
import ConfirmationModal from "@components/Modal/Confirmation";
import Status from "@components/Status/Employee/Status";
import { UserRole, UserStatus, type UserData } from "@core/types";
import { deleteReq, formatDateTime, parseTimestamp, patchReq } from "@core/utils";
import { SelectItem, Button, Image, useDisclosure, Avatar } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ReactElement } from "react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ImageIcon from "@components/Icons/ImageIcon";
import { DevTool } from "@hookform/devtools";

export default function EmployeeInfo(props: {
  employee: UserData;
}): ReactElement {
  const employee = props.employee;

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const modal = useDisclosure();

  const { isPending: savePending, mutateAsync: usersMutateAsync } = useMutation({
    mutationFn: (data: UserData) => patchReq(`users/${data.id}`, data),
  })

  const { isPending: deletePending, mutateAsync: deleteItem } = useMutation({
    mutationFn: (id: unknown) => deleteReq(`users/${id}`),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["users"] })
    }
  });

  const defaultValues = {
    name: employee?.name,
    surname: employee?.surname,
    email: employee?.email,
    phone: employee?.phone,
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
      ...values,
      id: employee.id
    } as UserData);

    queryClient.invalidateQueries({ queryKey: [`users/${employee.id}`] });
    queryClient.invalidateQueries({ queryKey: [`users/${employee.id}/schedule`] });
    queryClient.refetchQueries({ queryKey: ["users"] });
  }

  async function handleDelete(id: unknown) {
    // delete item
    await deleteItem(id);

    // navigate after half second
    setTimeout(() => {
      navigate("/employees-management");
    }, 500)
  }

  function getFallbackSrc(employee: UserData) {
    return `https://ui-avatars.com/api/?size=300&name=${employee.name}+${employee.surname}`
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} noValidate className="mb-5">
        <div className="flex flex-col gap-7 mb-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Link to="/employees-management">
                <BackIcon className="text-3xl hover:bg-slate-300 rounded-full" />
              </Link>
              <Avatar
                  isBordered
                  src={employee.profileImage}
                  className="w-16 h-16 text-large mr-1"
                  name={`${employee.name.charAt(0).toUpperCase()} ${employee.surname
                    .charAt(0)
                    .toUpperCase()}`}
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
                <DeleteIcon className="text-lg" /> Delete Employee
              </Button>
            </div>
          </div>
          <hr />
          <div className="flex flex-row flex-wrap lg:flex-nowrap gap-10">
            <div className="w-full lg:w-1/4 p-1">
              <h3 className="opacity-65 uppercase text-sm py-3">
                Profile Image
              </h3>
              <div className="text-center w-fit [&_div]:bg-center">
                <Image
                  src={employee.profileImage}
                  fallbackSrc={getFallbackSrc(employee)}
                  width={300}
                  height={300}
                  loading="eager"
                  className="w-full mb-3 object-cover"
                />
                <Button className="text-blue-600 text-sm" variant="light"><ImageIcon /> Change profile image</Button>
              </div>
            </div>
            <div className="w-full lg:w-1/4 p-1">
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
                <EmailField name="email" label="Email Address" isRequired />
                <InputField name="phone" label="Phone Number" />
              </div>
            </div>
            <div className="w-full lg:w-1/4 p-1">
              <h3 className="opacity-65 uppercase text-sm py-3">
                Role & Responsibilities
              </h3>
              <div className="flex flex-col gap-2">
                <SelectField name="userRole" label="Role">
                  {Object.values(UserRole).map((item: UserRole) => {
                    return (
                      <SelectItem key={item} value={item}>
                        {item}
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
                        {item}
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
            className="max-w-[350px] w-full text-md py-6"
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
      <DevTool control={methods.control} />
    </FormProvider>
  );
}
