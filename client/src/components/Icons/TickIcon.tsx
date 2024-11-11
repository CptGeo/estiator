function TickIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 15 15" height="1em" width="1em" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M14.707 3L5.5 12.207.293 7 1 6.293l4.5 4.5 8.5-8.5.707.707z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default TickIcon;
