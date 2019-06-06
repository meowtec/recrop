import { strictEqual, deepStrictEqual, ok } from 'assert'
import { pick } from 'lodash'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import Selection from '../../src/Selection'
import { noop, dispatchMove } from '../utils'
import SelectionApp from '../fixtures/SelectionApp'
import '../../src/index.less'

const addDiv = (title = '') => {
  const container = document.createElement('div')
  const header = document.createElement('div')
  const div = document.createElement('div')
  header.textContent = title
  container.style.border = '1px solid #eee'
  container.style.padding = '10px'
  container.style.marginBottom = '10px'
  container.appendChild(header)
  container.appendChild(div)
  document.body.appendChild(container)
  return div
}

describe('<Selection />', function() {
  this.timeout(10000)

  it('basic render', () => {
    const div = addDiv('basic render')
    render(
      <Selection
        crop={{
          x: 150,
          y: 100,
          width: 300,
          height: 200,
        }}
        width={600}
        height={400}
        style={{
          width: 300,
          height: 200,
        }}
        onChange={noop}
      />,
      div,
    )

    const selectionEl = div.querySelector('.re-crop__selection') as HTMLElement
    deepStrictEqual(
      pick(selectionEl.style, 'top', 'left', 'width', 'height'),
      {
        left: '25%',
        top: '25%',
        width: '50%',
        height: '50%',
      },
    )
    const maskEl = div.querySelector('.re-crop__mask') as HTMLElement
    deepStrictEqual(
      [...maskEl.children].map(x => x.getAttribute('style')),
      ['bottom: 75%;', 'top: 75%;', 'right: 75%;', 'left: 75%;'],
    )
  })

  it('Selection hasMask=false', () => {
    const div = addDiv('hasMask=false')

    render(
      <Selection
        crop={{
          x: 150,
          y: 100,
          width: 300,
          height: 200,
        }}
        width={600}
        height={400}
        style={{
          width: 300,
          height: 200,
        }}
        onChange={noop}
        hasMask={false}
      />,
      div,
    )

    strictEqual(div.querySelector('.re-crop__mask'), null)
  })

  it('transparent / className / renderAddon props', () => {
    const div = addDiv('transparent / className / renderAddon')

    render(
      <Selection
        crop={{
          x: 150,
          y: 100,
          width: 300,
          height: 200,
        }}
        width={600}
        height={400}
        style={{
          width: 300,
          height: 200,
        }}
        transparent
        className="my-test-classname"
        selectionAddon={<div className="test-addon" />}
        onChange={noop}
      />,
      div,
    )

    strictEqual(div.querySelector('.re-crop__mask'), null)
    strictEqual(div.querySelector('.re-crop__blank'), null)
    strictEqual(true, !!div.querySelector('.re-crop.my-test-classname'))
    strictEqual(true, !!div.querySelector('.re-crop__selection > .test-addon'))
  })

  it('create new crop', async () => {
    const div = addDiv('component')
    const app = render((
      <SelectionApp
        initialCrop={null}
        ratio={2}
      />
    ), div) as any as SelectionApp

    const clientRect = div.getBoundingClientRect()
    await dispatchMove(
      div.querySelector('.re-crop')!,
      [
        clientRect.left + 20,
        clientRect.top + 20,
      ],
      [
        clientRect.left + 70,
        clientRect.top + 170,
      ],
    )
    deepStrictEqual(app.state.crop, {
      x: 40,
      y: 40,
      width: 100,
      height: 50,
    })

    await dispatchMove(
      div.querySelector('.re-crop')!,
      [
        clientRect.left + 20,
        clientRect.top + 20,
      ],
      [
        clientRect.left + 1000,
        clientRect.top + 1000,
      ],
    )

    deepStrictEqual(app.state.crop, {
      x: 40,
      y: 40,
      width: 550,
      height: 275,
    })
  })

  it('resize with margin and minWidth', async () => {
    const div = addDiv('component')
    const app = render(<SelectionApp />, div) as any as SelectionApp
    const blankEl = div.querySelector('.re-crop__blank') as HTMLElement

    // move x + 40, y + 40
    await dispatchMove(blankEl, [200, 200], [220, 220])
    deepStrictEqual(app.state.crop, {
      x: 140,
      y: 140,
      width: 400,
      height: 200,
    })

    // move x + 2000, y + 2000
    await dispatchMove(blankEl, [200, 200], [1200, 1200])
    deepStrictEqual(app.state.crop, {
      x: 190,
      y: 190,
      width: 400,
      height: 200,
    })

    // move x - 2000, y - 2000
    await dispatchMove(blankEl, [200, 200], [-800, -800])
    deepStrictEqual(app.state.crop, {
      x: 10,
      y: 10,
      width: 400,
      height: 200,
    })

    // drag nw
    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="nw"]')!,
      [0, 0],
      [20, 20],
    )

    deepStrictEqual(app.state.crop, {
      x: 50,
      y: 50,
      width: 360,
      height: 160,
    })

    // test min width

    app.setState({
      crop: {
        x: 100,
        y: 100,
        width: 50,
        height: 50,
      },
    })

    // x + 20, y + 20
    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="nw"]')!,
      [0, 0],
      [10, 10],
    )

    deepStrictEqual(app.state.crop, {
      x: 100,
      y: 100,
      width: 50,
      height: 50,
    })

    // x + 52, y + 52 (cross x y)
    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="nw"]')!,
      [0, 0],
      [26, 26],
    )

    deepStrictEqual(app.state.crop, {
      x: 150,
      y: 150,
      width: 50,
      height: 50,
    })

    // x + 52, y + 40 (cross x)
    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="nw"]')!,
      [0, 0],
      [26, 20],
    )

    deepStrictEqual(app.state.crop, {
      x: 200,
      y: 150,
      width: 50,
      height: 50,
    })

    // x + 40, y + 52 (cross y)
    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="nw"]')!,
      [0, 0],
      [20, 26],
    )

    deepStrictEqual(app.state.crop, {
      x: 200,
      y: 200,
      width: 50,
      height: 50,
    })

    app.setState({
      crop: {
        x: 520,
        y: 320,
        width: 50,
        height: 50,
      },
    })

    // x + 100, y + 100
    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="nw"]')!,
      [0, 0],
      [50, 50],
    )

    deepStrictEqual(app.state.crop, {
      x: 520,
      y: 320,
      width: 50,
      height: 50,
    })

    // x + 100, y + 100
    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="se"]')!,
      [20, 20],
      [0, 0],
    )

    deepStrictEqual(app.state.crop, {
      x: 520,
      y: 320,
      width: 50,
      height: 50,
    })

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="se"]')!,
      [26, 26],
      [0, 0],
    )

    deepStrictEqual(app.state.crop, {
      x: 470,
      y: 270,
      width: 50,
      height: 50,
    })

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="se"]')!,
      [0, 0],
      [100, 100],
    )

    deepStrictEqual(app.state.crop, {
      x: 470,
      y: 270,
      width: 120,
      height: 120,
    })

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="ne"]')!,
      [0, 0],
      [200, -200],
    )

    deepStrictEqual(app.state.crop, {
      x: 470,
      y: 10,
      width: 120,
      height: 380,
    })

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="sw"]')!,
      [0, 0],
      [-400, 400],
    )

    deepStrictEqual(app.state.crop, {
      x: 10,
      y: 10,
      width: 580,
      height: 380,
    })

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="n"]')!,
      [0, 0],
      [20, 20],
    )

    deepStrictEqual(app.state.crop, {
      x: 10,
      y: 50,
      width: 580,
      height: 340,
    })

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="w"]')!,
      [0, 0],
      [20, 20],
    )

    deepStrictEqual(app.state.crop, {
      x: 50,
      y: 50,
      width: 540,
      height: 340,
    })

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="e"]')!,
      [0, 0],
      [-20, -20],
    )

    deepStrictEqual(app.state.crop, {
      x: 50,
      y: 50,
      width: 500,
      height: 340,
    })

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="s"]')!,
      [0, 0],
      [20, 20],
    )

    deepStrictEqual(app.state.crop, {
      x: 50,
      y: 50,
      width: 500,
      height: 340,
    })

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="s"]')!,
      [0, 0],
      [-20, -20],
    )

    deepStrictEqual(app.state.crop, {
      x: 50,
      y: 50,
      width: 500,
      height: 300,
    })
  })

  it('minHeight + minWidth', async () => {
    const div = addDiv('component')
    const app = render((
      <SelectionApp
        minWidth={100}
        minHeight={80}
      />
    ), div) as any as SelectionApp

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="nw"]')!,
      [0, 0],
      [200, 100],
    )

    deepStrictEqual(app.state.crop, {
      x: 400,
      y: 220,
      width: 100,
      height: 80,
    })
  })

  it('fixed ratio', async () => {
    const div = addDiv('component')
    const app = render((
      <SelectionApp
        ratio={2}
      />
    ), div) as any as SelectionApp

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="nw"]')!,
      [0, 0],
      [50, 50],
    )

    strictEqual(app.state.crop!.width, app.state.crop!.height * 2)
  })

  it('handleCropChangeFinish', async () => {
    const div = addDiv('component')
    const app = render((
      <SelectionApp />
    ), div) as any as SelectionApp

    await dispatchMove(
      div.querySelector('.re-crop__blank')!,
      [0, 0],
      [50, 50],
    )

    strictEqual(app.changeTimes, 1)

    await dispatchMove(
      div.querySelector('.re-crop__drag-handle[data-ord="nw"]')!,
      [0, 0],
      [50, 50],
    )

    strictEqual(app.changeTimes, 2)
  })
})
