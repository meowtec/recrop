import React, { PureComponent } from 'react'
import { Rect, ImageCrop, SelectionProps } from '../../src'
import imageUrl from '../images/sergio-souza-1386770-unsplash.jpg'

export default class Responsive extends PureComponent {
  state = {
    crop: null,
  }

  /**
   * @param {Rect} crop
   */
  handleCropChange = crop => {
    this.setState({ crop })
  }

  /**
   * in most of cases we can use resize event
   * to observe the cropper container resizing
   * @param {HTMLElement} el
   * @param {() => void} callback
   */
  resizeObserve = (el, callback) => {
    window.addEventListener('resize', callback)
    return () => {
      window.removeEventListener('resize', callback)
    }
  }

  /**
   * @param {SelectionProps} props
   * @param {{cropping: boolean}} state
   */
  renderSelectionAddon = (props, state) => {
    return props.crop && (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        fontSize: 12,
      }}>
        {Math.round(props.crop.width)} x {Math.round(props.crop.height)}
      </div>
    )
  }

  render() {
    return (
      // with fixed height but scaleable
      <div style={{ height: 405, width: 'calc(100vw - 30px)', background: '#f4f4f4' }}>
        <ImageCrop
          crop={this.state.crop}
          src={imageUrl}
          onChange={this.handleCropChange}
          resizeObserve={this.resizeObserve}
          selectionAddon={this.renderSelectionAddon}
        />
      </div>
    )
  }
}
