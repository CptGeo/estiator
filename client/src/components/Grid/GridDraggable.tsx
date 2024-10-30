import React, { Key, useEffect, useId, useMemo, useState } from 'react';
import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors
} from '@dnd-kit/core';
import type { Coordinates } from '@dnd-kit/utilities';

import { Draggable } from '../DragNDrop/index';

interface Props {
  activationConstraint?: PointerActivationConstraint;
  handle?: boolean;
  modifiers?: Modifiers;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string ;
  style?: React.CSSProperties;
  defaultCoordinates?: DefaultCoordinates;
  label?: string;
}

export type DefaultCoordinates = Record<string, Coordinates>;

export function GridDraggable({
  activationConstraint,
  handle,
  modifiers,
  style,
  buttonStyle,
  buttonClassName,
  defaultCoordinates
}: Props) {

  if (!defaultCoordinates) {
    defaultCoordinates = {
      "A1": { x: 0, y: 0 },
      "A2": { x: 120, y: 80 },
      "A3": { x: 240, y: 360 },
    }
  }

  useEffect(() => {
    if (typeof defaultCoordinates !== "undefined") {
      setCoordinates(defaultCoordinates);
    }
  }, [defaultCoordinates]);

  const [coordinates, setCoordinates] = useState<DefaultCoordinates>(defaultCoordinates);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);
  console.log(coordinates);
  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(e) => {
        const delta = e.delta;
        setCoordinates((prev) => {
          const x = prev[e.active.id].x;
          const y = prev[e.active.id].y;
          // normalize the final placement to be valid on the grid
          const gridSize = 20;
          const roundedX = (Math.floor((x + delta.x) / gridSize)) * gridSize;
          const roundedY = (Math.floor((y + delta.y) / gridSize)) * gridSize;

          return {
            ...prev,
            [e.active.id]: {
              x: roundedX,
              y: roundedY
            }
          }
        });
      }}
      modifiers={modifiers}
    >
      {defaultCoordinates && Object.entries(defaultCoordinates).map(([key]) => {
        return coordinates[key] && (
          <DraggableItem
            key={key}
            handle={handle}
            top={coordinates[key].y}
            left={coordinates[key].x}
            style={style}
            buttonStyle={buttonStyle}
            buttonClassName={buttonClassName}
            label={key}
          />
        );
      })}
    </DndContext>
  );
}

interface DraggableItemProps {
  handle?: boolean;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;
  top?: number;
  left?: number;
  label?: string;
}

function DraggableItem({
  style,
  top,
  left,
  handle,
  label,
  buttonStyle,
  buttonClassName
}: DraggableItemProps) {
  const id = label?.split(" ").join("-") ?? "any";
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
      label={label}
      {...attributes}
    />
  );
}
