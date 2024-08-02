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

export function RepeatStettingSelect({
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
          <SelectLabel>繰り返しを選択</SelectLabel>
          <SelectItem value="1時間おき">1時間おき</SelectItem>
          <SelectItem value="2時間おき">2時間おき</SelectItem>
          <SelectItem value="3時間おき">3時間おき</SelectItem>
          <SelectItem value="4時間おき">4時間おき</SelectItem>
          <SelectItem value="5時間おき">5時間おき</SelectItem>
          <SelectItem value="6時間おき">6時間おき</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
