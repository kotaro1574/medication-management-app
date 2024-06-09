"use client"

import Link from "next/link"

import { createClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PatientsPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="mx-auto">
        <h2 className="">4/1(水)</h2>
        <Tabs defaultValue="account" className="w-[375px]">
          <TabsList>
            <TabsTrigger value="all">全て</TabsTrigger>
            <TabsTrigger value="floorA">Aフロア</TabsTrigger>
            <TabsTrigger value="floorB">Bフロア</TabsTrigger>
            <TabsTrigger value="floorC">Cフロア</TabsTrigger>
            <TabsTrigger value="floorD">Dフロア</TabsTrigger>
            <TabsTrigger value="floorE">Eフロア</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorA">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorB">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorC">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorD">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="floorE">
            Make changes to your account here.
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
