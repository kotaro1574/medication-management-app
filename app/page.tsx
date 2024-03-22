import Link from "next/link"

export default async function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div>
        <Link href="/recognition">Recognition</Link>
      </div>
      <div>
        <Link href="/ocr">OCR</Link>
      </div>
    </section>
  )
}
