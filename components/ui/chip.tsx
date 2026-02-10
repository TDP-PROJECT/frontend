import { cn } from "@/lib/utils";
import { CHIP_LEVEL_CONFIG, type ChipLevel } from "@/constant";

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  grade?: ChipLevel;
}

export function Chip({ grade = "입문 지망생", className, ...props }: ChipProps) {
  const config = CHIP_LEVEL_CONFIG[grade];
  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-2 py-1  text-[10px] font-semibold",
        config.className,
        className
      )}
      {...props}
    >
      {grade}
    </span>
  );
}
