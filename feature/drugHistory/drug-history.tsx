"use client"

import { useState } from "react"
import { DrugHistoryItem } from "@/feature/drugHistory/drug-history-item"
import { addDays, format, startOfWeek, subMonths } from "date-fns"
import { ja } from "date-fns/locale"

import { Database } from "@/types/schema.gen"
import { Icons } from "@/components/ui/icons"

export type drugHistoryWithName =
  Database["public"]["Tables"]["drug_histories"]["Row"] & {
    user_name: string
  }

type Props = {
  drugHistoriesWithNames: drugHistoryWithName[]
}

export function DrugHistory({ drugHistoriesWithNames }: Props) {
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(
    startOfWeek(new Date(), { locale: ja })
  )

  const today = new Date()
  const threeMonthsAgo = startOfWeek(subMonths(new Date(), 3), { locale: ja })

  const handlePrevWeek = () => {
    setCurrentWeekStartDate(addDays(currentWeekStartDate, -7))
  }

  const handleNextWeek = () => {
    setCurrentWeekStartDate(addDays(currentWeekStartDate, 7))
  }

  const filterDrugHistoriesByDate = (date: Date) => {
    return drugHistoriesWithNames.filter((drugHistory) => {
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
        {currentWeekStartDate > threeMonthsAgo ? (
          <button onClick={handlePrevWeek} className="text-xl">
            <Icons.chevronLeft />
          </button>
        ) : (
          <div className="size-[30px]" />
        )}
        <div className="w-full max-w-28 text-center">
          {weekRangeStart}〜{weekRangeEnd}
        </div>
        {addDays(currentWeekStartDate, 7) <= today ? (
          <button onClick={handleNextWeek} className="text-xl">
            <Icons.chevronRight />
          </button>
        ) : (
          <div className="size-[30px]" />
        )}
      </div>
    </div>
  )
}
