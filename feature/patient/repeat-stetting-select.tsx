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
  isError?: boolean
  disabled: boolean
  isReset: boolean
}

export function RepeatStettingSelect({
  onValueChange,
  defaultValue,
  isError,
  disabled,
  isReset,
}: Props) {
  return (
    <Select
      disabled={disabled}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
    >
      <FormControl>
        <SelectTrigger isError={isError}>
          <SelectValue />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>繰り返し設定</SelectLabel>
          {isReset && <SelectItem value="null">リセット</SelectItem>}
          <SelectItem value="1時間おき">1時間おき</SelectItem>
          <SelectItem value="2時間おき">2時間おき</SelectItem>
          <SelectItem value="3時間おき">3時間おき</SelectItem>
          <SelectItem value="4時間おき">4時間おき</SelectItem>
          <SelectItem value="毎日">毎日</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
