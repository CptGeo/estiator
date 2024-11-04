import { createSnapModifier, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { GridDndContext } from "../Grid/GridDndContext";
import { CSSProperties, ReactElement, useCallback, useMemo } from "react";
import useGetTables from "../../hooks/useGetTables";
import { isUndefined, normalize } from "../../core/utils";
import { Button, Spinner } from "@nextui-org/react";
import { TableData } from "../../core/types";
import AddIcon from "../Icons/AddIcon";
import { PointerActivationConstraint } from "@dnd-kit/core";

type Props = {
  size: number;
}

export default function TablesGrid(props: Props): ReactElement {
  const gridSize = props.size;

  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);
  const activationConstraint: PointerActivationConstraint = {
    delay: 200,
    tolerance: 5,
  };

  const tables = useGetTables();
  const getNormalizedTable = useCallback((data: TableData[] | null | undefined) => normalize<TableData>(data), [tables]);

  const tablesCount = tables?.length;

  function topContent(): ReactElement {
    return (
      <div className="flex flex-row justify-between items-end">
        <p className="text-xs text-default-600">{tablesCount! > 0 && `Total ${tablesCount} table${tablesCount! > 1 ? "s" : ""}`}</p>
        <Button color="primary"><AddIcon className="text-md" />Add table</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {topContent()}
      {!isUndefined(tables) ?
        <div className="grid-outer-bg rounded-large w-full overflow-auto max-h-[400px] md:max-h-[650px]">
          <div style={{ "--grid-size": `${gridSize}px` } as CSSProperties} className="relative h-[1500px] w-[1500px] overflow-hidden grid-bg z-0 justify-between bg-content2 shadow-inner">
            <GridDndContext
              activationConstraint={activationConstraint}
              modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
              data={getNormalizedTable(tables)}
              gridSize={gridSize}
            />
          </div>
        </div> : <div className="p-4 w-full flex justify-center"><Spinner /></div>}
    </div>
  )
}