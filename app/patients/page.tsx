"use client"

import { formatDate } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const today = new Date()

export default function PatientsPage() {
  return (
    <section className="min-h-screen bg-[#F5F5F5] pt-[52px]">
      <div className="mx-auto">
        <h2 className="bg-white pb-[46px] text-center text-[20px]">
          {formatDate(today, "yyyy/MM/dd")}
        </h2>
        <Tabs defaultValue="all" className="">
          <TabsList className="space-x-2 overflow-x-scroll rounded-b-lg bg-white px-4 shadow-shadow">
            <TabsTrigger value="all">全て</TabsTrigger>
            <TabsTrigger value="floorA">
              <p className="line-clamp-1">Aフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorB">
              <p className="line-clamp-1">Bフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorC">
              <p className="line-clamp-1">Cフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorD">
              <p className="line-clamp-1">Dフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorE">
              <p className="line-clamp-1">Eフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorF">
              <p className="line-clamp-1">Fフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorG">
              <p className="line-clamp-1">Gフロア</p>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorA" className="px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorB" className="px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorC" className="px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorD" className="px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorE" className="px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorF" className="px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorG" className="px-4 py-8">
            Make changes to your account here.
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
