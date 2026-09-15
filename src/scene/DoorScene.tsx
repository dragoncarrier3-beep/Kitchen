import { useMemo } from 'react'
import { DoorAssembly } from './DoorAssembly'
import { Architecture } from './Architecture'
import { LightingRig } from './LightingRig'
import { CameraRig } from './CameraRig'
import { selectActiveMaterialId, useConfiguratorStore } from '../store/configuratorStore'
import { MATERIALS, FRAME_FINISHES, HANDLES } from '../data/seed'

export function DoorScene() {
  const widthMm = useConfiguratorStore((s) => s.widthMm)
  const heightMm = useConfiguratorStore((s) => s.heightMm)
  const doorOpen = useConfiguratorStore((s) => s.doorOpen)
  const lighting = useConfiguratorStore((s) => s.lighting)
  const cameraPreset = useConfiguratorStore((s) => s.cameraPreset)
  const cameraNonce = useConfiguratorStore((s) => s.cameraNonce)
  const materialId = useConfiguratorStore(selectActiveMaterialId)
  const frameId = useConfiguratorStore((s) => s.frameId)
  const handleId = useConfiguratorStore((s) => s.handleId)
  const materials = useConfiguratorStore((s) => s.materials)
  const frames = useConfiguratorStore((s) => s.frames)
  const handles = useConfiguratorStore((s) => s.handles)

  const doorFinish = useMemo(
    () => materials.find((item) => item.id === materialId) ?? MATERIALS[0],
    [materials, materialId],
  )
  const frameFinish = useMemo(
    () => frames.find((item) => item.id === frameId) ?? FRAME_FINISHES[0],
    [frames, frameId],
  )
  const handle = useMemo(
    () => handles.find((item) => item.id === handleId) ?? HANDLES[0],
    [handles, handleId],
  )

  const handleX = widthMm / 1000 / 2 - 0.08

  return (
    <>
      <LightingRig mode={lighting} />
      <Architecture
        openingWidth={widthMm / 1000}
        openingHeight={heightMm / 1000}
        night={lighting === 'night'}
      />
      <DoorAssembly
        widthMm={widthMm}
        heightMm={heightMm}
        open={doorOpen}
        doorFinish={doorFinish}
        frameFinish={frameFinish}
        handle={handle}
      />
      <CameraRig preset={cameraPreset} nonce={cameraNonce} handleX={handleX} />
    </>
  )
}
