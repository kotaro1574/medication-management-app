import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type Props = {
  onValueChange: (value: string) => void
  defaultValue: string
  isError?: boolean
}

export function GenderRadioGroup({
  isError = false,
  onValueChange,
  defaultValue,
}: Props) {
  return (
    <RadioGroup
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      className="flex items-center gap-8"
    >
      <FormItem className="flex items-center space-x-1 space-y-0">
        <FormControl>
          <RadioGroupItem
            value="male"
            className={`${
              isError &&
              "border-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive"
            }`}
          />
        </FormControl>
        <FormLabel>男性</FormLabel>
      </FormItem>
      <FormItem className="flex items-center space-x-1 space-y-0">
        <FormControl>
          <RadioGroupItem
            value="female"
            className={`${
              isError &&
              "border-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive"
            }`}
          />
        </FormControl>
        <FormLabel>女性</FormLabel>
      </FormItem>
    </RadioGroup>
  )
}
