import type Konva from 'konva';

export const getRelativePointerPosition = (stage: Konva.Stage) => {
  const transform = stage.getAbsoluteTransform().copy();
  transform.invert();

  const pos = stage.getPointerPosition();
  if (!pos) return null;

  return transform.point(pos);
};
