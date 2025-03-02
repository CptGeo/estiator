import type { TableData } from "@core/types";
import classNames from "classnames";
import styles from '@components/DragNDrop/TableDraggable/TableDraggable.module.css';
import { gridSize, gridItemMultiplierHeight, gridItemMultiplierWidth, gridItemGap } from "@settings";
import { type Key } from "react";
import { Chip } from "@heroui/react";

type Props = {
  value: TableData;
  selectedId?: Key;
  onPress: (id: Key | null) => void;
}

export function GridTableReadonly({ value, selectedId, onPress }: Props) {
  const { id, label, capacity, x, y, color, occupied } = value;

  const selected = selectedId == id;

  const buttonStyle = {
    marginLeft: gridItemGap,
    marginRight: gridItemGap,
    marginTop: gridItemGap,
    marginBottom: gridItemGap,
    width: gridSize * gridItemMultiplierWidth - (gridItemGap * 2),
    height: gridSize * gridItemMultiplierHeight - (gridItemGap * 2)
  };

  function handleClick() {
    if (!occupied) {
      onPress(id);
    }
  }

  return (
    <div
        className={classNames(
          styles.Draggable,
          "hover:z-50"
        )}
        style={{
            alignItems: "flex-start",
            top: y,
            left: x,
          } as React.CSSProperties }
      >
        <button
            className={classNames(
              "readonly select-none text-default-50 z-auto group absolute border-4",
              color ?? "bg-default-800", occupied === true ? "before:bg-opacity-40 before:z-20 before:bg-black before:w-full before:h-full before:rounded-md" : "",
              selected ? "border-success-500 shadow-lg" : ""
            )}
              onClick={handleClick}
              style={buttonStyle}
              type="button"
              aria-label={label}>
            <p className="text-xs absolute top-1">Table</p>
            <p className="text-xl absolute top-[50%] translate-y-[-50%] font-bold drop-shadow-lg">{label}</p>
            <div className="absolute right-0 bottom-0 w-full justify-between items-end flex pl-1">
              <p className="text-[12px] text-left inline-block drop-shadow-lg pr-1">Capacity: {capacity}</p>
              <Chip size="sm" color={`${occupied === true ? "danger" : "success"}`} variant="shadow" className="z-30 absolute right-0 bottom-0 translate-x-1/3 border-1 border-background translate-y-1/3">{occupied === true ? "Occupied" : "Free"}</Chip>
            </div>
        </button>
      </div>
  );
}
