import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, ButtonProps } from "@nextui-org/react";
import { ReactElement } from "react";

type Props = {
  body: string | ReactElement;
  title: string;
  cancelText?: string;
  cancelButtonProps?: ButtonProps;
  confirmText?: string;
  confirmButtonProps?: ButtonProps;
} & ReturnType<typeof useDisclosure>;

export default function ConfirmationModal(props: Props) {
  const { isOpen, onOpenChange, onClose, title, body, cancelText = "Cancel", confirmText = "Confirm", cancelButtonProps, confirmButtonProps } = props;

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
                <Button color="primary" variant="solid" {...confirmButtonProps} onPress={onClose}>
                  {confirmText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  );
}