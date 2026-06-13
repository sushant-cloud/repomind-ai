export function awardMedalColor(rank) {
  switch (rank) {
    case 1:
      return { text: "text-amber-400", bg: "bg-amber-955/20", border: "border-amber-500/40" };
    case 2:
      return { text: "text-zinc-300", bg: "bg-zinc-955/20", border: "border-zinc-400/40" };
    case 3:
      return { text: "text-orange-400", bg: "bg-orange-955/20", border: "border-orange-500/40" };
    default:
      return { text: "text-zinc-500", bg: "bg-zinc-950", border: "border-zinc-850" };
  }
}

export function developerLevelBadgeStyle(level) {
  switch (level) {
    case "Legend":
      return "text-rose-400 border-rose-500/20 bg-rose-500/5 font-mono text-[9px]";
    case "Architect":
      return "text-amber-400 border-amber-500/20 bg-amber-500/5 font-mono text-[9px]";
    case "Maintainer":
      return "text-indigo-400 border-indigo-500/20 bg-indigo-500/5 font-mono text-[9px]";
    case "Builder":
      return "text-zinc-400 border-zinc-805 bg-zinc-950 font-mono text-[9px]";
    default:
      return "text-zinc-400 border-zinc-500/20 bg-zinc-500/5 font-mono text-[9px]";
  }
}
