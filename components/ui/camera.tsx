import { RefObject } from "react"
import { CameraType, Camera as ReactCameraPro } from "react-camera-pro"
import { FacingMode } from "react-camera-pro/dist/components/Camera/types"

type Props = {
  facingMode: FacingMode
  cameraRef: RefObject<CameraType>
}

export default function Camera({ facingMode, cameraRef }: Props) {
  return (
    <div
      className="relative overflow-hidden rounded-[24px]"
      style={{
        height: "calc(100vh - 300px)",
        width: "100%",
      }}
    >
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
