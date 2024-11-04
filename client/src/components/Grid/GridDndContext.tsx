import React, { Key, useEffect, useState } from 'react';
import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import type { Coordinates } from '@dnd-kit/utilities';

import { Normalized, TableData } from '../../core/types';
import { client } from '../../core/request';
import EditTableModal from '../Modal/EditTable';
import { useDisclosure } from '@nextui-org/react';
import { GridTableDraggable } from './GridTableDraggable';

interface Props {
  activationConstraint?: PointerActivationConstraint;
  handle?: boolean;
  modifiers?: Modifiers;
  data: Normalized<TableData>;
  gridSize: number;
}

export function GridDndContext({
  activationConstraint,
  handle,
  modifiers,
  data,
  gridSize,
}: Props) {

  const [tables, setTables] = useState<Normalized<TableData>>(data);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint });
  const touchSensor = useSensor(TouchSensor, { activationConstraint });
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    setTables(data);
  }, [data]);

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
    const x = tables[e.active.id].x;
    const y = tables[e.active.id].y;

    // normalize the final placement to be valid on the grid
    const roundedX = (Math.floor((x + delta.x) / gridSize)) * gridSize;
    const roundedY = (Math.floor((y + delta.y) / gridSize)) * gridSize;

    setTables((prev) => {
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
      {tables && Object.entries(tables).map(([key]) => {
        const modal = useDisclosure();
        return tables[key] && (
          <React.Fragment key={key}>
            <GridTableDraggable
              handle={handle}
              value={tables[key]}
              id={key}
              onOpen={modal.onOpen}
              />
            <EditTableModal key={key} table={tables[key]} {...modal} />
          </React.Fragment>
        );
      })}
    </DndContext>
  );
}
