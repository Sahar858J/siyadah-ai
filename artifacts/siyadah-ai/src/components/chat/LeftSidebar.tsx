import { useLocation } from "wouter";
import { PenSquare, Settings, LogOut } from "lucide-react";
import { clearSession, getSession } from "@/lib/auth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppContext } from "@/context/AppContext";
import SettingsPanel from "@/components/settings/SettingsPanel";
import { useState } from "react";

interface Props {
  onNewChat: () => void;
}

export default function LeftSidebar({ onNewChat }: Props) {
  const [, setLocation] = useLocation();
  const { language } = useAppContext();
  const session = getSession();
  const userInitial = session?.email ? session.email[0].toUpperCase() : "U";
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    setLocation("/");
  };

  return (
    <>
      <div
        className="flex flex-col items-center h-full py-4"
        style={{
          width: "64px",
          minWidth: "64px",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(8,8,8,0.9)",
        }}
      >
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="white" fillOpacity="0.06" />
              <path
                d="M7 8.5C7 7.67 7.67 7 8.5 7h7C16.33 7 17 7.67 17 8.5v0C17 9.33 16.33 10 15.5 10h-4C10.67 10 10 10.67 10 11.5v1C10 13.33 10.67 14 11.5 14h4c.83 0 1.5.67 1.5 1.5v0c0 .83-.67 1.5-1.5 1.5h-7C7.67 17 7 16.33 7 15.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <SidebarButton
            onClick={onNewChat}
            label={language === "ar" ? "محادثة جديدة" : "New Chat"}
            testId="button-new-chat"
          >
            <PenSquare size={16} />
          </SidebarButton>
        </div>

        <div className="flex flex-col items-center gap-1">
          <SidebarButton
            onClick={() => setSettingsOpen(true)}
            label={language === "ar" ? "الإعدادات" : "Settings"}
            testId="button-settings"
            active={settingsOpen}
          >
            <Settings size={16} />
          </SidebarButton>

          <SidebarButton
            onClick={handleLogout}
            label={language === "ar" ? "تسجيل الخروج" : "Sign out"}
            testId="button-logout"
          >
            <LogOut size={16} />
          </SidebarButton>

          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-black mt-2 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.85)" }}
            title={session?.email}
            onClick={() => setSettingsOpen(true)}
          >
            {userInitial}
          </div>
        </div>
      </div>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

function SidebarButton({
  children,
  onClick,
  label,
  testId,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  testId?: string;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          data-testid={testId}
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
            background: active ? "rgba(255,255,255,0.08)" : "transparent",
          }}
          onMouseEnter={(e) => {
            if (!active) {
              (e.currentTarget as HTMLButtonElement).style.color = "white";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)";
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }
          }}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p className="text-xs">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
