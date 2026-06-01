import { LogOut } from "lucide-react";

interface Props {
  username: string;
  email: string;
  onLogout: () => void;
}

export function SidebarUser({ username, email, onLogout }: Props) {
  return (
    <div className="border-border-soft flex items-center gap-2.5 rounded-sm border bg-white/[0.02] px-3 py-2.5">
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
      <button
        type="button"
        onClick={onLogout}
        aria-label="Log out"
        className="text-muted-foreground hover:text-danger transition-colors"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
}
