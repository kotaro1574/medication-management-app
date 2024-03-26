import Link from "next/link"

export default function OCRPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          OCR
        </h1>
      </div>

      <div>
        <Link href={"/ocr/chat-gtp-ocr"}>ChatGTP</Link>
      </div>
    </section>
  )
}
