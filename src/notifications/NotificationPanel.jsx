import { Bell, CheckCheck, GitCommit, GitPullRequest, TicketCheck, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function NotificationPanel({
  notifications,
  onMarkAllRead,
  onRefresh
}) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotifIcon = (type) => {
    switch (type) {
      case "pr":
        return <GitPullRequest className="w-4 h-4 text-emerald-400" />;
      case "issue":
        return <TicketCheck className="w-4 h-4 text-amber-500" />;
      case "chat":
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case "alert":
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <GitCommit className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div id="notif-desk" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[540px]">
      {/* Panel header controls */}
      <div className="px-5 py-4 border-b border-zinc-805 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-4.5 h-4.5 text-zinc-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-505"></span>
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 font-sans tracking-tight">Activity Feed</h3>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-[10px] font-mono text-zinc-400 hover:text-indigo-400 flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-850"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {/* Main feed list */}
      <div className="grow overflow-y-auto divide-y divide-zinc-850 bg-zinc-950/10">
        <AnimatePresence initial={false}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 flex gap-3 h-auto items-start transition-all ${notif.isRead ? "opacity-60 bg-transparent" : "bg-indigo-500/[0.02]"}`}
              >
                {/* Event type icon holder */}
                <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-zinc-950 border border-zinc-850">
                  {getNotifIcon(notif.type)}
                </div>

                {/* Text logs column */}
                <div className="grow min-w-0">
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="text-xs font-bold text-zinc-200 truncate">{notif.title}</span>
                    <span className="text-[9px] text-zinc-505 font-mono shrink-0">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-450 font-sans leading-relaxed mt-1">{notif.text}</p>
                  
                  {notif.repoId && (
                    <span className="inline-block mt-2 text-[9px] font-mono text-indigo-400 bg-indigo-950/25 border border-indigo-900/40 px-1.5 py-0.5 rounded">
                      #{notif.repoId}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-24 text-center text-zinc-500 space-y-2">
              <Bell className="w-10 h-10 mx-auto text-zinc-800" />
              <p className="text-xs font-sans">No events triggered yet.</p>
              <p className="text-[10px] font-mono leading-relaxed max-w-xs mx-auto text-zinc-600">
                Events will activate upon commits, merges, and issue completions.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer statistics desk */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/30 text-center text-[10px] text-zinc-500 font-mono flex items-center justify-between">
        <span>Logged queue size: {notifications.length} lists</span>
        <button onClick={onRefresh} className="hover:text-indigo-400 transition-colors">Refresh Feed</button>
      </div>
    </div>
  );
}
