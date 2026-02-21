import { Box } from "@chakra-ui/react"

type Props = {
  size?: number
}

export function Spacer(props: Props) {
  const height = props.size ?? 4
  return <Box h={height} />
}
