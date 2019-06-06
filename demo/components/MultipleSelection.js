import React, { PureComponent } from 'react'
import { MultipleSelection, Rect } from '../../src/'
import imageUrl from '../images/massimiliano-morosinotto-1565743-unsplash.jpg'

export default class MultipleSelectionApp extends PureComponent {
  state = {
    crops: [],
  }

  /**
   * @param {Rect[]} crops
   */
  handleCropChange =crops => {
    this.setState({ crops })
  }

  render() {
    return (
      <div style={{ height: 405, position: 'relative' }}>
        <img
          src={imageUrl}
          width={720}
        />
        <MultipleSelection
          maxCount={5}
          crops={this.state.crops}
          onChange={this.handleCropChange}
          width={1600} // image.naturalWidth
          height={900} // image.naturalHeight
          minWidth={50}
        />
      </div>
    )
  }
}
