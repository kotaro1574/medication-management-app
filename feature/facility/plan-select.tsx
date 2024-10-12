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

export function PlanSelect({ onValueChange, defaultValue, isError }: Props) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger isError={isError}>
          <SelectValue />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>プランを選択</SelectLabel>
          <SelectItem value="プラン１">プラン１</SelectItem>
          <SelectItem value="プラン２">プラン２</SelectItem>
          <SelectItem value="プラン３">プラン３</SelectItem>
          <SelectItem value="プラン４">プラン４</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
