import { CDN_CDN } from 'config/constants/endpoints'

let swapSound: HTMLAudioElement

const swapSoundURL = `${CDN_CDN}/swap.mp3`

export const getSwapSound = () => {
  if (!swapSound) {
    swapSound = new Audio(swapSoundURL)
  }
  return swapSound
}
