import { Box, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface FlipCardProps {
  backSrc: string;
  frontSrc: string;
  isFlipped: boolean;
  isReversed?: boolean;
}

export function FlipCard({ backSrc, frontSrc, isFlipped, isReversed }: FlipCardProps) {
  return (
    <Box position="relative" width="100%" height="100%" borderRadius="md" overflow="hidden" style={{ perspective: "1000px" }}>
      <motion.div
        style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", transform: "rotateY(0deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Image src={backSrc} alt="back" width="100%" height="100%" objectFit="cover" borderRadius="md" style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", transform: "rotateY(180deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div animate={{ rotate: isReversed ? 180 : 0 }} transition={{ duration: 0.3, delay: isFlipped ? 0.3 : 0 }} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src={frontSrc} alt="front" width="100%" height="100%" objectFit="contain" borderRadius="md" style={{ maxWidth: "100%", maxHeight: "100%" }} />
          </motion.div>
        </div>
      </motion.div>
    </Box>
  );
}


