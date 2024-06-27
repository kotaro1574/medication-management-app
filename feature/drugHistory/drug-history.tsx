"use client"

import { useEffect, useState } from "react"
import { DrugHistoryItem } from "@/feature/drugHistory/drug-history-item"
import { addDays, format, startOfWeek } from "date-fns"
import { ja } from "date-fns/locale"

import { Database } from "@/types/schema.gen"
import { createClient } from "@/lib/supabase/client"
import { Icons } from "@/components/ui/icons"

export type drugHistoryWithName =
  Database["public"]["Tables"]["drug_histories"]["Row"] & {
    user_name: string
  }

type Props = {
  drugHistoriesWithNames: drugHistoryWithName[]
  id: string
}

export function DrugHistory({ drugHistoriesWithNames, id }: Props) {
  const [drugHistories, setDrugHistories] = useState(drugHistoriesWithNames)
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(
    startOfWeek(new Date(), { locale: ja })
  )

  const supabase = createClient()

  const handlePrevWeek = () => {
    setCurrentWeekStartDate(addDays(currentWeekStartDate, -7))
  }

  const handleNextWeek = () => {
    setCurrentWeekStartDate(addDays(currentWeekStartDate, 7))
  }

  useEffect(() => {
    const handleGetDrugHistories = async () => {
      const sunday = currentWeekStartDate
      sunday.setHours(0, 0, 0, 0)
      const saturday = addDays(currentWeekStartDate, 6)
      saturday.setHours(23, 59, 59, 999)

      const { data: drugHistories, error: drugError } = await supabase
        .from("drug_histories")
        .select("*")
        .eq("patent_id", id)
        .gte("created_at", sunday.toISOString())
        .lte("created_at", saturday.toISOString())

      if (drugError) {
        return console.error(drugError)
      }

      const userIds = drugHistories.map((dh) => dh.user_id)
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds)

      if (profileError) {
        return console.error(profileError)
      }

      const drugHistoriesWithNames = drugHistories.map((dh) => {
        const profile = profiles.find((p) => p.id === dh.user_id)
        return { ...dh, user_name: profile?.name ?? "" }
      })

      setDrugHistories(drugHistoriesWithNames ?? [])
    }

    handleGetDrugHistories()
  }, [currentWeekStartDate, id, supabase])

  const filterDrugHistoriesByDate = (date: Date) => {
    return drugHistories.filter((drugHistory) => {
      const historyDate = new Date(drugHistory.created_at)
      return (
        historyDate.getDate() === date.getDate() &&
        historyDate.getMonth() === date.getMonth()
      )
    })
  }

  const weekRangeStart = format(currentWeekStartDate, "M/d")
  const weekRangeEnd = format(addDays(currentWeekStartDate, 6), "M/d")

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(currentWeekStartDate, i)
    return {
      date,
      day: format(date, "d"),
      month: format(date, "M月"),
      weekday: format(date, "EEEE", { locale: ja }),
    }
  })

  return (
    <div>
      <div className="space-y-2">
        {weekDays.map((day, i) => (
          <DrugHistoryItem
            drugHistoriesWithNames={filterDrugHistoriesByDate(day.date)}
            key={i}
            day={day.day}
            month={day.month}
            weekday={day.weekday}
          />
        ))}
      </div>
      <div className="mx-auto flex items-center justify-center gap-4 px-4 pt-6">
        <button onClick={handlePrevWeek} className="text-xl">
          <Icons.chevronLeft />
        </button>
        <span>
          {weekRangeStart}〜{weekRangeEnd}
        </span>
        <button onClick={handleNextWeek} className="text-xl">
          <Icons.chevronRight />
        </button>
      </div>
    </div>
  )
}
