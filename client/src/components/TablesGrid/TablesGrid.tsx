import { createSnapModifier, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { GridDraggable } from "../Grid/GridDraggable";
import { ReactElement, useCallback, useMemo } from "react";
import useGetTables from "../../hooks/useGetTables";
import { isUndefined, normalize } from "../../core/utils";
import { Spinner } from "@nextui-org/react";
import { TableData } from "../../core/types";

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

  const tables = useGetTables();
  const getNormalizedTable = useCallback((data: TableData[] | null | undefined) => normalize<TableData>(data), [tables]);

  return !isUndefined(tables) ? (
      <GridDraggable
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        style={style}
        tables={getNormalizedTable(tables)}
        gridSize={gridSize}
      />
  ) : <div className="p-4"><Spinner /></div>;
}