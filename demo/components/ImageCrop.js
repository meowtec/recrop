import React, { PureComponent } from 'react'
import { ImageCrop, Rect } from '../../src/'
import imageUrl from '../images/sergio-souza-1386770-unsplash.jpg'

export default class ImageCropApp extends PureComponent {
  state = {
    crop: null,
  }

  /**
   * @param {Rect} crop
   */
  handleCropChange = crop => {
    this.setState({ crop })
  }

  render() {
    return (
      <div style={{ height: 405 }}>
        <ImageCrop
          crop={this.state.crop}
          src={imageUrl}
          onChange={this.handleCropChange}
        />
      </div>
    )
  }
}
