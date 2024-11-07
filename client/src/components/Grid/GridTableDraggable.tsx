import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import type { TableData } from "@core/types";
import classNames from "classnames";
import styles from '@components/DragNDrop/TableDraggable/TableDraggable.module.css';
import { Link } from "react-router-dom";
import { EditIcon } from "@components/Icons/EditIcon";
import { gridSize, gridItemMultiplierHeight, gridItemMultiplierWidth, gridItemGap } from "@settings";
import type { Key } from "react";
import { useEffect, useState } from "react";
import type { Coordinates } from "@dnd-kit/core/dist/types";
import { client } from "@core/request";
import EditTableModal from "@components/Modal/EditTable";
import { useDisclosure } from "@nextui-org/react";

type Props = {
  handle?: boolean;
  dragOverlay?: boolean;
  id: UniqueIdentifier;
  value: TableData;
}

export function GridTableDraggable({ handle, dragOverlay, id, value }: Props) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({ id });
  const [data, setData] = useState<TableData>(value);
  const { label, capacity, x, y, color } = data;
  const modal = useDisclosure();
  useDndMonitor({ onDragEnd: handleDragEnd });

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
      await client.patch(`/tables/${id}`, { ...coords });
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
            className={classNames("select-none text-default-50 z-auto group absolute", color ?? "bg-default-800")}
            ref={setNodeRef}
            style={buttonStyle}
            aria-label={label}
            {...(handle ? {} : listeners)}>
            <p className="text-xs absolute top-1">Τραπέζι</p>
            <p className="text-xl absolute top-[50%] translate-y-[-50%] font-bold drop-shadow-lg">{label}</p>
            <Link onClick={modal.onOpen} to="" color="primary" className="z-[9999999] bg-primary p-2 rounded-full text-default-50 hover:shadow-md transition-opacity opacity-0 group-hover:opacity-100 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
              <EditIcon className="text-sm" />
            </Link>
            <p className="text-[12px] w-full text-right inline-block drop-shadow-lg absolute right-0 bottom-0 pr-1">Άτομα: {capacity}</p>
        </button>
        <EditTableModal {...modal} table={value}/>
      </div>
  );
}
