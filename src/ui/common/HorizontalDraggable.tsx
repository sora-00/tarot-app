'use client'

import { motion } from "framer-motion";

interface HorizontalDraggableProps {
  widthPx: number;
  itemCount: number;
  isMobile: boolean;
  children: React.ReactNode;
}

export function HorizontalDraggable({ widthPx, itemCount, isMobile, children }: HorizontalDraggableProps) {
  return (
    <motion.div
      style={{ display: "flex", height: "100%", alignItems: "center", gap: "20px", padding: "0 30px", cursor: "grab", width: "max-content", minWidth: "100%" }}
      drag="x"
      dragConstraints={{ left: isMobile ? -(itemCount * (widthPx + 8)) : -(itemCount * (widthPx - 30)), right: 0 }}
      dragElastic={0.1}
      dragMomentum
      dragPropagation={false}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      whileDrag={{ cursor: "grabbing" }}
    >
      {children}
    </motion.div>
  );
}


