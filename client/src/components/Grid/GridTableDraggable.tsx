import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";
import { TableData } from "../../core/types";
import classNames from "classnames";
import styles from '../DragNDrop/TableDraggable/TableDraggable.module.css';
import { Link } from "react-router-dom";
import { EditIcon } from "../Icons/EditIcon";
import { gridSize, gridItemMultiplierHeight, gridItemMultiplierWidth, gridItemGap } from "../../settings.json";

type Props = {
  handle?: boolean;
  dragOverlay?: boolean;
  id: UniqueIdentifier;
  value: TableData;
  onOpen: () => void;
}

/** TODO: Extract in separate file */
export function GridTableDraggable({
  handle,
  dragOverlay,
  id,
  value,
  onOpen
}: Props) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({ id });
  const { label, capacity, x, y, color } = value;

  const buttonStyle = {
    marginLeft: gridItemGap,
    marginRight: gridItemGap,
    marginTop: gridItemGap,
    marginBottom: gridItemGap,
    width: gridSize * gridItemMultiplierWidth - (gridItemGap * 2),
    height: gridSize * gridItemMultiplierHeight - (gridItemGap * 2)
  };

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
            className={classNames("text-default-50 z-auto group absolute", color ?? "bg-default-800")}
            ref={setNodeRef}
            style={buttonStyle}
            aria-label={label}
            {...(handle ? {} : listeners)}>
            <p className="text-xs absolute top-1">Τραπέζι</p>
            <p className="text-xl absolute top-[50%] translate-y-[-50%] font-bold drop-shadow-lg">{label}</p>
            <Link onClick={onOpen} to="" color="primary" className="z-[9999999] bg-primary p-2 rounded-full text-default-50 hover:shadow-md transition-opacity opacity-0 group-hover:opacity-100 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
              <EditIcon className="text-sm" />
            </Link>
            <p className="text-[12px] w-full text-right inline-block drop-shadow-lg absolute right-0 bottom-0 pr-1">Άτομα: {capacity}</p>
        </button>

      </div>
  );
}
