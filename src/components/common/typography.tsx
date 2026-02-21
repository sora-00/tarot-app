import { Text } from "@chakra-ui/react"

type Props = {
  children: React.ReactNode
  align?: "left" | "center" | "right"
}

export function Title(props: Props) {
  return (
    <Text fontSize="4xl" fontWeight="bold" textAlign={props.align} color="purple.600">
      {props.children}
    </Text>
  )
}

export function Note(props: Props) {
  return (
    <Text fontSize="lg" textAlign={props.align} color="gray.600">
      {props.children}
    </Text>
  )
}

export function Title2(props: Props) {
  return (
    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mt={4} textAlign={props.align} color="purple.600">
      {props.children}
    </Text>
  )
}

export function Note2(props: Props) {
  return (
    <Text fontSize={{ base: "md", md: "lg" }} textAlign={props.align} color="gray.600">
      {props.children}
    </Text>
  )
}
