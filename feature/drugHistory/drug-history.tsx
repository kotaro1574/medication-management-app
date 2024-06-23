"use client"

import { useState } from "react"
import { DrugHistoryItem } from "@/feature/drugHistory/drug-history-item"
import { addDays, format, startOfWeek } from "date-fns"
import { ja } from "date-fns/locale"

export function DrugHistory() {
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(
    startOfWeek(new Date(), { locale: ja })
  )

  const handlePrevWeek = () => {
    setCurrentWeekStartDate(addDays(currentWeekStartDate, -7))
  }

  const handleNextWeek = () => {
    setCurrentWeekStartDate(addDays(currentWeekStartDate, 7))
  }

  const weekRangeStart = format(currentWeekStartDate, "M/d")
  const weekRangeEnd = format(addDays(currentWeekStartDate, 6), "M/d")

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(currentWeekStartDate, i)
    return {
      day: format(date, "d"),
      month: format(date, "M月"),
      weekday: format(date, "EEEE", { locale: ja }),
    }
  })

  return (
    <div>
      <div className="space-y-2 px-4 py-8">
        {weekDays.map((day, i) => (
          <DrugHistoryItem
            key={i}
            day={day.day}
            month={day.month}
            weekday={day.weekday}
          />
        ))}
      </div>
      <div className="flex justify-between px-4 py-8">
        <button onClick={handlePrevWeek} className="text-xl">
          &lt;
        </button>
        <span>
          {weekRangeStart}〜{weekRangeEnd}
        </span>
        <button onClick={handleNextWeek} className="text-xl">
          &gt;
        </button>
      </div>
    </div>
  )
}
