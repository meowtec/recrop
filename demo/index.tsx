import React from 'react'
import { render } from 'react-dom'
import ImageCropApp from './components/ImageCrop'
import VideoCropApp from './components/VideoCrop'
import '../src/index.less'
import './index.less'

function App() {
  return (
    <div>
      <h2 className="title">ReCrop</h2>
      <div className="container">
        <h3 className="section-title">Basic</h3>
        <ImageCropApp />
        <h3 className="section-title">Crop video</h3>
        <VideoCropApp />
      </div>
    </div>
  )
}

render(<App />, document.getElementById('app'))
