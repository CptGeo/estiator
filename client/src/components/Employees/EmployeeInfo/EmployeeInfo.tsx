import EmailField from "@components/Fields/Email";
import InputField from "@components/Fields/Input";
import SelectField from "@components/Fields/Select";
import TablesSelect from "@components/Fields/Tables";
import BackIcon from "@components/Icons/BackIcon";
import { DeleteIcon } from "@components/Icons/DeleteIcon";
import ConfirmationModal from "@components/Modal/Confirmation";
import Status from "@components/Status/Employee/Status";
import { EmployeeStatus, EmployeeStatuses, Role, Roles, type EmployeeData } from "@core/types";
import { deleteReq, patchReq } from "@core/utils";
import { SelectItem, Button, Image, useDisclosure, Chip } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactElement } from "react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function EmployeeInfo(props: {
  employee: EmployeeData;
}): ReactElement {
  const employee = props.employee;

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const modal = useDisclosure();

  const { isPending: savePending, mutateAsync } = useMutation({
    mutationFn: (data: EmployeeData) => patchReq(`employees/${data.id}`, data),
  })

  const { isPending: deletePending, mutateAsync: deleteItem } = useMutation({
    mutationFn: (id: unknown) => deleteReq(`employees/${id}`),
    onSettled: () => {
      queryClient.refetchQueries( { queryKey: ["employees"] } )
    }
  });

  const defaultValues = {
    name: employee?.name,
    surname: employee?.surname,
    email: employee?.email,
    phone: employee?.phone,
    role: employee?.role,
    position: employee?.position,
    status: employee?.status,
    tables: employee?.tables
  }

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    methods.reset(defaultValues);
  }, [employee])

  async function handleSubmit(values: FieldValues) {
    await mutateAsync({
      ...values,
      id: employee.id
    } as EmployeeData);

    queryClient.invalidateQueries( { queryKey: [`employees/${employee.id}`] } );
    queryClient.refetchQueries( { queryKey: ["employees"] } );
  }

  async function handleDelete(id: unknown) {
    // delete item
    await deleteItem(id);

    // navigate after half second
    setTimeout(() => {
      navigate("/employees-management");
    }, 500)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} noValidate>
        <div className="flex flex-col gap-7">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Link to="/employees-management">
                <BackIcon className="text-3xl hover:bg-slate-300 rounded-full" />
              </Link>
              <Image
                className="rounded-full drop-shadow-lg mr-3"
                src={employee.profileImage}
                width="65"
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
                Added on {employee.registrationDate}
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
              <div className="text-center w-fit">
                <Image
                  src={employee.profileImage}
                  className="w-full mb-3 object-cover"
                />
                <a className="text-blue-600 text-sm">Change profile image</a>
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
              <h3 className="opacity-65 uppercase text-sm py-3">Role & Responsibilities</h3>
              <div className="flex flex-col gap-2">
                <SelectField name="role" label="Role">
                  {Object.values(Role).map((item: Role) => {
                    return <SelectItem key={item} value={item}>{Roles[item]}</SelectItem>
                  })}
                </SelectField>
                <InputField
                  name="position"
                  label="Position"
                  isRequired
                  maxLength={50}
                />
                <TablesSelect name="tables" label="Assigned Tables" selectionMode="multiple" />
                <h3 className="opacity-65 uppercase text-sm py-3">Status</h3>
                <SelectField name="status">
                  {Object.values(EmployeeStatus).map((item: EmployeeStatus) => {
                    return <SelectItem key={item} value={item}>{EmployeeStatuses[item]}</SelectItem>
                  })}
                </SelectField>
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
              isDisabled={
                !methods.formState.isDirty || !methods.formState.isValid
              }
            >
              Save changes
            </Button>
          </div>
        </div>
      </form>
      <ConfirmationModal
        {...modal}
        body={
          <p>
            Employee <strong>{employee.name} {employee.surname}</strong> will be <strong>removed.</strong>
          </p>
        }
        title={`Remove employee ${employee.name} ${employee.surname}`}
        callback={handleDelete.bind(null, employee.id)}
      />
    </FormProvider>
  );
}
