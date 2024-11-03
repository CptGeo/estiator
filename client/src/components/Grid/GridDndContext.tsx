import React, { useEffect, useState } from 'react';
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
import type { Coordinates, Transform } from '@dnd-kit/utilities';

import { Normalized, TableData } from '../../core/types';
import classNames from 'classnames';
import styles from '../DragNDrop/TableDraggable/TableDraggable.module.css';
import { Link } from 'react-router-dom';
import { EditIcon } from '../Icons/EditIcon';

interface Props {
  activationConstraint?: PointerActivationConstraint;
  handle?: boolean;
  modifiers?: Modifiers;
  buttonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  tables: Normalized<TableData>;
  label?: string;
  gridSize: number;
}

export type DefaultCoordinates = Record<string, Coordinates>;

export function GridDndContext({
  activationConstraint,
  handle,
  modifiers,
  style,
  buttonStyle,
  tables,
  gridSize
}: Props) {

  const [coordinates, setCoordinates] = useState<Normalized<TableData>>(tables);
  // Context specific hooks
  const mouseSensor = useSensor(MouseSensor, { activationConstraint });
  const touchSensor = useSensor(TouchSensor, { activationConstraint });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  // TODO: Find a way to this temporary fix;
  useEffect(() => {
    setCoordinates(tables);
  }, [tables]);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(e) => {
        const delta = e.delta;

        setCoordinates((prev) => {
          const x = prev[e.active.id].x;
          const y = prev[e.active.id].y;
          // normalize the final placement to be valid on the grid
          const roundedX = (Math.floor((x + delta.x) / gridSize)) * gridSize;
          const roundedY = (Math.floor((y + delta.y) / gridSize)) * gridSize;

          return {
            ...prev,
            [e.active.id]: {
              ...prev[e.active.id],
              x: roundedX,
              y: roundedY
            }
          }
        });
      }}
      modifiers={modifiers}
    >
      {coordinates && Object.entries(coordinates).map(([key]) => {
        return coordinates[key] && (
          <GridTableDraggable
            key={key}
            handle={handle}
            top={coordinates[key].y}
            left={coordinates[key].x}
            style={style}
            buttonStyle={buttonStyle}
            buttonClassName={coordinates[key].color}
            label={coordinates[key].label}
          />
        );
      })}
    </DndContext>
  );
}

interface GridTableDraggableProps {
  handle?: boolean;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;
  top?: number;
  left?: number;
  label?: string;
  dragOverlay?: boolean;
  dragging?: boolean;
  transform?: Transform | null;
}

function GridTableDraggable({
  style,
  top,
  left,
  handle,
  label,
  buttonStyle,
  buttonClassName,
  dragOverlay,
}: GridTableDraggableProps) {
  const id = label?.split(" ").join("-") ?? "any";
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
        {...attributes}
        className={classNames(
          styles.Draggable,
          dragOverlay && styles.dragOverlay,
          isDragging && styles.dragging,
          handle && styles.handle,
          "hover:z-50"
        )}
        style={{
            ...style,
            top,
            left,
            '--translate-x': `${transform?.x ?? 0}px`,
            '--translate-y': `${transform?.y ?? 0}px`,
          } as React.CSSProperties }
      >
        <button
            className={classNames("text-default-50 z-auto group absolute w-[100px] h-[100px] text-lg", buttonClassName ?? "bg-default-800")}
            ref={setNodeRef}
            style={buttonStyle}
            aria-label={label}
            {...(handle ? {} : listeners)}>
            <p className="text-xs absolute top-1">Τραπέζι</p>
            <p className="text-xl absolute top-[50%] translate-y-[-50%] font-bold">{label}</p>
            <Link to={`/${label}#`} color="primary" className="z-[9999999] bg-primary p-2 rounded-full text-default-50 hover:shadow-md transition-opacity opacity-0 group-hover:opacity-100 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
              <EditIcon className="text-sm" />
            </Link>
        </button>

      </div>
  );
}
