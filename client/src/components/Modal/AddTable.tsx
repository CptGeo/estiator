import { TableData } from "../../core/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import InputField from "../Fields/Input";
import NumberField from "../Fields/Number";
import { useState } from "react";
import { client } from "../../core/request";
import ColorPickerField, { ColorPickerOption } from "../Fields/ColorPicker";
import GridTable from "../Grid/GridTable";
import { Coordinates } from "@dnd-kit/core/dist/types";

export default function AddTableModal(props: ReturnType<typeof useDisclosure> & { defaultCoordinates: Coordinates }) {
  const { isOpen, onOpenChange, onClose, defaultCoordinates } = props;
  const [loading, setLoading] = useState(false);

  const methods = useForm<TableData>({
    mode: "onChange",
    defaultValues: {
      capacity: 2,
      color: "bg-primary",
      label: "New table"
     },
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
        color: values.color,
        ...defaultCoordinates ? defaultCoordinates : {
          x: 100,
          y: 100
        }
      };
      await client.post("/tables", { ...data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      methods.reset();
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
                New table
              </ModalHeader>
              <ModalBody>
                <div className="gap-4 flex flex-col">
                  <div className="grid-bg p-10 flex justify-center items-center rounded-large overflow-hidden bg-content2 shadow-inner">
                    <GridTable
                      color={color}
                      capacity={capacity}
                      label={label}
                    />
                  </div>

                  <InputField isRequired label="Label" name="label" />
                  <NumberField isRequired label="Capacity" name="capacity" min={2} />
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
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={loading}>
                  Create table
                </Button>
              </ModalFooter>
            </form>
          </FormProvider>
        )}
      </ModalContent>
    </Modal>
  );
}
