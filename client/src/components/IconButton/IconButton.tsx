import type { ButtonProps } from "@heroui/react";
import { Button, Tooltip } from "@heroui/react";
import { ErrorTwoTone } from "@mui/icons-material";
import type { PressEvent } from "@react-types/shared";
import type { ReactElement } from "react";
import { useRef, useState } from "react";

type Props = ButtonProps & {
  withConfirmation?: boolean;
  confirmationTooltip?: string;
  tooltip?: string;
  confirmationDelay?: number;
}

export default function IconButton(props: Props): ReactElement {
  const { withConfirmation, children, onPress, confirmationTooltip, confirmationDelay = 3000, tooltip, ...otherProps } = props;
  const [confirmed, setConfirmed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setConfirmed(false);
      }
    } else {
      setConfirmed(true);
      timeoutRef.current = setTimeout(() => {
        setConfirmed(false);
      }, confirmationDelay);
    }
  }

  return (
    <Tooltip content={confirmed ? confirmationTooltip : tooltip} closeDelay={100}>
      <Button onPress={handlePress} {...otherProps} {...confirmed && { color: "warning"  }}>
        {confirmed && withConfirmation ? <ErrorTwoTone className="text-lg text-content1"/> : children}
      </Button>
    </Tooltip>
  )
}