import Path from 'path'
import fs from 'fs'
import { describe, it, expect } from 'vitest'

// FIXME: should move this test file inside localization pkg
import { translations } from '@sweepstakes/localization'

const allTranslationKeys = Object.keys(translations)

// when some keys are hard to be extracted from code
const whitelist = [
  `Oopsie daisy! Hiccup's had a bit of an accident. Poor little fella.`,
  'Watch out for Flipsie’s spatula smash!',
  'Do you like chocolate with your syrup? Go long!',
  'Sunny is always cheerful when there are pancakes around. Smile!',
  `Don't let that dopey smile deceive you... Churro's a master KLAY chef!`,
  `Nommm... Oh hi, I'm just meditating on the meaning of KLAY.`,
  `Three guesses what's put that twinkle in those eyes! (Hint: it's KLAY)`,
  'These bunnies love nothing more than swapping pancakes. Especially on BSC.',
  `These bunnies like their pancakes with blueberries. What's your favorite topping?`,
  "Love makes the world go 'round... but so do pancakes. And these bunnies know it.",
  'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol%',
  'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol% to %recipientAddress%',
  'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol%',
  'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol% to %recipientAddress%',
  'Unwrap %amount% %wrap% to %native%',
  'Wrap %amount% %native% to %wrap%',
  'Add %amountA% %symbolA% and %amountB% %symbolB%',
  'Remove %amount% %symbol%',
  'Remove %amountA% %symbolA% and %amountB% %symbolB%',
  'Zap %amountA% %symbolA% and %amountB% %symbolB%',
  'Zap in %amount% BNB for %symbol%',
  'Zap in %amount% %symbol% for %lpSymbol%',
  'Order cancellation: %inputAmount% %inputTokenSymbol% for %outputAmount% %outputTokenSymbol%',
  'Order cancellation',
  'Launch App',
  'Newest First',
  'Oldest First',
  'Sort Title A-Z',
  'Sort Title Z-A',
  'All articles',
  'Learn basics of SweepStakes',
  'Learn how',
  'You might also like',
  'Chef’s choice',
  'Recommended Readings by Chefs',
  'Latest News about SweepStakes and more!',
]

describe.concurrent('Check translations integrity', () => {
  it.each(allTranslationKeys)('Translation key value should be equal', (key) => {
    expect(key).toEqual(translations[key])
  })
})

describe('Check translations available', () => {
  const files: string[] = []
  const translationKeys = new Set(allTranslationKeys)

  function throughDirectory(directory, includeJs = false) {
    fs.readdirSync(directory).forEach((file) => {
      const absolute = Path.join(directory, file)
      if (absolute.includes('node_modules')) return null
      if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute)
      if (
        (absolute.includes('.tsx') || absolute.includes('.ts') || (includeJs && absolute.includes('.js'))) &&
        !absolute.includes('.d.ts')
      ) {
        return files.push(absolute)
      }
      return files.length
    })
  }

  throughDirectory('src/')
  throughDirectory('../../apps/aptos')
  throughDirectory('../../packages/uikit/src')
  throughDirectory('../../packages/ui-wallets/src')
  throughDirectory('../../packages/widgets-internal')
  let match: RegExpExecArray | string | null = null

  const extractedKeys = new Set<string>(whitelist)

  const regexWithoutCarriageReturn = /\bt\((["'`])((?:\\1|(?:(?!\1)).)*)(\1)/gm
  const regexWithCarriageReturn = /\bt\([\r\n]\s+(["'`])([^]*?)(\1)/gm

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const data = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
    while (
      // eslint-disable-next-line no-cond-assign
      (match = regexWithoutCarriageReturn.exec(data)) !== null ||
      // eslint-disable-next-line no-cond-assign
      (match = regexWithCarriageReturn.exec(data)) !== null
    ) {
      if (match[2].trim()) {
        extractedKeys.add(match[2])
      }
    }

    const regexWithSearchInput = /<SearchInput ([^']*?) \/>/gm
    const regexWithSearchInputPlaceHolder = /placeholder="([^']*?)"/gm

    while (
      // eslint-disable-next-line no-cond-assign
      (match = regexWithSearchInput.exec(data)) !== null
    ) {
      if (match[1].trim()) {
        const placeHolderMatch = regexWithSearchInputPlaceHolder.exec(match[1])
        if (placeHolderMatch?.[1]) {
          extractedKeys.add(placeHolderMatch[1])
        }
      }
    }

    const regexWithTrans = /<Trans>([^$]*?)<\/Trans>/gm
    const regexWithTransCarriage = /<Trans>([\r\n]\s+([^]*?))<\/Trans>/gm

    while (
      // eslint-disable-next-line no-cond-assign
      (match = regexWithTrans.exec(data)) !== null ||
      // eslint-disable-next-line no-cond-assign
      (match = regexWithTransCarriage.exec(data)) !== null
    ) {
      match = match[1].replace(/\n\s+/g, ' ').trim()
      if (match) {
        extractedKeys.add(match)
      }
    }
  }

  it('Translation key should exist in translations json', () => {
    Array.from(extractedKeys).forEach((key) => {
      if (translationKeys.has(key)) {
        extractedKeys.delete(key)
        translationKeys.delete(key)
      }
    })

    expect(
      extractedKeys.size,
      `Found ${extractedKeys.size} key(s) ${JSON.stringify(
        Array.from(extractedKeys.values()),
        null,
        '\t',
      )} not in translation.json`,
    ).toBe(0)
  })

  it('should use all translation key in translation.json', () => {
    expect(
      translationKeys.size,
      `Found unused ${translationKeys.size} key(s) ${JSON.stringify(
        Array.from(translationKeys.values()),
        null,
        '\t',
      )} in translation.json`,
    ).toBe(0)
  })
})
