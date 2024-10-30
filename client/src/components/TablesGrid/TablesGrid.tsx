import { createSnapModifier, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { DefaultCoordinates, GridDraggable } from "../Grid/GridDraggable";
import { ReactElement, useMemo } from "react";

type Props = {
  size: number;
}

export default function TablesGrid(props: Props): ReactElement {
  const gap = 1;
  const gridSize = props.size;

  const style = {
    alignItems: "flex-start"
  }

  const buttonStyle = {
    marginLeft: gridSize - 20 + gap,
    marginTop: gridSize - 20 + gap,
    width: 20 * 5 - gap,
    height: 20 * 4 - gap
  };

  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);
  const activationConstraint = {
    delay: 250,
    tolerance: 5
  };

  /** Mock coordinates */
  const defaultCoordinates: DefaultCoordinates = {
    "A1": { x: 200, y: 480 },
    "A2": { x: 200, y: 360 },
    "A3": { x: 200, y: 240 },
    "A4": { x: 200, y: 120 },
    "B1": { x: 360, y: 480 },
    "B2": { x: 360, y: 360 },
    "B3": { x: 360, y: 240 },
    "B4": { x: 360, y: 120 },
    "C1": { x: 520, y: 480 },
    "C2": { x: 520, y: 360 },
    "C3": { x: 520, y: 240 },
    "D1": { x: 680, y: 480 },
    "D2": { x: 680, y: 360 },
    "D3": { x: 680, y: 240 },
    "Z1": { x: 1160, y: 120 },
    "Z2": { x: 1040, y: 220 },
    "Z3": { x: 1040, y: 120 },
    "Z4": { x: 1160, y: 220 },
  }

  return (
      <GridDraggable
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        style={style}
        defaultCoordinates={defaultCoordinates}
        gridSize={gridSize}
      />
  );
}