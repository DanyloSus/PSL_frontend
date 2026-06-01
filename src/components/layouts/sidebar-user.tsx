import { LogOut } from "lucide-react";

import { Button } from "@/ui/button";

interface Props {
  username: string;
  email: string;
  onLogout: () => void;
}

export function SidebarUser({ username, email, onLogout }: Props) {
  return (
    <div className="border-border-soft bg-surface-subtle flex items-center gap-2.5 rounded-sm border px-3 py-2.5">
      <div className="bg-primary/15 text-primary border-primary/30 grid size-8 place-items-center rounded-sm border text-sm font-bold uppercase">
        {username.slice(0, 1)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-foreground truncate text-[13px] font-semibold">
          {username}
        </div>
        <div className="text-muted-foreground truncate font-mono text-[9px] tracking-[0.5px]">
          {email}
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onLogout}
        aria-label="Log out"
        className="text-muted-foreground hover:text-danger"
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  );
}
