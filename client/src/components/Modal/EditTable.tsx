import { TableData } from "../../core/types";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import InputField from "../Fields/Input";
import NumberField from "../Fields/Number";
import { useState } from "react";
import { client } from "../../core/request";
import ColorPickerField, { ColorPickerOption } from "../Fields/ColorPicker";

type Props = {
  table: TableData;
} & ReturnType<typeof useDisclosure>;

export default function EditTableModal(props: Props) {
  const { table, isOpen, onOpenChange, onClose } = props;
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    mode: "onChange",
    defaultValues: { ...table }
  });

  const capacity = methods.watch("capacity") || 0;
  const label = methods.watch("label") || "";
  const color = methods.watch("color") || "bg-default-50";

  async function onSubmit(values: FieldValues): Promise<void> {
    try {
      setLoading(true);
      const data = {
        label: values.label,
        capacity: values.capacity,
        color: values.color
      };
      await client.patch(`/tables/${table.id}`, { ...data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top"
        size="md"
        backdrop="opaque"
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
                {/* <div className="w-full md:w-auto md:flex-shrink md:mb-0 mb-2 flex-grow"> */}

                  <div className="grid-bg p-10 flex justify-center items-center rounded-large overflow-hidden bg-content2 shadow-inner">
                    <button
                      type="button"
                      style={ { maxWidth: "100px", maxHeight: "80px" } }
                      className={`rounded-md flex flex-col items-center text-default-50 relative w-[100px] h-[100px] ${color}`}>
                      <p className="text-xs top-1 relative">Τραπέζι</p>
                      <p className="text-xl font-bold top-[50%] -translate-y-full relative drop-shadow-lg">{label}</p>
                      <p className="text-[12px] w-full text-right inline-block drop-shadow-lg absolute right-0 bottom-0 pr-1">Άτομα: {!isNaN(capacity) ? capacity : table.capacity}</p>
                    </button>
                  </div>

                {/* </div> */}
                {/* <div className="w-full md:w-3/4 md:flex-grow flex flex-col gap-2"> */}
                  <InputField isRequired label="Label" name="label" />
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
                {/* </div> */}
              </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={loading}>
                  Update table
                </Button>
              </ModalFooter>
              </form>
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    )
}