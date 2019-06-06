import React, { PureComponent } from 'react'
import Selection, { SelectionProps, SelectionState } from './Selection'
import { Omit, fitContain, createCrop } from './utils'

export type ResizeObserve = (el: HTMLElement, callback: () => void) => () => void

export type ImageCropProps = Omit<SelectionProps, 'width' | 'height'> & {
  src: string,
  resizeObserve?: ResizeObserve,
  crossOrigin?: 'anonymous' | 'use-credentials' | '',
  onImageLoaded?(image: HTMLImageElement): void,
  onImageError?(image: HTMLImageElement): void,
}

interface ImageCropState {
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
}

export default class ImageCrop extends PureComponent<ImageCropProps, ImageCropState> {
  public static defaultProps = Selection.defaultProps

  private containerRef = React.createRef<HTMLDivElement>()

  private unResizeObserve?: () => void

  state: ImageCropState = {
    imageWidth: 0,
    imageHeight: 0,
    containerWidth: 0,
    containerHeight: 0,
  }

  handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const {
      onChange,
      onImageLoaded,
      ratio,
      minWidth,
      minHeight,
      margin,
    } = this.props

    const image = e.currentTarget
    const container = this.containerRef.current!
    const imageWidth = image.naturalWidth
    const imageHeight = image.naturalHeight

    this.setState({
      imageWidth,
      imageHeight,
      containerWidth: container.clientWidth,
      containerHeight: container.clientHeight,
    })

    onChange(createCrop({
      imageWidth,
      imageHeight,
      ratio,
      minWidth,
      minHeight,
      maxWidth: imageWidth - margin * 2,
      maxHeight: imageHeight - margin * 2,
    }))

    onImageLoaded && onImageLoaded(image)
  }

  componentDidMount() {
    const { resizeObserve } = this.props
    const container = this.containerRef.current!

    if (resizeObserve) {
      this.unResizeObserve = resizeObserve(container, () => {
        this.setState({
          containerWidth: container.clientWidth,
          containerHeight: container.clientHeight,
        })
      })
    }
  }

  componentWillUnmount() {
    const { unResizeObserve } = this
    unResizeObserve && unResizeObserve()
  }

  render() {
    const {
      src,
      onImageLoaded,
      className,
      style,
      crossOrigin,
      ...rest
    } = this.props

    const {
      imageWidth,
      imageHeight,
      containerWidth,
      containerHeight,
    } = this.state

    const containStyle = fitContain({
      srcWidth: imageWidth,
      srcHeight: imageHeight,
      destWidth: containerWidth,
      destHeight: containerHeight,
    })

    return (
      <div
        ref={this.containerRef}
        className={`re-crop__cropper ${className || ''}`}
      >
        <img
          key={src}
          src={src}
          crossOrigin={crossOrigin}
          onLoad={this.handleImageLoad}
          style={containStyle}
        />

        {
          imageWidth ? (
            <Selection
              width={imageWidth}
              height={imageHeight}
              style={{
                ...style,
                ...containStyle,
              }}
              {...rest}
            />
          ) : null
        }
      </div>
    )
  }
}
