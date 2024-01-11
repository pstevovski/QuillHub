"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import cn from "@/utils/classnames";

/*==============================
  RADIX TOOLTIP
===============================*/
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipContainer = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipArrow = TooltipPrimitive.Arrow;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground animate-fadeIn fade-in-0 zoom-in-95 data-[state=closed]:animate-fadeOut data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

/*==============================
  CUSTOM TOOLTIP WRAPPER
===============================*/
interface TooltipProps {
  children: React.ReactNode;
  text: string;
  side: "top" | "right" | "bottom" | "left" | undefined;
  modifierClass?: string;
  delayDuration?: number;
  sideOffset?: number;
}

export default function Tooltip({
  children,
  text,
  modifierClass = "",
  delayDuration = 150,
  sideOffset = 8,
  side = "top",
}: TooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipContainer>
        <TooltipTrigger>{children}</TooltipTrigger>

        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          className={cn(
            "bg-slate-50 p-3 rounded max-w-[350px] text-center break-word whitespace-normal",
            modifierClass
          )}
        >
          <p className="text-slate-400 text-sm">{text}</p>

          <TooltipArrow className="fill-slate-200" width={12} height={6} />
        </TooltipContent>
      </TooltipContainer>
    </TooltipProvider>
  );
}
