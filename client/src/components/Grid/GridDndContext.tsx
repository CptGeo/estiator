import React from "react";
import type {
  PointerActivationConstraint,
  Modifiers } from "@dnd-kit/core";
import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors
} from "@dnd-kit/core";

import type { Normalized, TableData } from "@core/types";
import { GridTableDraggable } from "@components/Grid/GridTableDraggable";

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
