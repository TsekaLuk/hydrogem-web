import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut, MessageSquare, BarChart, LifeBuoy } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export function SidebarDemo() {
  const links = [
    {
      label: "聊天",
      href: "#chat",
      icon: (
        <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "监控",
      href: "#monitoring",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "数据分析",
      href: "#analytics",
      icon: (
        <BarChart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "帮助支持",
      href: "#help",
      icon: (
        <LifeBuoy className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "设置",
      href: "#settings",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "退出",
      href: "#logout",
      icon: (
        <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-full" 
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "用户",
                href: "#user",
                icon: (
                  <div className="h-7 w-7 flex-shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    U
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold">内容区域</h1>
        <p>这里是主要内容区域</p>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-7 w-7 flex-shrink-0 flex items-center justify-center">
        <img 
          src="/brand-icons/HydroGem-logo.svg" 
          alt="HydroGem Logo" 
          className="h-6 w-6"
        />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        HydroGem
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-7 w-7 flex-shrink-0 flex items-center justify-center">
        <img 
          src="/brand-icons/HydroGem-logo.svg" 
          alt="HydroGem Logo" 
          className="h-6 w-6"
        />
      </div>
    </a>
  );
}; 