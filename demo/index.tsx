import React from 'react'
import { render } from 'react-dom'
import ImageCropApp from './components/ImageCrop'
import VideoCropApp from './components/VideoCrop'
import '../src/index.less'
import './index.less'
import Responsive from './components/Responsive'
import MultipleSelectionApp from './components/MultipleSelection'

function App() {
  return (
    <div>
      <h2 className="title">ReCrop</h2>
      <div className="container">
        <h3 className="section-title">
          <div>Basic</div>
          <div><a target="_blank" href="https://github.com/meowtec/recrop/blob/master/demo/components/ImageCrop.js">source code</a></div>
        </h3>
        <ImageCropApp />
        <h3 className="section-title">
          <div>Crop video</div>
          <div><a target="_blank" href="https://github.com/meowtec/recrop/blob/master/demo/components/VideoCrop.js">source code</a></div>
        </h3>
        <VideoCropApp />
        <h3 className="section-title">
          <div>Responsive + selectionAddon + fixed ratio</div>
          <div><a target="_blank" href="https://github.com/meowtec/recrop/blob/master/demo/components/Responsive.js">source code</a></div>
        </h3>
        <Responsive />
        <h3 className="section-title">
          <div>Multiple selection</div>
          <div><a target="_blank" href="https://github.com/meowtec/recrop/blob/master/demo/components/MultipleSelection.js">source code</a></div>
        </h3>
        <MultipleSelectionApp />
      </div>
    </div>
  )
}

render(<App />, document.getElementById('app'))
