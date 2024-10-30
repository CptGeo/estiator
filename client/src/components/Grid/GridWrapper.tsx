import classNames from "classnames";
import { HTMLAttributes, ReactElement } from "react";

export default function GridWrapper(props: HTMLAttributes<HTMLDivElement>): ReactElement {
  const { children, className, ...otherProps } = props;

  const defaultClassName = "grid-outer-bg w-full overflow-auto max-h-[400px] md:max-h-[650px]";
  const combinedClassName = classNames(className, defaultClassName);

  return (
    <div className={combinedClassName} {...otherProps}> {/* !important rules because grid background needs a wrapper for the pattern to remain fixed to position */}
        <div className="relative h-[1500px] w-[1500px] overflow-hidden grid-bg z-0 justify-between bg-content2 rounded-large shadow-small">
          {children}
        </div>
    </div>
  )
}