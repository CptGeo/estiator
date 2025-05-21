import { useCallback, useMemo, useRef, useState } from "react";
import type { CSSProperties, Key, ReactElement } from "react";
import { createSnapModifier, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { GridDndContext } from "@components/Grid/GridDndContext";
import useQueryTables from "@hooks/useQueryTables";
import { getFullName, isUndefined, normalize } from "@core/utils";
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, useDisclosure } from "@heroui/react";
import { DietaryPreferenceOption, type ReservationData, type TableData } from "@core/types";
import type { PointerActivationConstraint } from "@dnd-kit/core";
import AddTableModal from "@components/Modal/AddTable";
import { AddCircleTwoTone, Egg, Grass, KebabDining, NoFood } from "@mui/icons-material";
import { useTables } from "@context/Tables";
import { getLocalTimeZone, today } from "@internationalized/date";
import useQueryReservationsByTable from "@hooks/useQueryReservationsByTable";
import useQueryUserByTable from "@hooks/useQueryUserByTable";

type Props = {
  size: number;
}

const IconsMap = {
  [DietaryPreferenceOption.GLUTEN_FREE]: <NoFood />,
  [DietaryPreferenceOption.HALAL]: <KebabDining />,
  [DietaryPreferenceOption.VEGAN]: <Grass />,
  [DietaryPreferenceOption.VEGETARIAN]: <Egg />,
}

export default function TablesGrid(props: Props): ReactElement {
  const gridSize = props.size;
  const addTableDisclosure = useDisclosure();
  const containerRef = useRef(null);
  const { selected } = useTables();
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
        <Button color="primary" onPress={handleAddTable}>Add table  <AddCircleTwoTone fontSize="small" /></Button>
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
      switch (key) {
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
    if (event.target as HTMLElement == containerRef.current) {
      const boundingRectangle = (event.target as HTMLElement).getBoundingClientRect();
      const x = event.pageX - boundingRectangle.left;
      const y = event.pageY - boundingRectangle.top;
      setContextMenu({ x, y, active: true });
    }
  }

  const EmptySidebar = () => {
    return (
      <div className="flex items-center">
        <p className="text-foreground-400 text-center">
          No table selected
        </p>
      </div>
    )
  }

  return (
    <div className="flex gap-2 items-stretch">
      <div className="flex flex-col gap-4 flex-grow flex-shrink overflow-auto" onClick={closeContextMenu}>
        {topContent()}
        {!isUndefined(tables) ?
          <div className="relative grid-outer-bg rounded-large w-full overflow-auto max-h-[400px] md:max-h-[650px]">
            <ContextMenu />
            <div
              ref={containerRef}
              onContextMenu={showContextMenu}
              style={{ "--grid-size": `${gridSize}px` } as CSSProperties}
              className="relative h-[1500px] w-[1500px] flex-1 overflow-hidden grid-bg z-0 justify-between bg-content2 shadow-inner">
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
      <div className="flex self-stretch w-[300px] justify-center min-w-[250px] basis-1/4 p-3 bg-content2 border-neutral-200 border-1 rounded-md">
        {selected ? <TablesSidebar selected={selected} /> : <EmptySidebar />}
      </div>
    </div>
  )
}

function TablesSidebar({ selected }: { selected: TableData }) {
  const currentDay = today(getLocalTimeZone());
  const { data: upcomingReservations } = useQueryReservationsByTable<ReservationData[]>(selected?.id, 3000, { dateFrom: currentDay.toString(), dateTo: currentDay.toString() });
  const { data: user } = useQueryUserByTable(selected.id, { enabled: !!selected.id });
  const occupied = selected.occupied;

  return (
    <div className="w-full flex flex-col justify-between">
      <div className="text-left w-full">
        <div className="flex flex-nowrap items-center justify-between py-3">
          <h3 className="text-xl">Table: {selected.label}</h3>
        </div>
        <Divider className="mb-5" />
        {occupied ? (
          <div>
            <ul>
              {selected.user?.dietaryPreferences?.map(d => <li key={d.id}>{d.name}</li>)}
            </ul>
            {user && <div>
              <h3 className="text-sm mb-2">Active client details:</h3>
              <ul className="pb-2 mb-3 border-b-1">
                <li>{getFullName(user)}</li>
                <li><a className="text-primary" href={`mailto:${user.email}`}>{user.email}</a></li>
                <li><a className="text-primary" href={`tel:${user.phone}`}>{user.phone}</a></li>
              </ul>
              {user.dietaryPreferences.length > 0 &&
                <>
                  <h3 className="text-sm mb-2">Client dietary preferences:</h3><ul>
                    {user.dietaryPreferences.map(pref => {
                      return <li key={pref.id} className="flex flex-col mb-2">
                        <small className="text-foreground-600 inline-flex flex-row items-center gap-2">
                          {IconsMap[pref.id]}
                          {pref.name}
                        </small>
                      </li>;
                    })}
                  </ul>
                </>
              }
            </div>}
          </div>
        ) : (
          <div>
            <p className="text-foreground-400">
              No active reservation
            </p>
          </div>
        )}
      </div>
      <div className="min-h-[200px]">
        <h3 className="text-xl py-3">{"Upcoming reservations"}</h3>
        {(upcomingReservations ?? [])?.length > 0 ? (
          <div className="max-h-[300px] overflow-auto">
            <ul className="flex flex-wrap gap-1 overflow-auto ">
              {upcomingReservations?.map(rsvt => {
                return <li className="px-2 pl-[35px] py-1 w-full even:bg-neutral-200 odd:bg-success-100 inline-flex gap-3 whitespace-nowrap relative" key={rsvt.id}><span className="w-[15px] h-[15px] left-2 top-1/2 absolute -translate-y-1/2 rounded-full bg-success border-1 border-success-300"></span><span>{rsvt.time}</span><span>Persons: {rsvt.persons}</span></li>
              })}
            </ul>
          </div>
        ) : (
          <p className="text-foreground-400">
            No upcoming reservations
          </p>
        )}
      </div>
    </div>
  )
}