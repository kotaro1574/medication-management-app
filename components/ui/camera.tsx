import { RefObject } from "react"
import { CameraType, Camera as ReactCameraPro } from "react-camera-pro"

type Props = {
  cameraRef: RefObject<CameraType>
}

export default function Camera({ cameraRef }: Props) {
  return (
    <div className="relative size-full overflow-hidden rounded-[24px]">
      <ReactCameraPro
        ref={cameraRef}
        facingMode="environment"
        aspectRatio="cover"
        errorMessages={{
          noCameraAccessible: "カメラが利用できません",
          permissionDenied: "カメラの使用が許可されていません",
          switchCamera: "カメラの切り替えはサポートされていません",
          canvas: "Canvas がサポートされていません",
        }}
      />
    </div>
  )
}
