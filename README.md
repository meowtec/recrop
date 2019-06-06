# recrop
a customizable image-crop / region-selection component for React.

## Demo
https://meowtec.github.io/recrop/

## Usage
```sh
npm i recrop --save
```

```javascript
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
          src="your_image_url"
          onChange={this.handleCropChange}
        />
      </div>
    )
  }
}
```

## Feature
- Customizable
- Write in TypeScript

For more usages see [demo](https://meowtec.github.io/recrop/)
