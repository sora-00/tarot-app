import { Box } from "@chakra-ui/react";
import NextImage from "next/image";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

type Props = {
  backSrc: string;
  frontSrc: string;
  isFlipped: boolean;
  isReversed?: boolean;
}

export function FlipCard(props: Props) {
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
      <MotionBox
        style={containerStyle}
        animate={{ rotateY: props.isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Box style={{ ...faceStyle, transform: "rotateY(0deg)" }}>
          <Box position="relative" width="100%" height="100%" borderRadius="md" overflow="hidden">
            <NextImage
              src={props.backSrc}
              alt="back"
              fill
              style={{ objectFit: "cover" }}
              priority={false}
            />
          </Box>
        </Box>

        <Box style={{ ...faceStyle, transform: "rotateY(180deg)" }}>
          <MotionBox
            animate={{ rotate: props.isReversed ? 180 : 0 }}
            transition={{ duration: 0.3, delay: props.isFlipped ? 0.3 : 0 }}
            w="100%"
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box position="relative" width="100%" height="100%" borderRadius="md" overflow="hidden">
              <NextImage
                src={props.frontSrc}
                alt="front"
                fill
                style={{ objectFit: "contain" }}
                priority={false}
                loading="lazy"
              />
            </Box>
          </MotionBox>
        </Box>
      </MotionBox>
    </Box>
  );
}
