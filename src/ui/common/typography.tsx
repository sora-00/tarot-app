import { Text } from "@chakra-ui/react"

interface Props {
  children: React.ReactNode
  align?: "left" | "center" | "right"
}

export function Title({ children, align = "center" }: Props) {
  return (
    <Text fontSize="4xl" fontWeight="bold" textAlign={align} color="purple.600">
      {children}
    </Text>
  )
}

export function Note({ children, align = "center" }: Props) {
  return (
    <Text fontSize="lg" textAlign={align} color="gray.600">
      {children}
    </Text>
  )
}

export function Title2({ children, align = "left" }: Props) {
  return (
    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mt={4} textAlign={align} color="purple.600">
      {children}
    </Text>
  )
}

export function Note2({ children, align = "left" }: Props) {
  return (
    <Text fontSize={{ base: "md", md: "lg" }} textAlign={align} color="gray.600">
      {children}
    </Text>
  )
}


