import React, { useId, useState } from 'react';
import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
} from '@dnd-kit/core';
import type { Coordinates } from '@dnd-kit/utilities';

import { Axis, Draggable } from "./index";

interface Props {
  activationConstraint?: PointerActivationConstraint;
  axis?: Axis;
  handle?: boolean;
  modifiers?: Modifiers;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string ;
  style?: React.CSSProperties;
  defaultCoordinates?: Coordinates;
  label?: string;
}

export function DraggableStory({
  activationConstraint,
  axis,
  handle,
  modifiers,
  style,
  buttonStyle,
  buttonClassName,
  label,
  defaultCoordinates = { x: 0, y: 0 }
}: Props) {
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({ delta }) => {
        setCoordinates(({ x, y }) => {
          // normalize the final placement to be valid on the grid
          const gridSize = 20;
          const roundedX = (Math.floor((x + delta.x) / gridSize)) * gridSize;
          const roundedY = (Math.floor((y + delta.y) / gridSize)) * gridSize;
          console.log(roundedX, roundedY);
          return { x: roundedX, y: roundedY };
        });
      }}
      modifiers={modifiers}
    >
      <DraggableItem
        axis={axis}
        handle={handle}
        top={y}
        left={x}
        style={style}
        buttonStyle={buttonStyle}
        buttonClassName={buttonClassName}
        label={label}
      />
    </DndContext>
  );
}

interface DraggableItemProps {
  handle?: boolean;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;
  axis?: Axis;
  top?: number;
  left?: number;
  label?: string;
}

function DraggableItem({
  axis,
  style,
  top,
  left,
  handle,
  label,
  buttonStyle,
  buttonClassName
}: DraggableItemProps) {
  const id = useId();
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id,
    });

  return (
    <Draggable
      ref={setNodeRef}
      dragging={isDragging}
      handle={handle}
      listeners={listeners}
      style={{ ...style, top, left }}
      buttonStyle={buttonStyle}
      buttonClassName={buttonClassName}
      transform={transform}
      axis={axis}
      label={label}
      {...attributes}
    />
  );
}
