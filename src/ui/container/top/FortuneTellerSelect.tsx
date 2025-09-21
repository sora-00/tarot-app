import { Select, FormControl, FormLabel, Box } from "@chakra-ui/react"
import { fortuneTellers } from "../../../data/fortune-tellers"

interface FortuneTellerSelectProps {
  selectedFortuneTeller: string
  onFortuneTellerChange: (fortuneTeller: string) => void
}

export function FortuneTellerSelect({ selectedFortuneTeller, onFortuneTellerChange }: FortuneTellerSelectProps) {
  return (
    <FormControl>
      <FormLabel fontSize="lg" fontWeight="bold" textAlign="center">
        占い師を選択してください
      </FormLabel>
      <Box display="flex" justifyContent="center">
        <Select
          value={selectedFortuneTeller}
          onChange={(e) => onFortuneTellerChange(e.target.value)}
          size="lg"
          bg="white"
          w="100%"
          maxW="500px"
        >
          {fortuneTellers.map((teller) => (
            <option key={teller.id} value={teller.id}>
              {teller.emoji} {teller.name} - {teller.description}
            </option>
          ))}
        </Select>
      </Box>
    </FormControl>
  )
}
