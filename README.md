# recrop
a customizable image-crop / region-selection component for React.

## demo
https://meowtec.github.io/recrop/

## Usage
```
npm i recrop --save
```

```
import { ImageCrop } from 'recrop'

class ImageCropApp extends PureComponent {
  state = {
    crop: null,
  }

  handleCropChange = (crop) => {
    this.setState({ crop })
  }

  render() {
    return (
      <div style={{ height: 400, width: 600 }}>
        <ImageCrop
          crop={this.state.crop}
          src=""
          onChange={this.handleCropChange}
        />
      </div>
    )
  }
}
```

For more usages see [demo](https://meowtec.github.io/recrop/)
