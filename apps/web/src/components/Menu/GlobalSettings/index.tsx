import { Flex /* IconButton, CogIcon, useModal */ } from '@sweepstakes/uikit'
// import SettingsModal from './SettingsModal'

type Props = {
  color?: string
  mr?: string
  mode?: string
}

const GlobalSettings = (_: Props) => {
  // const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)

  return (
    <Flex>
      {/* <IconButton
        onClick={onPresentSettingsModal}
        variant="text"
        scale="sm"
        mr={mr}
        id={`open-settings-dialog-button-${mode}`}
      >
        <CogIcon height={24} width={24} color={color || 'textSubtle'} />
      </IconButton> */}
    </Flex>
  )
}

export default GlobalSettings
