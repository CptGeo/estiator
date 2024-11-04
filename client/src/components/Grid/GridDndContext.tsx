import React, { Key, useEffect, useState } from 'react';
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
  UniqueIdentifier,
  DragEndEvent
} from '@dnd-kit/core';
import type { Coordinates, Transform } from '@dnd-kit/utilities';

import { Normalized, TableData } from '../../core/types';
import classNames from 'classnames';
import styles from '../DragNDrop/TableDraggable/TableDraggable.module.css';
import { EditIcon } from '../Icons/EditIcon';
import { client } from '../../core/request';
import { Link } from 'react-router-dom';
import EditTableModal from '../Modal/EditTable';
import { useDisclosure } from '@nextui-org/react';

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
  gridSize,
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

  /** Updates the position data every time there is a change on the UI from the user */
  async function updatePosition(id: Key, coords: Coordinates) : Promise<void> {
    try {
      await client.patch(`/tables/${id}`, { ...coords });
    } catch (error) {
      console.error(error);
    }
  }

  function handleDragEnd(e: DragEndEvent): void {
    const delta = e.delta;
    const x = coordinates[e.active.id].x;
    const y = coordinates[e.active.id].y;
    // normalize the final placement to be valid on the grid
    const roundedX = (Math.floor((x + delta.x) / gridSize)) * gridSize;
    const roundedY = (Math.floor((y + delta.y) / gridSize)) * gridSize;

    setCoordinates((prev) => {
      return {
        ...prev,
        [e.active.id]: {
          ...prev[e.active.id],
          x: roundedX,
          y: roundedY
        }
      }
    });
    updatePosition(e.active.id, { x: roundedX, y: roundedY });
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      {coordinates && Object.entries(coordinates).map(([key]) => {
        const modal = useDisclosure();
        return coordinates[key] && (
          <React.Fragment key={key}>
            <GridTableDraggable
              handle={handle}
              top={coordinates[key].y}
              left={coordinates[key].x}
              style={style}
              buttonStyle={buttonStyle}
              buttonClassName={coordinates[key].color}
              label={coordinates[key].label}
              id={key}
              onOpen={modal.onOpen}
              />
            <EditTableModal key={key} table={coordinates[key]} {...modal} />
          </React.Fragment>
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
  id: UniqueIdentifier;
  onOpen: () => void;
}

/** TODO: Extract in separate file */
function GridTableDraggable({
  style,
  top,
  left,
  handle,
  label,
  buttonStyle,
  buttonClassName,
  dragOverlay,
  id,
  onOpen
}: GridTableDraggableProps) {
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
            className={classNames("text-default-50 z-auto group absolute", buttonClassName ?? "bg-default-800")}
            ref={setNodeRef}
            style={buttonStyle}
            aria-label={label}
            {...(handle ? {} : listeners)}>
            <p className="text-xs absolute top-1">Τραπέζι</p>
            <p className="text-xl absolute top-[50%] translate-y-[-50%] font-bold drop-shadow-lg">{label}</p>
            <Link onClick={onOpen} to="" color="primary" className="z-[9999999] bg-primary p-2 rounded-full text-default-50 hover:shadow-md transition-opacity opacity-0 group-hover:opacity-100 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
              <EditIcon className="text-sm" />
            </Link>
            <p className="text-[12px] w-full text-right inline-block drop-shadow-lg absolute right-0 bottom-0 pr-1">Άτομα: 4</p>
        </button>

      </div>
  );
}
