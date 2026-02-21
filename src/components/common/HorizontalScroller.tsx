import { Box } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
}

export function HorizontalScroller(props: Props) {
  return (
    <Box
      overflowX="auto"
      overflowY="hidden"
      w="100%"
      h="100%"
      css={{
        scrollBehavior: "smooth",
      }}
    >
      <Box
        display="flex"
        h="100%"
        alignItems="center"
        gap="20px"
        padding="0 30px"
        cursor="grab"
        width="max-content"
        minW="100%"
      >
        {props.children}
      </Box>
    </Box>
  );
}
