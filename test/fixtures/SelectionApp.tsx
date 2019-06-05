import React, { PureComponent } from 'react'
import Selection from '../../src/Selection'
import '../../src/index.less'
import { Rect } from '../../src/utils'

interface SelectionAppProps {
  ratio?: number,
  margin?: number,
  minWidth?: number,
  minHeight?: number,
  initialCrop?: Rect | null,
}

interface SelectionAppState {
  crop: Rect | null,
}

export default class SelectionApp extends PureComponent<SelectionAppProps, SelectionAppState> {
  changeTimes = 0

  constructor(props: SelectionAppProps) {
    super(props)

    this.state = {
      crop: props.initialCrop !== undefined ? props.initialCrop : {
        x: 100,
        y: 100,
        width: 400,
        height: 200,
      },
    }
  }

  handleCropChange = (crop: Rect) => {
    this.setState({
      crop,
    })
  }

  handleCropChangeFinish = () => {
    this.changeTimes++
  }

  render() {
    const { props } = this

    return (
      <Selection
        width={600}
        height={400}
        crop={this.state.crop}
        style={{
          width: 300,
          height: 200,
        }}
        onChange={this.handleCropChange}
        onChangeFinish={this.handleCropChangeFinish}
        ratio={null}
        minWidth={50}
        margin={10}
        {...props}
      />
    )
  }
}
