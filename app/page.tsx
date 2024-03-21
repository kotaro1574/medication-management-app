import { FaceRecognition } from "./face-recognition"

export default async function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          recognition
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          This is a demo of facial recognition using AWS Rekognition. You can
          test it by clicking the Recognize button below.
        </p>
      </div>

      <div>
        <FaceRecognition />
      </div>
    </section>
  )
}
