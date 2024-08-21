import { RefObject } from "react"
import { CameraType, Camera as ReactCameraPro } from "react-camera-pro"
import { FacingMode } from "react-camera-pro/dist/components/Camera/types"

type Props = {
  cameraRef: RefObject<CameraType>
  facingMode?: FacingMode
}

export default function Camera({
  cameraRef,
  facingMode = "environment",
}: Props) {
  return (
    <div className="relative size-full overflow-hidden rounded-[24px]">
      <ReactCameraPro
        ref={cameraRef}
        facingMode={facingMode}
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
