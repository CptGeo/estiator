import { useState } from "react";
import type { ReservationData } from "@core/types";
import type { useDisclosure } from "@heroui/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { postReq } from "@core/utils";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useNotification } from "@context/Notification";
import TextareaField from "@components/Fields/Textarea";
import ReviewStars from "@components/ReviewStars/ReviewStars";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function ReviewReservationModal(props: Props) {
  const { reservation, isOpen, onOpenChange, onClose } = props;
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const methods = useForm({
    mode: "onChange"
  });

  const { isDirty, isValid } = methods.formState;

  async function onSubmit(values: FieldValues): Promise<void> {
    try {
      setLoading(true);
      const data = {
        rating: values.rating,
        review: values.review,
      };
      await postReq(`/reservations/me/${reservation.id}/review`, { ...data }, { params: { inform: values.inform } });
      queryClient.invalidateQueries( { queryKey: ["/reservations/me"] });
      queryClient.refetchQueries( { queryKey: ["/reservations/me"] });
      notify({ message: "Thank you very much for submitting a review!", type: "success" });
    } catch (error) {
      console.error(error);
      notify({ message: "Review could not be submitted.", type: "danger" });
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
        size="sm"
        backdrop="opaque"
        onClose={methods.reset}
      >
        <ModalContent>
          {(onClose) => (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ModalHeader className="gap-1">
                Review reservation
              </ModalHeader>
              <ModalBody>
              <div className="gap-4 md:flex flex-col">
                <ReviewStars name="rating" isRequired />
                <TextareaField description="Max. 255 characters" maxLength={255} labelPlacement="outside" name="review" placeholder="Please let us know how we can improve..." />
              </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={loading} isDisabled={!isValid || !isDirty}>
                  Submit review
                </Button>
              </ModalFooter>
              </form>
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    )
}