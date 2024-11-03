import { createSnapModifier, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { DefaultCoordinates, GridDraggable } from "../Grid/GridDraggable";
import { ReactElement, useCallback, useMemo } from "react";
import useGetTables from "../../hooks/useGetTables";
import { isUndefined } from "../../core/utils";
import { Spinner } from "@nextui-org/react";

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

  const tables  = useGetTables();

  const getCoordinates = useCallback(() => {
    if (tables) {
      const coords: DefaultCoordinates = {};
      for (const table of tables) {
        coords[table.id] = { ...table.coordinates };
      }
      return coords;
    }
    return {};
  }, [tables]);

  const defaultCoordinates = getCoordinates();

  return !isUndefined(tables) ? (
      <GridDraggable
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        style={style}
        defaultCoordinates={defaultCoordinates}
        gridSize={gridSize}
      />
  ) : <div className="p-4"><Spinner /></div>;
}