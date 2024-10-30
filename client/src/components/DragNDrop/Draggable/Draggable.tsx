import React, { forwardRef, ReactElement } from 'react';
import classNames from 'classnames';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';

import styles from './Draggable.module.css';
import { EditIcon } from '../../Icons/EditIcon';
import { Link } from 'react-router-dom';

interface Props {
  dragOverlay?: boolean;
  dragging?: boolean;
  handle?: boolean;
  label?: string;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;
  transform?: Transform | null;
}

export const Draggable = forwardRef<HTMLButtonElement, Props>(
  function Draggable(
    {
      dragOverlay,
      dragging,
      handle,
      listeners,
      transform,
      style,
      buttonStyle,
      label
    },
    ref
  ) {

    return (
      <div
        className={classNames(
          styles.Draggable,
          dragOverlay && styles.dragOverlay,
          dragging && styles.dragging,
          handle && styles.handle,
          "hover:z-50"
        )}
        style={{
            ...style,
            '--translate-x': `${transform?.x ?? 0}px`,
            '--translate-y': `${transform?.y ?? 0}px`,
          } as React.CSSProperties }
      >
        <GridTableItem
          label={label}
          ref={ref}
          className="bg-indigo-800 text-default-50"
          buttonStyle={buttonStyle}
          handle={handle}
          listeners={listeners}
        />
      </div>
    );
  }
);

type ItemProps = {
  label?: string;
  handle?: boolean;
  listeners?: DraggableSyntheticListeners;
  className?: string;
  buttonStyle?: React.CSSProperties;
}

const GridTableItem = forwardRef<HTMLButtonElement, ItemProps>(
  function GridTableItem(props: ItemProps, ref): ReactElement {
    const { label, className, buttonStyle, handle, listeners } = props;

    const combinedClassName = classNames(
      "z-auto group absolute w-[100px] h-[100px] text-lg",
      className
      );

      return (
        <button
          className={combinedClassName} {...(handle ? {} : listeners)}
          ref={ref}
          style={buttonStyle}
          aria-label={label}
        >
          <p className="text-xs absolute top-1">Τραπέζι</p>
          <p className="text-xl absolute top-[50%] translate-y-[-50%] font-bold">{label}</p>
          <Link to={`/${label}#`} color="primary" className="z-[9999999] bg-primary p-2 rounded-full text-default-50 hover:shadow-md transition-opacity opacity-0 group-hover:opacity-100 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
            <EditIcon className="text-sm" />
          </Link>
      </button>
      )
    }
)

