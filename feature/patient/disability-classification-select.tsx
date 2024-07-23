import { FormControl } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  onValueChange: (value: string) => void
  defaultValue: string
  isError: boolean
}

export function DisabilityClassificationSelect({
  onValueChange,
  defaultValue,
  isError,
}: Props) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger isError={isError}>
          <SelectValue />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>障害区分を選択</SelectLabel>
          <SelectItem value="independence">自立</SelectItem>
          <SelectItem value="disability_level_1">障害区分1</SelectItem>
          <SelectItem value="disability_level_2">障害区分2</SelectItem>
          <SelectItem value="disability_level_3">障害区分3</SelectItem>
          <SelectItem value="disability_level_4">障害区分4</SelectItem>
          <SelectItem value="disability_level_5">障害区分5</SelectItem>
          <SelectItem value="disability_level_6">障害区分6</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
