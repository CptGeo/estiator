import { createSnapModifier, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { GridDndContext } from "../Grid/GridDndContext";
import { CSSProperties, Key, MouseEventHandler, ReactElement, useCallback, useMemo, useRef, useState } from "react";
import useGetTables from "../../hooks/useGetTables";
import { isUndefined, normalize } from "../../core/utils";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, useDisclosure } from "@nextui-org/react";
import { TableData } from "../../core/types";
import AddIcon from "../Icons/AddIcon";
import { PointerActivationConstraint } from "@dnd-kit/core";
import AddTableModal from "../Modal/AddTable";

type Props = {
  size: number;
}

export default function TablesGrid(props: Props): ReactElement {
  const gridSize = props.size;
  const addTableDisclosure = useDisclosure();
  const containerRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({
    x: 100,
    y: 100,
    active: false
  });

  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);
  const activationConstraint: PointerActivationConstraint = {
    delay: 200,
    tolerance: 5,
  };

  const tables = useGetTables(1000);
  const getNormalizedTable =
    useCallback((data: TableData[] | null | undefined) => normalize<TableData>(data), [tables]);

  const count = useMemo(() => tables?.reduce((prev, current) => prev + current.capacity, 0), [tables]);

  function topContent(): ReactElement {
    return (
      <div className="flex flex-row justify-between items-end">
        <p className="text-xs text-default-600">
          {count! > 0 && `Total capacity: ${count} seats`}
        </p>
        <Button color="primary" onPress={addTableDisclosure.onOpen}><AddIcon className="text-md" />Add table</Button>
      </div>
    )
  }

  function closeContextMenu() {
    setContextMenu((prev) => {
      return {
        ...prev,
        active: false
      }
    })
  }

  function ContextMenu(): ReactElement {
    function handleAction(key: Key) {
      switch(key) {
        case "new":
          addTableDisclosure.onOpen();
          closeContextMenu();
          break;
      }
    }

    return (
      <Dropdown placement="bottom-start" isOpen={contextMenu.active}>
        <DropdownTrigger>
          <div className={`absolute z-[99] text-sm text-black ${contextMenu.active ? "" : "hidden"}`} style={{ top: contextMenu.y, left: contextMenu.x }}></div>
        </DropdownTrigger>
        <DropdownMenu variant="flat" aria-label="Dropdown menu with shortcut" onAction={(key) => handleAction(key)}>
          <DropdownItem key="new">New table</DropdownItem>
        </DropdownMenu>
      </Dropdown>);
  }

  function showContextMenu(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    if(event.target as HTMLElement == containerRef.current) {
      const boundingRectangle = (event.target as HTMLElement).getBoundingClientRect();
      const x = event.pageX - boundingRectangle.left;
      const y = event.pageY - boundingRectangle.top;
      setContextMenu({ x, y, active: true });
    }
  }

  function resetContextMenu() {
    setContextMenu({ x: 100, y: 100, active: false });
  }

  return (
    <div className="flex flex-col gap-4" onClick={resetContextMenu}>
      {topContent()}
      {!isUndefined(tables) ?
        <div className="relative grid-outer-bg rounded-large w-full overflow-auto max-h-[400px] md:max-h-[650px]">
          <ContextMenu />
          <div
            ref={containerRef}
            onContextMenu={showContextMenu}
            style={{ "--grid-size": `${gridSize}px` } as CSSProperties}
            className="relative h-[1500px] w-[1500px] overflow-hidden grid-bg z-0 justify-between bg-content2 shadow-inner">
            <GridDndContext
              activationConstraint={activationConstraint}
              modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
              data={getNormalizedTable(tables)}
              gridSize={gridSize}
            />
          </div>
        </div> : <div className="p-4 w-full flex justify-center"><Spinner /></div>}
        <AddTableModal {...addTableDisclosure} defaultCoordinates={{ x: contextMenu.x, y: contextMenu.y }} />
    </div>
  )
}