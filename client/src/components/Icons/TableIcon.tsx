function TableIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M2 7h20v3h-2l1 9h-2.5l-.56-5H6.06l-.56 5H3l1-9H2V7m15.5 3h-11l-.21 2h11.42l-.21-2z" />
    </svg>
  );
}

export default TableIcon;
