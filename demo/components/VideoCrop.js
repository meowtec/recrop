import React, { PureComponent } from 'react'
import { Selection, Rect } from '../../src/'

export default class VideoCropApp extends PureComponent {
  state = {
    /** @type {Rect | null} */
    crop: null,
    /** @type {{ width: number; height: number} | null} */
    videoSize: null,
    /** @type {{ width: number; height: number} | null} */
    videoDisplaySize: null,
  }

  videoRef = React.createRef()

  /**
   * @param {Rect} crop
   */
  handleCropChange = crop => {
    this.setState({ crop })
  }

  handleVideoCanPlay = () => {
    const video = this.videoRef.current
    const { videoWidth, videoHeight } = video

    this.setState({
      videoSize: {
        width: videoWidth,
        height: videoHeight,
      },
      videoDisplaySize: {
        width: video.clientWidth,
        height: video.clientHeight,
      },
      crop: {
        x: videoWidth / 4,
        y: videoHeight / 4,
        width: videoWidth / 2,
        height: videoHeight / 2,
      },
    })
  }

  render() {
    const { crop, videoSize, videoDisplaySize } = this.state

    return (
      <div style={{ position: 'relative' }}>
        <video
          ref={this.videoRef}
          style={{ width: '100%' }}
          controls
          onCanPlay={this.handleVideoCanPlay}
          src="http://idst-video-img.oss-cn-hangzhou.aliyuncs.com/video/20190218/mb5e0dcde-1f5d-53ce-bddd-792e915e0bf2.mp4"
        />
        {
          videoSize && videoDisplaySize ? (
            <Selection
              width={videoSize.width}
              height={videoSize.height}
              style={{
                position: 'absolute',
                // make the native video controls available
                pointerEvents: 'none',
                top: 0,
                left: 0,
                width: videoDisplaySize.width,
                height: videoDisplaySize.height,
              }}
              crop={crop}
              onChange={this.handleCropChange}
            />
          ) : null
        }
      </div>
    )
  }
}
