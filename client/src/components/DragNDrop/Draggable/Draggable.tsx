import React, { forwardRef } from 'react';
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
      buttonClassName,
      label,
      ...props
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
        <button
          className={`z-auto group absolute w-[100px] h-[100px] text-lg ${buttonClassName}`} {...(handle ? {} : listeners)}
          ref={ref}
          style={buttonStyle}
          aria-label="Table A1"
          {...props}
          >
            <p className="text-xs absolute top-1">Τραπέζι</p>
            <p className="text-xl absolute top-[50%] translate-y-[-50%] font-bold">{label}</p>
            <Link to={"#"} color="primary" className="z-[9999999] bg-primary p-2 rounded-full text-default-50 hover:shadow-md transition-opacity opacity-0 group-hover:opacity-100 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
              <EditIcon className="text-sm" />
            </Link>
        </button>

        {/* {label ? <label>{label}</label> : null} */}
      </div>
    );
  }
);
