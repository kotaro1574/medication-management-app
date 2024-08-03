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

export function MinuteSelect({ onValueChange, defaultValue, isError }: Props) {
  // 分のリストを生成
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString())

  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger isError={isError}>
          <SelectValue />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>分を選択</SelectLabel>
          {minutes.map((minute) => (
            <SelectItem key={minute} value={minute}>
              {minute}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
