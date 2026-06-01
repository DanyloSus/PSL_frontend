import type { ReactNode } from "react";

import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import type { AttributeItem } from "./sidebar-attribute-row";

interface Props {
  username: string;
  email: string;
  attributes: AttributeItem[];
  now: Date;
  onLogActivity: () => void;
  onLogout: () => void;
  children: ReactNode;
}

export function AppShell({
  username,
  email,
  attributes,
  now,
  onLogActivity,
  onLogout,
  children
}: Props) {
  return (
    <div className="bg-background flex min-h-dvh w-full">
      <AppSidebar
        username={username}
        email={email}
        attributes={attributes}
        onLogActivity={onLogActivity}
        onLogout={onLogout}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          now={now}
          onLogActivity={onLogActivity}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
