import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ headline: string, description?: string; }>;

export default function SettingsListItem(props: Props) {
  const { headline, description, children } = props;
  return (
    <div className="w-full flex flex-row">
      <div className="w-full grid grid-cols-1 gap-2 md:grid-cols-8 md:gap-10 border-b-1 border-foreground-200 py-5">
        <div className="col-span-3 py-3 pl-1">
          <h3 className="font-bold text-lg mb-1">{headline}</h3>
          <p className="text-small text-foreground-400">{description}</p>
        </div>
        <div className="col-span-5 flex items-center">
          {children}
        </div>
      </div>
    </div>
  )
}