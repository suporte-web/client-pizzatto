import { useCallback, useEffect, useRef, useState } from "react";

export function useSidebarSubmenu(
  menuScrollRef: React.RefObject<HTMLDivElement | null>,
  isCollapsed: boolean,
) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [openPopout, setOpenPopout] = useState(false);
  const [popoutTop, setPopoutTop] = useState(0);
  const [openExpanded, setOpenExpanded] = useState(false);

  const recalcTop = useCallback(() => {
    const root = wrapperRef.current;
    const btn = root?.querySelector(".ps-menu-button") as HTMLElement | null;

    setPopoutTop(btn?.getBoundingClientRect().top ?? 0);
  }, []);

  useEffect(() => {
    if (!openPopout || !isCollapsed) return;

    const el = menuScrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", recalcTop, { passive: true });
    recalcTop();

    return () => {
      el.removeEventListener("scroll", recalcTop);
    };
  }, [openPopout, isCollapsed, menuScrollRef, recalcTop]);

  return {
    wrapperRef,
    openPopout,
    setOpenPopout,
    popoutTop,
    openExpanded,
    setOpenExpanded,
    recalcTop,
  };
}