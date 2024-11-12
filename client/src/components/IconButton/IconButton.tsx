import WarningIcon from "@components/Icons/WarningIcon";
import { Button, ButtonProps, Tooltip } from "@nextui-org/react";
import { PressEvent } from "@react-types/shared";
import { ReactElement, useState } from "react";

type Props = ButtonProps & {
  withConfirmation?: boolean;
  confirmationTooltip?: string;
  tooltip?: string;
  confirmationDelay?: number;
}

export default function IconButton(props: Props): ReactElement {
  const { withConfirmation, children, onPress, confirmationTooltip, confirmationDelay = 3000, tooltip, ...otherProps } = props;
  const [confirmed, setConfirmed] = useState(false);

  function handlePress(event: PressEvent): void {
    if (!onPress) {
      return;
    }

    if (!withConfirmation) {
      onPress(event);
      return;
    }

    if (confirmed) {
      onPress(event);
    } else {
      setConfirmed(true);
      setTimeout(() => {
        setConfirmed(false);
      }, confirmationDelay);
    }
  }

  return (
    <Tooltip content={confirmed ? confirmationTooltip : tooltip} closeDelay={100}>
      <Button onPress={handlePress} {...otherProps} {...confirmed && { color: "warning"  }}>
        {confirmed && withConfirmation ? <WarningIcon className="text-lg text-content1"/> : children}
      </Button>
    </Tooltip>
  )
}