"use client";

import { cn } from "../../lib/utils";
import React, { useState, createContext, useContext, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
  transitioning: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate, transitioning }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  const [hovering, setHovering] = useState(false);
  const debouncedHovering = useDebounce(hovering, 100);
  const animationCompleteRef = useRef(true);
  
  // 处理鼠标悬停效果，添加防抖
  const handleMouseEnter = () => {
    if (animate && animationCompleteRef.current) {
      setHovering(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (animate) {
      setHovering(false);
    }
  };
  
  // 使用useEffect跟踪防抖后的hover状态变化
  React.useEffect(() => {
    if (animate) {
      setOpen(debouncedHovering);
    }
  }, [debouncedHovering, setOpen, animate]);
  
  return (
    <motion.div
      className={cn(
        "fixed left-0 top-14 bottom-0 h-[calc(100vh-3.5rem)] px-4 py-4 hidden md:flex md:flex-col bg-background border-r border-border/30 flex-shrink-0 z-30",
        className
      )}
      animate={{
        width: animate ? (open ? "147px" : "77px") : "150px",
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier easing for smoother animation
        onComplete: () => {
          animationCompleteRef.current = true;
        },
        onStart: () => {
          animationCompleteRef.current = false;
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "fixed top-14 left-0 z-30 h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-background w-full border-b border-border/30",
          className
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-foreground cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1.0], // 使用相同的cubic-bezier曲线
              }}
              className={cn(
                "fixed h-full w-full inset-0 top-14 bg-background p-6 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-6 top-6 z-50 text-foreground cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  onClick,
  ...props
}: {
  link: Links;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  props?: React.ComponentProps<"a">;
}) => {
  const { open } = useSidebar();
  
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center py-2 px-3 cursor-pointer rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 relative",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <motion.div
        className="flex-shrink-0"
        animate={{
          x: open ? 0 : 0,
        }}
        transition={{
          duration: 0.2,
          ease: [0.25, 0.1, 0.25, 1.0],
        }}
      >
        {link.icon}
      </motion.div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.span
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{
              duration: 0.25,
              ease: [0.25, 0.1, 0.25, 1.0],
            }}
            className="text-foreground text-sm whitespace-nowrap overflow-hidden"
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
}; 