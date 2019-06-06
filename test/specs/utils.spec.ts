import { deepStrictEqual, strictEqual } from 'assert'
import { fitContain, classnames, createCrop } from '../../src/utils'

describe('utils specs', () => {
  it('fitContain same ratio', () => {
    deepStrictEqual(fitContain({
      srcWidth: 200,
      srcHeight: 100,
      destWidth: 200,
      destHeight: 100,
    }), {
      left: 0,
      top: 0,
      width: 200,
      height: 100,
    })
  })

  it('fitContain: image is wider', () => {
    deepStrictEqual(fitContain({
      srcWidth: 200,
      srcHeight: 100,
      destWidth: 100,
      destHeight: 100,
    }), {
      left: 0,
      top: 25,
      width: 100,
      height: 50,
    })
  })

  it('fitContain: image is higher ', () => {
    deepStrictEqual(fitContain({
      srcWidth: 1000,
      srcHeight: 2000,
      destWidth: 100,
      destHeight: 100,
    }), {
      left: 25,
      top: 0,
      width: 50,
      height: 100,
    })

    deepStrictEqual(fitContain({
      srcWidth: 0,
      srcHeight: 0,
      destWidth: 0,
      destHeight: 0,
    }), {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    })
  })

  it('classnames', () => {
    strictEqual(classnames({
      a: true,
      b: false,
      c: true,
    }).trim(), 'a c')
  })

  it('createCrop', () => {
    deepStrictEqual(createCrop({
      imageWidth: 1000,
      imageHeight: 600,
    }), {
      x: 250,
      y: 150,
      width: 500,
      height: 300,
    })

    deepStrictEqual(createCrop({
      imageWidth: 1000,
      imageHeight: 500,
      ratio: 1,
    }), {
      x: 375,
      y: 125,
      width: 250,
      height: 250,
    })

    deepStrictEqual(createCrop({
      imageWidth: 600,
      imageHeight: 1000,
      minWidth: 400,
      ratio: 2,
    }), {
      x: 0,
      y: 350,
      width: 600,
      height: 300,
    })
  })
})
