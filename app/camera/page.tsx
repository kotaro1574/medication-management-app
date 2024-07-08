"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Camera, CameraType } from "react-camera-pro"

export default function CameraPage() {
  const camera = useRef<CameraType>(null)
  const [image, setImage] = useState<string | ImageData>("")

  return (
    <div>
      <div
        className="relative rounded-[24px]"
        style={{
          height: "calc(100vh - 120px - 44px)",
          width: "100%",
          objectFit: "cover",
        }}
      >
        <Camera
          ref={camera}
          aspectRatio={1}
          errorMessages={{
            noCameraAccessible: "No camera accessible",
            permissionDenied: "Permission denied",
            switchCamera: "Switching camera is not supported",
            canvas: "Canvas is not supported",
          }}
        />
      </div>
      <button
        onClick={() => {
          if (camera.current) {
            setImage(camera.current.takePhoto())
          }
        }}
      >
        Take photo
      </button>
      {image && (
        <Image src={image as string} alt="Captured" width={100} height={100} />
      )}
    </div>
  )
}
