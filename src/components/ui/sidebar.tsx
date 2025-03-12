"use client";

import { cn } from "../../lib/utils";
import React, { useState, createContext, useContext, useRef, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { useTranslation } from "react-i18next";

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
  isEnglish: boolean;
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
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate, transitioning, isEnglish }}>
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
      <DesktopSidebar {...props}>
        <motion.div 
          className="flex flex-col h-full w-full"
          layout
          transition={{
            layout: { type: "spring", stiffness: 400, damping: 30 }
          }}
        >
          {props.children}
        </motion.div>
      </DesktopSidebar>
      <MobileSidebar {...(props as React.ComponentProps<"div">)}>
        <motion.div 
          className="flex flex-col h-full w-full"
          layout
          transition={{
            layout: { type: "spring", stiffness: 400, damping: 30 }
          }}
        >
          {props.children}
        </motion.div>
      </MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate, isEnglish } = useSidebar();
  const [hovering, setHovering] = useState(false);
  const debouncedHovering = useDebounce(hovering, 50);
  const animationCompleteRef = useRef(true);
  const shouldReduceMotion = useReducedMotion();
  
  const handleMouseEnter = useCallback(() => {
    if (animate && animationCompleteRef.current) {
      setHovering(true);
    }
  }, [animate]);
  
  const handleMouseLeave = useCallback(() => {
    if (animate) {
      setHovering(false);
    }
  }, [animate]);
  
  React.useEffect(() => {
    if (animate) {
      setOpen(debouncedHovering);
    }
  }, [debouncedHovering, setOpen, animate]);

  const sidebarWidth = isEnglish ? 180 : 147;
  const collapsedWidth = 77;
  
  return (
    <motion.div
      className={cn(
        "fixed left-0 top-14 bottom-0 h-[calc(100vh-3.5rem)] px-4 py-4 hidden md:flex md:flex-col bg-background border-r border-border/30 flex-shrink-0 z-30 dark:bg-[#141a1a] dark:border-[#1e2626]/50",
        "will-change-[width,transform]",
        className
      )}
      layout="position"
      layoutId="sidebar"
      initial={false}
      animate={{
        width: animate 
          ? (open ? sidebarWidth : collapsedWidth)
          : sidebarWidth,
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: [0.25, 0.1, 0.25, 1.0],
        type: "spring",
        stiffness: 600,
        damping: 35,
        mass: 0.8,
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
      <motion.div 
        className="flex flex-col h-full w-full"
        layout="position"
        transition={{
          duration: shouldReduceMotion ? 0 : 0.2,
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
      >
        {children}
      </motion.div>
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
          "fixed top-14 left-0 z-30 h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-background w-full border-b border-border/30 dark:bg-[#141a1a] dark:border-[#1e2626]/50",
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
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
              className={cn(
                "fixed h-full w-full inset-0 top-14 bg-background p-6 z-[100] flex flex-col justify-between dark:bg-[#141a1a]",
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
  const { open, isEnglish } = useSidebar();
  
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center py-2 px-3 cursor-pointer rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-200 relative group",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <motion.div
        className="flex-shrink-0 relative"
        animate={{
          x: open ? 0 : 0,
          scale: open ? 1 : 1.1,
        }}
        transition={{
          duration: 0.2,
          ease: [0.25, 0.1, 0.25, 1.0],
        }}
      >
        {link.icon}
        <motion.div 
          className="absolute -inset-1 bg-blue-100 dark:bg-blue-900/20 rounded-full z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          layoutId={`icon-bg-${link.href}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, width: 0, height: 0, marginLeft: 0, overflow: "hidden" }}
            animate={{ 
              opacity: 1, 
              width: "auto", 
              height: "auto", 
              marginLeft: 12,
              overflow: "visible"
            }}
            exit={{ opacity: 0, width: 0, height: 0, marginLeft: 0, overflow: "hidden" }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1.0],
              height: { type: "spring", stiffness: 500, damping: 30 }
            }}
            layout
            className="overflow-hidden flex items-center"
          >
            <motion.span
              layout
              className={cn(
                "text-foreground text-sm",
                isEnglish ? "whitespace-normal min-w-[80px]" : "whitespace-nowrap"
              )}
            >
              {link.label}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </a>
  );
}; 