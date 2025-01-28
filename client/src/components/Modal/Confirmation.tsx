import type { useDisclosure, ButtonProps } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import type { ReactElement } from "react";

type Props = {
  body: string | ReactElement;
  title: string;
  cancelText?: string;
  cancelButtonProps?: ButtonProps;
  confirmText?: string;
  callback: () => Promise<void>
  confirmButtonProps?: ButtonProps;
} & ReturnType<typeof useDisclosure>;

export default function ConfirmationModal(props: Props) {
  const { isOpen, onOpenChange, callback, onClose, title, body, cancelText = "Cancel", confirmText = "Confirm", cancelButtonProps, confirmButtonProps } = props;

  async function handleSubmit(): Promise<void> {
    await callback();
    onClose();
  }

  return (
      <Modal backdrop="opaque" placement="top" size="2xl" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                {body}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" {...cancelButtonProps} onPress={onClose}>
                  {cancelText}
                </Button>
                <Button color="primary" variant="solid" {...confirmButtonProps} onPress={handleSubmit}>
                  {confirmText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  );
}