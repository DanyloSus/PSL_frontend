import { BarChart3, LayoutDashboard, Plus, ScrollText } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/ui/button";

import {
  SidebarAttributeRow,
  type AttributeItem
} from "./sidebar-attribute-row";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarUser } from "./sidebar-user";

const LABEL_NAVIGATE = "// NAVIGATE";
const LABEL_ATTRIBUTES = "// ATTRIBUTES";

interface Props {
  username: string;
  email: string;
  attributes: AttributeItem[];
  onLogActivity: () => void;
  onLogout: () => void;
}

export function AppSidebar({
  username,
  email,
  attributes,
  onLogActivity,
  onLogout
}: Props) {
  return (
    <aside className="border-border-soft bg-panel-solid/60 sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-5 border-r px-4 py-5 backdrop-blur-xl lg:flex">
      <BrandMark size="sm" />

      <nav className="space-y-1">
        <p className="text-faint mb-2 px-1 font-mono text-[9px] tracking-[1.5px]">
          {LABEL_NAVIGATE}
        </p>
        <SidebarNavItem
          to="/dashboard"
          label="Dashboard"
          icon={LayoutDashboard}
        />
        <SidebarNavItem
          to="/activity-log"
          label="Activity Log"
          icon={ScrollText}
        />
        <SidebarNavItem
          to="/attributes"
          label="Attributes"
          icon={BarChart3}
        />
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <p className="text-faint mb-1 px-1 font-mono text-[9px] tracking-[1.5px]">
          {LABEL_ATTRIBUTES}
        </p>
        {attributes.map(item => (
          <SidebarAttributeRow
            key={item.id}
            item={item}
          />
        ))}
      </div>

      <Button
        type="button"
        onClick={onLogActivity}
        className="hover:bg-primary/90 shadow-glow h-11 gap-2 rounded-sm text-[13px] font-bold tracking-[1px]"
      >
        <Plus
          className="size-4"
          strokeWidth={2.4}
        />
        LOG ACTIVITY
        <span className="font-mono text-[9px] opacity-60">⌘N</span>
      </Button>

      <SidebarUser
        username={username}
        email={email}
        onLogout={onLogout}
      />
    </aside>
  );
}
