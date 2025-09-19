import { Box } from "@chakra-ui/react";
import NextImage from "next/image";
import { motion } from "framer-motion";

interface FlipCardProps {
  backSrc: string;
  frontSrc: string;
  isFlipped: boolean;
  isReversed?: boolean;
}

export function FlipCard({ backSrc, frontSrc, isFlipped, isReversed }: FlipCardProps) {
  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
  };

  const faceStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      borderRadius="md"
      overflow="hidden"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        style={containerStyle}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div style={{ ...faceStyle, transform: "rotateY(0deg)" }}>
          <Box position="relative" width="100%" height="100%" borderRadius="md" overflow="hidden">
            <NextImage
              src={backSrc}
              alt="back"
              fill
              sizes="(max-width: 767px) 40vw, 160px"
              style={{ objectFit: "cover" }}
              priority={false}
            />
          </Box>
        </div>

        <div style={{ ...faceStyle, transform: "rotateY(180deg)" }}>
          <motion.div
            animate={{ rotate: isReversed ? 180 : 0 }}
            transition={{ duration: 0.3, delay: isFlipped ? 0.3 : 0 }}
            style={{ 
              width: "100%", 
              height: "100%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}
          >
            <Box position="relative" width="100%" height="100%" borderRadius="md" overflow="hidden">
              <NextImage
                src={frontSrc}
                alt="front"
                fill
                sizes="(max-width: 767px) 40vw, 160px"
                style={{ objectFit: "contain" }}
                priority={false}
                loading="lazy"
              />
            </Box>
          </motion.div>
        </div>
      </motion.div>
    </Box>
  );
}


