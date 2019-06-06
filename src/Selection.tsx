import React, { CSSProperties, Component } from 'react'
import {
  addMouseMove,
  includes,
  clamp,
  sign,
  pct,
  classnames,
  Rect,
} from './utils'

const { abs, min, max } = Math

interface Bound {
  n: number,
  w: number,
  s: number,
  e: number,
}

type BaseOrd = 'n' | 's' | 'e' | 'w'
type DragOrd = BaseOrd | 'nw' | 'ne' | 'se' | 'sw'

const allDragOrds: DragOrd[] = ['n', 's', 'e', 'w', 'nw', 'ne', 'se', 'sw']

const getCursor = (ord: DragOrd) => {
  switch (ord) {
    case 'n':
    case 's':
      return 'ns'
    case 'e':
    case 'w':
      return 'ew'
    case 'nw':
    case 'se':
      return 'nwse'
    case 'ne':
    case 'sw':
      return 'nesw'
    default:
      return ''
  }
}

const ordOppos: Record<BaseOrd, BaseOrd> = {
  n: 's',
  s: 'n',
  w: 'e',
  e: 'w',
}

const isLowerOrd = (ord: BaseOrd) => ord === 'n' || ord === 'w'
const getOppoOrd = (ord: BaseOrd): BaseOrd => ordOppos[ord]
const getLowerOrd = (ord: BaseOrd) => isLowerOrd(ord) ? ord : getOppoOrd(ord)

export interface SelectionProps {
  crop?: Rect | null,
  width: number,
  height: number,
  className?: string | null,
  style?: CSSProperties | null,
  ratio?: number | null,
  minWidth?: number,
  minHeight?: number,
  hasMask: boolean,
  transparent: boolean,
  disabled: boolean,
  locked: boolean,
  margin: number,
  selectionAddon?:
  | React.ReactNode
  | ((props: SelectionProps, state: SelectionState) => React.ReactNode),
  onChange(crop: Rect): void,
  onChangeFinish?(): void,
}

export interface SelectionState {
  dragging: DragOrd | null,
}

export default class Selection extends Component<SelectionProps> {
  public static defaultProps = {
    margin: 0,
    hasMask: true,
    transparent: false,
    locked: false,
    disabled: false,
  }

  state: SelectionState = {
    dragging: null,
  }

  refCrop = React.createRef<HTMLDivElement>()

  fixBound(bound: Bound, activeOrd: DragOrd): Bound | null {
    const {
      ratio,
      width: stageWidth,
      height: stageHeight,
      margin,
    } = this.props

    let {
      minWidth,
      minHeight,
    } = this.props

    // clamp max
    bound = {
      n: clamp(bound.n, margin, stageHeight - margin),
      w: clamp(bound.w, margin, stageWidth - margin),
      s: clamp(bound.s, margin, stageHeight - margin),
      e: clamp(bound.e, margin, stageWidth - margin),
    }

    const baseOrds = activeOrd.split('') as [ BaseOrd, BaseOrd ]
    let width = bound.e - bound.w
    let height = bound.s - bound.n

    // min width / height
    if (minWidth || minHeight) {
      minWidth = minWidth || minHeight! * (ratio || 1)
      minHeight = minHeight || minWidth! / (ratio || 1)

      width = max(abs(width), minWidth) * sign(width)
      height = max(abs(height), minHeight) * sign(height)
    }

    // fix ratio
    if (ratio) {
      width = sign(width) * clamp(abs(width), 0, abs(height) * ratio)
      height = sign(height) * clamp(abs(height), 0, abs(width) / ratio)
    }

    let isOver = false

    baseOrds.forEach(ord => {
      const isLgt = getLowerOrd(ord) === 'w'
      const len = isLgt ? width : height

      const val = bound[ord] = isLowerOrd(ord)
        ? bound[getOppoOrd(ord)] - len
        : bound[getOppoOrd(ord)] + len

      if (
        (isLgt && (val < margin || val > stageWidth - margin)) ||
        (!isLgt && (val < margin || val > stageHeight - margin))
      ) isOver = true
    })

    if (isOver) return null

    return bound
  }

  handleChangeFinish = () => {
    const { onChangeFinish } = this.props
    this.setState({
      dragging: null,
    })
    onChangeFinish && onChangeFinish()
  }

  handleCornerMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const {
      crop,
      width,
      height,
      onChange,
    } = this.props
    const target = e.target as HTMLElement
    const ord = target.dataset.ord as DragOrd | undefined

    if (!ord || !crop) return

    const { clientX, clientY } = e
    const dirs = ord.split('') as BaseOrd[]

    this.setState({
      dragging: ord,
    })

    e.preventDefault()
    e.stopPropagation()

