export const noop = () => {/* */}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function dispatchMove(
  target: EventTarget,
  clientPosStart: [number, number],
  clientPosEnd: [number, number],
) {
  target.dispatchEvent(new MouseEvent('mousedown', {
    clientX: clientPosStart[0],
    clientY: clientPosStart[1],
    bubbles: true,
  }))
  await sleep(20)
  const step = 4
  for (let i = 0; i < step; i++) {
    target.dispatchEvent(new MouseEvent('mousemove', {
      clientX: clientPosStart[0] + (clientPosEnd[0] - clientPosStart[0]) / step * (i + 1),
      clientY: clientPosStart[1] + (clientPosEnd[1] - clientPosStart[1]) / step * (i + 1),
      bubbles: true,
    }))
    await sleep(20)
  }
  target.dispatchEvent(new MouseEvent('mouseup', {
    clientX: clientPosEnd[0],
    clientY: clientPosEnd[1],
    bubbles: true,
  }))
  await sleep(20)
}
