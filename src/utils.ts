const doc = document

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export interface Rect {
  x: number,
  y: number,
  width: number,
  height: number,
}

export const nullOr = <T>(
  a: T | null | undefined,
  b: T,
) => a == null ? b : a

export const sign = (x: number) => x < 0 ? -1 : 1

export const pct = (num: number) => num * 100 + '%'

export const includes = (str: string, substr: string) => str.indexOf(substr) !== -1

export const clamp = (n: number, min: number, max: number) => n < min ? min : n > max ? max : n

export const fitContain = ({
  srcWidth,
  srcHeight,
  destWidth,
  destHeight,
}: {
  srcWidth: number,
  srcHeight: number,
  destWidth: number,
  destHeight: number,
}) => {
  const ratio = srcWidth / srcHeight
  let width = destWidth
  const height = clamp(width / ratio, 0, destHeight) || 0
  width = height * ratio || 0

  return {
    width,
    height,
    left: (destWidth - width) / 2,
    top: (destHeight - height) / 2,
  }
}

export const createCrop = (config: {
  imageWidth: number,
  imageHeight: number,
  ratio?: null | number,
  minWidth?: null | number,
  minHeight?: null | number,
  maxWidth?: null | number,
  maxHeight?: null | number,
}): Rect => {
  const minWidth = config.minWidth || 0
  const minHeight = nullOr(config.minHeight, minWidth)
  const maxWidth = config.maxWidth || config.imageWidth
  const maxHeight = config.maxHeight || config.imageHeight

  let width
  let height

  if (config.ratio) {
    const _minHeight = Math.max(minWidth / config.ratio, minHeight)
    const _maxHeight = Math.min(maxWidth / config.ratio, maxHeight)
    height = (_minHeight + _maxHeight) / 2
    width = height * config.ratio
    if (width > maxWidth) {
      width = maxWidth
      height = width / config.ratio
    }
  } else {
    width = (minWidth + maxWidth) / 2
    height = (minHeight + maxHeight) / 2
  }

  return {
    x: (config.imageWidth - width) / 2,
    y: (config.imageHeight - height) / 2,
    width,
    height,
  }
}

/**
 * Simple `classnames` helper only for object
 */
export const classnames = (dict: Record<string, boolean>) =>
  Object.keys(dict).reduce((prev, curr) => dict[curr] ? (prev + ' ' + curr) : prev, '')

interface MouseMoveEventListeners {
  onMouseMove: (e: MouseEvent) => void,
  onMouseUp?: (e: MouseEvent, hasMoved: boolean) => void,
}

export const addMouseMove = ({ onMouseMove, onMouseUp }: MouseMoveEventListeners) => {
  let hasMoved = false
  const onMouseMoveListener = (e: MouseEvent) => {
    onMouseMove(e)
    hasMoved = true
  }

  const onMouseUpListener = (e: MouseEvent) => {
    if (onMouseUp) onMouseUp(e, hasMoved)
    doc.removeEventListener('mousemove', onMouseMoveListener, false)
    doc.removeEventListener('mouseup', onMouseUpListener, false)
  }

  doc.addEventListener('mousemove', onMouseMoveListener, false)
  doc.addEventListener('mouseup', onMouseUpListener, false)
}