    addMouseMove({
      onMouseMove: ev => {
        const { clientWidth, clientHeight } = this.refCrop.current!
        const deltaX = (ev.clientX - clientX) * width / clientWidth
        const deltaY = (ev.clientY - clientY) * height / clientHeight

        const bound: Bound = {
          n: crop.y,
          w: crop.x,
          s: crop.y + crop.height,
          e: crop.x + crop.width,
        }

        dirs.forEach(dir => {
          bound[dir] += includes('ns', dir) ? deltaY : deltaX
        })

        const fixedBound = this.fixBound(bound, ord)

        fixedBound && onChange({
          x: min(fixedBound.w, fixedBound.e),
          y: min(fixedBound.n, fixedBound.s),
          width: abs(fixedBound.e - fixedBound.w),
          height: abs(fixedBound.s - fixedBound.n),
        })
      },

      onMouseUp: this.handleChangeFinish,
    })
  }

  handleBlankMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const {
      onChange,
      crop,
      margin,
      width,
      height,
    } = this.props
    const { clientX, clientY } = e

    if (!crop) return

    e.preventDefault()
    e.stopPropagation()

    addMouseMove({
      onMouseMove: ev => {
        const { clientWidth, clientHeight } = this.refCrop.current!
        const deltaX = (ev.clientX - clientX) * width / clientWidth
        const deltaY = (ev.clientY - clientY) * height / clientHeight

        onChange({
          x: clamp(crop.x + deltaX, margin, width - margin - crop.width),
          y: clamp(crop.y + deltaY, margin, height - margin - crop.height),
          width: crop.width,
          height: crop.height,
        })
      },

      onMouseUp: this.handleChangeFinish,
    })
  }

  handleCrossMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const { width, height, onChange } = this.props

    const clientRect = this.refCrop.current!.getBoundingClientRect()
    const x = (e.clientX - clientRect.left) / clientRect.width * width
    const y = (e.clientY - clientRect.top) / clientRect.height * height

    addMouseMove({
      onMouseMove: ev => {
        const destX = (ev.clientX - clientRect.left) / clientRect.width * width
        const destY = (ev.clientY - clientRect.top) / clientRect.height * height

        const fixedBound = this.fixBound({
          n: y,
          s: destY,
          w: x,
          e: destX,
        }, 'se')

        fixedBound && onChange({
          x: min(fixedBound.w, fixedBound.e),
          y: min(fixedBound.n, fixedBound.s),
          width: abs(fixedBound.e - fixedBound.w),
          height: abs(fixedBound.s - fixedBound.n),
        })
      },

      onMouseUp: this.handleChangeFinish,
    })
  }

  renderSelection() {
    const {
      crop,
      ratio,
      width,
      height,
      transparent,
      selectionAddon,
    } = this.props

    if (!crop) return null

    return (
      <div
        onMouseDown={this.handleCornerMouseDown}
        className="re-crop__selection"
        style={{
          left: pct(crop.x / width),
          top: pct(crop.y / height),
          width: pct(crop.width / width),
          height: pct(crop.height / height),
        }}
      >
        {
          transparent || (
            <div
              className="re-crop__blank"
              onMouseDown={this.handleBlankMouseDown}
            />
          )
        }
        <div className="re-crop__handlers">
          {
            allDragOrds.map(ord => {
              if (ratio && ord.length === 1) return null

              return (
                <div
                  className="re-crop__drag-handle"
                  data-ord={ord}
                  key={ord}
                  style={{
                    cursor: getCursor(ord) + '-resize',
                  }}
                />
              )
            })
          }
        </div>
        {selectionAddon}
      </div>
    )
  }

  renderMask() {
    const {
      width,
      height,
    } = this.props
    const crop = this.props.crop || { x: 0, y: 0, width: 0, height: 0 }

    return (
      <div
        className="re-crop__mask"
      >
        <div style={{
          bottom: pct(1 - crop.y / height),
        }} />
        <div style={{
          top: pct((crop.y + crop.height) / height),
        }} />
        <div style={{
          right: pct(1 - crop.x / width),
        }} />
        <div style={{
          left: pct((crop.x + crop.width) / width),
        }} />
      </div>
    )
  }

  render() {
    const {
      transparent,
      hasMask,
      disabled,
      locked,
      className,
      style,
    } = this.props
    const { dragging } = this.state
    const noResizing = locked || disabled

    const cropStyle: React.CSSProperties = { ...style }
    if (!noResizing && dragging) {
      cropStyle.cursor = getCursor(dragging) + '-resize'
    }

    return (
      <div
        ref={this.refCrop}
        className={classnames({
          're-crop': true,
          [className || '']: true,
          're-crop__locked': locked,
          're-crop__disabled': disabled,
        })}
        style={cropStyle}
        onMouseDown={noResizing ? undefined : this.handleCrossMouseDown}
      >
        {!transparent && hasMask && this.renderMask()}
        {this.renderSelection()}
      </div>
    )
  }
}
