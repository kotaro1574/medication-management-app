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

export function CareLevelSelect({
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
          <SelectLabel>介護度を選択</SelectLabel>
          <SelectItem value="independence">自立</SelectItem>
          <SelectItem value="needs_support_1">要支援1</SelectItem>
          <SelectItem value="needs_support_2">要支援2</SelectItem>
          <SelectItem value="needs_nursing_care_1">要介護1</SelectItem>
          <SelectItem value="needs_nursing_care_2">要介護2</SelectItem>
          <SelectItem value="needs_nursing_care_3">要介護3</SelectItem>
          <SelectItem value="needs_nursing_care_4">要介護4</SelectItem>
          <SelectItem value="needs_nursing_care_5">要介護5</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
