import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import type { TableData } from "@core/types";
import classNames from "classnames";
import styles from '@components/DragNDrop/TableDraggable/TableDraggable.module.css';
import { Link } from "react-router-dom";
import { gridSize, gridItemMultiplierHeight, gridItemMultiplierWidth, gridItemGap } from "@settings";
import type { Key } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Coordinates } from "@dnd-kit/core/dist/types";
import EditTableModal from "@components/Modal/EditTable";
import { Chip, useDisclosure } from "@heroui/react";
import { patchReq } from "@core/utils";
import { EditTwoTone } from "@mui/icons-material";
import { useTables } from "@context/Tables";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";

type Props = {
  handle?: boolean;
  dragOverlay?: boolean;
  id: UniqueIdentifier;
  value: TableData;
  onClick: () => void;
}

export function GridTableDraggable({ handle, dragOverlay, id, value, onClick }: Props) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({ id });
  const [data, setData] = useState<TableData>(value);
  const { label, capacity, x, y, color, occupied } = data;
  const modal = useDisclosure();
  useDndMonitor({ onDragEnd: handleDragEnd });
  const { selected } = useTables();
  const isSelected = selected?.id == id;

  const hasReservations = useMemo(() => (value?.reservations?.filter((rsvt) => {
    return parseDate(rsvt.date).compare(today(getLocalTimeZone())) === 0;
  }) || []).length > 0, [value.reservations]);

  useEffect(() => {
    if (value && !isDragging) {
      setData(value);
    }
  }, [value]);

  const buttonStyle = {
    marginLeft: gridItemGap,
    marginRight: gridItemGap,
    marginTop: gridItemGap,
    marginBottom: gridItemGap,
    width: gridSize * gridItemMultiplierWidth - (gridItemGap * 2),
    height: gridSize * gridItemMultiplierHeight - (gridItemGap * 2)
  };

  /** Updates the position of the item every time there is a change on the UI */
  async function updatePosition(id: Key, coords: Coordinates) : Promise<void> {
    try {
      await patchReq(`/tables/${id}`, { ...coords });
    } catch (error) {
      console.error(error);
    }
  }

  function handleDragEnd({ active, delta }: DragEndEvent): void {
    // update current only (1) when current item is being dragged, and (2) when delta is not 0
    if (active.id === id && (Math.abs(delta.x) + Math.abs(delta.y)) != 0 ) {
      const x = data.x;
      const y = data.y;

      // normalize the final placement to be valid on the grid
      const roundedX = (Math.floor((x + delta.x) / gridSize)) * gridSize;
      const roundedY = (Math.floor((y + delta.y) / gridSize)) * gridSize;

      setData((prev) => {
        return {
          ...prev,
          x: roundedX,
          y: roundedY
        }
      });

      updatePosition(active.id, { x: roundedX, y: roundedY });
    }
  }

  return (
    <div
        {...attributes}
        className={classNames(
          styles.Draggable,
          dragOverlay && styles.dragOverlay,
          isDragging && styles.dragging,
          handle && styles.handle,
          "hover:z-50"
        )}
        style={{
            alignItems: "flex-start",
            top: y,
            left: x,
            '--translate-x': `${transform?.x ?? 0}px`,
            '--translate-y': `${transform?.y ?? 0}px`,
          } as React.CSSProperties }
      >
        <button
            className={classNames(
              "select-none text-default-50 z-auto group absolute border-3",
              color ?? "bg-default-800",
              occupied === true ? "before:bg-opacity-40 before:z-20 before:bg-black before:w-full before:h-full before:rounded-md" : "",
              isSelected ? "border-success-500 shadow-lg" : "",
              hasReservations ? "bg-stripe-45" : ""
            )}
            ref={setNodeRef}
            style={buttonStyle}
            onClick={onClick}
            aria-label={label}
            {...(handle ? {} : listeners)}>
            <p className="text-xs absolute top-1">Table</p>
            <p className="text-xl absolute top-[50%] translate-y-[-50%] font-bold drop-shadow-lg">{label}</p>
            <Link onClick={modal.onOpen} to="" color="primary" className="z-[9999999] bg-primary p-2 rounded-full text-default-50 hover:shadow-md transition-opacity opacity-0 group-hover:opacity-100 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <EditTwoTone className="text-[10px]" fontSize="inherit" />
            </Link>
            <div className="absolute right-0 bottom-0 w-full justify-between items-end flex pl-1">
              <p className="text-[12px] text-left inline-block drop-shadow-lg pr-1">Capacity: {capacity}</p>
              <Chip size="sm" color={`${occupied === true ? "danger" : "success"}`} variant="shadow" className="z-30 absolute right-0 bottom-0 translate-x-1/3 border-1 border-background translate-y-1/3">{occupied === true ? "Occupied" : "Free"}</Chip>
            </div>
        </button>
        <EditTableModal {...modal} table={value}/>
      </div>
  );
}
