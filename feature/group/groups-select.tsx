import { useEffect, useState } from "react"

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

type Group = {
  id: string
  name: string
}

type Props = {
  onValueChange: (value: string) => void
  defaultValue: string
  isError: boolean
}

export function GroupsSelect({ onValueChange, defaultValue, isError }: Props) {
  const supabase = createClient()
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    async function fetchGroups() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("facility_id")
        .eq("id", data.user.id)
        .single()

      if (!profile) {
        return
      }

      const { data: groups, error } = await supabase
        .from("groups")
        .select("id, name")
        .eq("facility_id", profile.facility_id)

      if (error) {
        console.error("Error fetching groups", error)
        return
      }

      setGroups(groups)
    }

    fetchGroups()
  }, [supabase])

  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger isError={isError}>
          <SelectValue />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>グループを選択</SelectLabel>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
