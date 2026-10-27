import Image from "next/image";

type LogoProps = {
  /** Tailwind text color class for the "JatJeng" wordmark. */
  wordClassName?: string;
};

export default function Logo({ wordClassName = "text-foreground" }: LogoProps) {
  return (
    <span
      className={`flex items-center gap-2 font-display text-xl font-bold tracking-tight ${wordClassName}`}
    >
      <Image
        src="/images/Brick.png"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0"
        priority
      />
      JatJeng
    </span>
  );
}
