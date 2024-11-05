import { TableData } from "../../core/types";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import InputField from "../Fields/Input";
import NumberField from "../Fields/Number";
import { useState } from "react";
import { client } from "../../core/request";
import ColorPickerField, { ColorPickerOption } from "../Fields/ColorPicker";
import GridTable from "../Grid/GridTable";

type Props = {
  table: TableData;
} & ReturnType<typeof useDisclosure>;

export default function EditTableModal(props: Props) {
  const { table, isOpen, onOpenChange, onClose: close } = props;
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const methods = useForm({
    mode: "onChange",
    values: { ...table }
  });

  const capacity = methods.watch("capacity") || 0;
  const label = methods.watch("label") || "";
  const color = methods.watch("color") || "bg-default-50";

  async function handleDelete() {
    try {
      setDeleteLoading(true);
      await client.delete(`/tables/${table.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
      methods.reset();
      close();
    }
  }

  async function onSubmit(values: FieldValues): Promise<void> {
    try {
      setSubmitLoading(true);
      const data = {
        label: values.label,
        capacity: values.capacity,
        color: values.color
      };
      await client.patch(`/tables/${table.id}`, { ...data });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitLoading(false);
      methods.reset();
      close();
    }
  }

  return (
    <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top"
        size="md"
        backdrop="opaque"
        onClose={methods.reset}
      >
        <ModalContent>
          {(onClose) => (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ModalHeader className="gap-1">
                Editing table <em>{table.label}</em><br />
              </ModalHeader>
              <ModalBody>
              <div className="gap-4 flex flex-col">

                  <div className="grid-bg p-10 flex justify-center items-center rounded-large overflow-hidden bg-content2 shadow-inner">
                    <GridTable color={color} capacity={capacity} label={label} />
                  </div>

                  <InputField isRequired label="Label" name="label" maxLength={8} />
                  <NumberField isRequired label="Capacity" name="capacity" className="bg-" />
                  <ColorPickerField name="color" label="Color" defaultValue={color}>
                    <ColorPickerOption value="bg-secondary" />
                    <ColorPickerOption value="bg-primary" />
                    <ColorPickerOption value="bg-sky-500" />
                    <ColorPickerOption value="bg-emerald-400" />
                    <ColorPickerOption value="bg-success" />
                    <ColorPickerOption value="bg-green-400" />
                    <ColorPickerOption value="bg-danger" />
                    <ColorPickerOption value="bg-rose-500" />
                    <ColorPickerOption value="bg-orange-500" />
                    <ColorPickerOption value="bg-warning" />
                    <ColorPickerOption value="bg-yellow-400" />
                    <ColorPickerOption value="bg-purple-400" />
                    <ColorPickerOption value="bg-fuchsia-400" />
                    <ColorPickerOption value="bg-pink-400" />
                    <ColorPickerOption value="bg-slate-400" />
                    <ColorPickerOption value="bg-slate-600" />
                  </ColorPickerField>
              </div>
              </ModalBody>
              <ModalFooter className="flex flex-row justify-between">
                <Button color="danger" variant="flat" onPress={handleDelete} isLoading={deleteLoading}>
                  Delete table
                </Button>
                <div className="gap-2 flex">
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" isLoading={submitLoading}>
                    Update table
                  </Button>
                </div>
              </ModalFooter>
              </form>
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    )
}