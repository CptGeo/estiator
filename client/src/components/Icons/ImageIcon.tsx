function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M96 80 H416 A48 48 0 0 1 464 128 V384 A48 48 0 0 1 416 432 H96 A48 48 0 0 1 48 384 V128 A48 48 0 0 1 96 80 z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M368 176 A32 32 0 0 1 336 208 A32 32 0 0 1 304 176 A32 32 0 0 1 368 176 z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0143.11-2L464 368"
      />
    </svg>
  );
}

export default ImageIcon;
