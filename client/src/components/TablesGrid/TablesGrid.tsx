import { createSnapModifier, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { GridDndContext } from "../Grid/GridDndContext";
import { CSSProperties, ReactElement, useCallback, useMemo } from "react";
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
      <div className="grid-outer-bg rounded-large w-full overflow-auto max-h-[400px] md:max-h-[650px]">
        <div style={{ "--grid-size": `${gridSize}px` } as CSSProperties} className="relative h-[1500px] w-[1500px] overflow-hidden grid-bg z-0 justify-between bg-content2 shadow-inner">
          <GridDndContext
            activationConstraint={activationConstraint}
            modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
            buttonStyle={buttonStyle}
            style={style}
            tables={getNormalizedTable(tables)}
            gridSize={gridSize}
          />
        </div>
    </div>

  ) : <div className="p-4"><Spinner /></div>;
}