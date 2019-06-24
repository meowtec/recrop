import Selection, { SelectionProps } from './Selection'
import ImageCrop, { ImageCropProps, ResizeObserve } from './ImageCrop'
import MultipleSelection, { MultipleSelectionProps } from './MultipleSelection'
import { Rect } from './utils'

type Crop = Rect
type RegionSelection = Selection
type RegionSelectionProps = SelectionProps

export {
  Crop,
  Rect,
  Selection,
  RegionSelection,
  SelectionProps,
  RegionSelectionProps,
  ImageCrop,
  ImageCropProps,
  ResizeObserve,
  MultipleSelection,
  MultipleSelectionProps,
}
