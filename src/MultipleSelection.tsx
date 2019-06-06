import React, { PureComponent } from 'react'
import Selection, { SelectionProps } from './Selection'
import { Omit, Rect } from './utils'

export type MultipleSelectionProps = Omit<SelectionProps, 'crop' | 'hasMask' | 'onChange'> & {
  crops: Rect[],
  maxCount?: number | null,
  onChange(crops: Rect[], crop: Rect): void,
}

export interface MultipleSelectionState {
  borning: boolean,
}

const defaultProps = {
  ...Selection.defaultProps,
}

delete defaultProps.hasMask

export default class MultipleSelection extends PureComponent<MultipleSelectionProps, MultipleSelectionState> {
  public static defaultProps = defaultProps

  state: MultipleSelectionState = {
    borning: false,
  }

  handleChange(crop: Rect, index: number) {
    const { crops, onChange } = this.props
    const { borning } = this.state
    let newCrops: Rect[]

    if (index > -1) {
      newCrops = [
        ...crops.slice(0, index),
        crop,
        ...crops.slice(index + 1),
      ]
    } else {
      if (borning) {
        newCrops = [
          ...crops.slice(0, crops.length - 1),
          crop,
        ]
      } else {
        newCrops = [
          ...crops,
          crop,
        ]

        this.setState({
          borning: true,
        })
      }
    }

    onChange(newCrops, crop)
  }

  handleChangeFinish = () => {
    this.setState({
      borning: false,
    })
  }

  handleDel = (index: number) => {
    const { crops, onChange, onChangeFinish } = this.props

    onChange([
      ...crops.slice(0, index),
      ...crops.slice(index + 1),
    ], crops[index])

    onChangeFinish && onChangeFinish()
  }

  render() {
    const { borning } = this.state
    const { disabled, maxCount, onChange, crops, className, ...rest } = this.props

    return (
      <div className={`re-crop__multiple ${className || ''}`}>
        <Selection
          crop={borning ? crops[crops.length - 1] : null}
          disabled={disabled || !!(maxCount && !borning && crops.length >= maxCount)}
          hasMask={false}
          onChange={crop => this.handleChange(crop, -1)}
          onChangeFinish={this.handleChangeFinish}
          {...rest}
        />
        {
          crops.slice(0, crops.length - (borning ? 1 : 0)).map((crop, i) => {
            return (
              <Selection
                key={i}
                className="re-crop--no-pointer"
                crop={crop}
                disabled={disabled}
                hasMask={false}
                onChange={newCrop => this.handleChange(newCrop, i)}
                selectionAddon={<div className="re-crop__close" onClick={() => this.handleDel(i)}>×</div>}
                {...rest}
              />
            )
          })
        }
      </div>
    )
  }
}
