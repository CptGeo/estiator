import React from 'react';
import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors
} from '@dnd-kit/core';

import { Normalized, TableData } from '../../core/types';
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
}: Props) {

  const mouseSensor = useSensor(MouseSensor, { activationConstraint });
  const touchSensor = useSensor(TouchSensor, { activationConstraint });
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext sensors={sensors} modifiers={modifiers}>
      {data && Object.entries(data).map(([key]) => {
        return data[key] && (
          <React.Fragment key={key}>
            <GridTableDraggable
              handle={handle}
              value={data[key]}
              id={key}
              />
          </React.Fragment>
        );
      })}
    </DndContext>
  );
}
