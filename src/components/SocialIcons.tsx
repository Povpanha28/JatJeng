/**
 * Brand marks for the footer. lucide-react dropped brand icons in v1, so these
 * are hand-rolled single-path SVGs that inherit the surrounding text color.
 */
type IconProps = { size?: number; className?: string };

function Svg({
  size = 18,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function TwitterIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M17.53 3h3.04l-6.64 7.59L21.75 21h-5.9l-4.3-5.62L6.6 21H3.56l6.87-7.85L2.75 3h6.05l4.03 5.33L17.53 3Zm-1.07 16.2h1.68L7.35 4.72H5.55L16.46 19.2Z" />
    </Svg>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </Svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05a4.2 4.2 0 0 1 3.78-2.08C20.6 8.56 22 10.6 22 14.1V21h-4v-6.12c0-1.54-.55-2.6-1.93-2.6-1.05 0-1.67.71-1.95 1.4-.1.24-.12.58-.12.93V21h-4V9Z" />
    </Svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21.58 7.2a2.51 2.51 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.42A2.51 2.51 0 0 0 2.42 7.2C2 8.77 2 12 2 12s0 3.23.42 4.8a2.51 2.51 0 0 0 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.78C22 15.23 22 12 22 12s0-3.23-.42-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </Svg>
  );
}
