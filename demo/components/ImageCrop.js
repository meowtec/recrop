import React, { PureComponent } from 'react'
import ImageCrop from '../../src/ImageCrop'
import imageUrl from '../images/sergio-souza-1386770-unsplash.jpg'

export default class ImageCropApp extends PureComponent {
  state = {
    crop: null,
  }

  handleCropChange = crop => {
    this.setState({ crop })
  }

  render() {
    return (
      <div>
        <div style={{ height: 405 }}>
          <ImageCrop
            crop={this.state.crop}
            src={imageUrl}
            onChange={this.handleCropChange}
          />
        </div>
      </div>
    )
  }
}
