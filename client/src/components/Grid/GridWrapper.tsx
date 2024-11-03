import classNames from "classnames";
import { HTMLAttributes, ReactElement } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  size: number;
}

export default function GridWrapper(props: Props): ReactElement {
  const { children, className, size, ...otherProps } = props;

  // !important rules because grid background needs a wrapper for the pattern to remain fixed to position
  const defaultClassName = "grid-outer-bg rounded-large w-full overflow-auto max-h-[400px] md:max-h-[650px]";
  const combinedClassName = classNames(className, defaultClassName);
  const style = {
    "--grid-size": `${size}px`
  } as React.CSSProperties;

  return (
    <div className={combinedClassName} {...otherProps}>
        <div style={style} className="relative h-[1500px] w-[1500px] overflow-hidden grid-bg z-0 justify-between bg-content2 shadow-inner">
          {children}
        </div>
    </div>
  )
}