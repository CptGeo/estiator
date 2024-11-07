import type { ReactElement } from "react";

type Props = {
  heading: string;
  subheading?: string;
};

export default function PageHeader(props: Props): ReactElement {
  const { heading, subheading } = props;

  return (
    <div className="mb-5">
      <h1 className="text-3xl tracking-wide drop-shadow-md font-light mb-0">{heading}</h1>
      {subheading && <p className="mt-0 text-xs text-slate-400">{subheading}</p>}
    </div>
  );
}
