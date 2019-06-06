import React, { PureComponent } from 'react'
import { Rect, ImageCrop } from '../../src'
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

  render() {
    return (
      // with fixed height but scaleable
      <div style={{ height: 405, width: 'calc(100vw - 30px)', background: '#f4f4f4' }}>
        <ImageCrop
          crop={this.state.crop}
          src={imageUrl}
          onChange={this.handleCropChange}
          resizeObserve={this.resizeObserve}
        />
      </div>
    )
  }
}
