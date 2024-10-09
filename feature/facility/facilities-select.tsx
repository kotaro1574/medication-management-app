import { useEffect, useState } from "react"

import { Database } from "@/types/schema.gen"
import { createClient } from "@/lib/supabase/client"
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

type Facility = Pick<
  Database["public"]["Tables"]["facilities"]["Row"],
  "id" | "name_jp"
>

type Props = {
  onValueChange: (value: string) => void
  defaultValue: string
  isError: boolean
  disabled?: boolean
}

export function FacilitiesSelect({
  onValueChange,
  defaultValue,
  isError,
  disabled = false,
}: Props) {
  const supabase = createClient()
  const [facilities, setFacilities] = useState<Facility[]>([])

  useEffect(() => {
    async function fetchFacilities() {
      const { data, error } = await supabase
        .from("facilities")
        .select("id, name_jp")
      if (error) {
        console.error("Error fetching facilities", error)
        return
      }

      setFacilities(data)
    }

    fetchFacilities()
  }, [supabase])

  return (
    <Select
      onValueChange={onValueChange}
      disabled={disabled}
      defaultValue={defaultValue}
    >
      <FormControl>
        <SelectTrigger isError={isError}>
          <SelectValue />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>施設を選択</SelectLabel>
          {facilities.map((facility) => (
            <SelectItem key={facility.id} value={facility.id}>
              {facility.name_jp}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
