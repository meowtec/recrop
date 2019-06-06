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
   * in most of cases we can use resize event to observe the cropper container resizing
   * if no help, see `resizeObserve2`
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
   * the ultimate solution but with poor browser compatibility.
   * may have a look at https://github.com/que-etc/resize-observer-polyfill
   * @param {HTMLElement} el
   * @param {() => void} callback
   */
  resizeObserve2 = (el, callback) => {
    // @ts-ignore
    const resizeObserver = new ResizeObserver(callback)
    resizeObserver.observe(el)
    return () => resizeObserver.disconnect()
  }

  /**
   * @param {Rect} crop
   */
  renderSelectionAddon = crop => {
    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        fontSize: 12,
      }}>
        {Math.round(crop.width)} x {Math.round(crop.height)}
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
          ratio={2}
          minWidth={300}
          onChange={this.handleCropChange}
          resizeObserve={this.resizeObserve}
          selectionAddon={this.renderSelectionAddon}
        />
      </div>
    )
  }
}
