"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PatientsPage() {
  return (
    <section className="pt-[52px]">
      <div className="mx-auto">
        <h2 className="mb-[46px] text-center text-[20px]">4/1(水)</h2>
        <Tabs defaultValue="all" className="">
          <TabsList className="space-x-2 overflow-x-scroll rounded-b-lg px-4 shadow-shadow">
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
          <TabsContent value="all" className="bg-[#F5F5F5] px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorA" className="bg-[#F5F5F5] px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorB" className="bg-[#F5F5F5] px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorC" className="bg-[#F5F5F5] px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorD" className="bg-[#F5F5F5] px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorE" className="bg-[#F5F5F5] px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorF" className="bg-[#F5F5F5] px-4 py-8">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorG" className="bg-[#F5F5F5] px-4 py-8">
            Make changes to your account here.
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
