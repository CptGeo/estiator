import { useCallback, useMemo, useRef, useState } from "react";
import type { CSSProperties, Key, ReactElement } from "react";
import { createSnapModifier, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { GridDndContext } from "@components/Grid/GridDndContext";
import useQueryTables from "@hooks/useQueryTables";
import { isUndefined, normalize } from "@core/utils";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, useDisclosure } from "@heroui/react";
import type { TableData } from "@core/types";
import AddIcon from "@components/Icons/AddIcon";
import type { PointerActivationConstraint } from "@dnd-kit/core";
import AddTableModal from "@components/Modal/AddTable";

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

  /** Dragging activation constraints */
  const activationConstraint: PointerActivationConstraint = {
    delay: 200,
    tolerance: 5,
  };

  const { data: tables } = useQueryTables(500);

  const getNormalizedTable = useCallback((data: TableData[] | null | undefined) => normalize<TableData>(data), [tables]);

  /** Memoized calculation of total capacity */
  const count = useMemo(() => tables?.reduce((prev: number, current: TableData) => prev + current.capacity, 0), [tables]);

  /** Content to render over grid area */
  function topContent(): ReactElement {
    return (
      <div className="flex flex-row justify-between items-end">
        <p className="text-default-400 text-tiny">
          {count! > 0 && `Total capacity: ${count} seats`}
        </p>
        <Button color="primary" onPress={handleAddTable}>Add table <AddIcon className="text-md" /></Button>
      </div>
    )
  }

  /** Handles opening the modal to add a new table */
  function handleAddTable() {
    addTableDisclosure.onOpen();
    closeContextMenu();
  }

  /** Closes context menu */
  function closeContextMenu() {
    setContextMenu((prev) => {
      return {
        ...prev,
        active: false
      }
    })
  }

  /** Context menu to display when user right clicks on the grid area */
  function ContextMenu(): ReactElement {
    function handleAction(key: Key) {
      switch(key) {
        case "new":
          handleAddTable();
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

  /** Displays the context menu on pointer location */
  function showContextMenu(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    if(event.target as HTMLElement == containerRef.current) {
      const boundingRectangle = (event.target as HTMLElement).getBoundingClientRect();
      const x = event.pageX - boundingRectangle.left;
      const y = event.pageY - boundingRectangle.top;
      setContextMenu({ x, y, active: true });
    }
  }

  return (
    <div className="flex flex-col gap-4" onClick={closeContextMenu}>
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