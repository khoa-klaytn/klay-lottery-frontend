import PoweredBy from 'components/layerZero/PoweredBy'
import { LinkExternal } from '@sweepstakes/uikit'

const AptosBridgeFooter = ({ isCake }: { isCake?: boolean }) => {
  return (
    <>
      <PoweredBy />
      {isCake ? (
        <>
          <LinkExternal m="20px auto" href="https://docs.sweepstakes.finance/products/cake-bridging/evms">
            How to bridge?
          </LinkExternal>
          <LinkExternal m="20px auto" href="https://docs.sweepstakes.finance/products/cake-bridging/faq">
            Need Help?
          </LinkExternal>
        </>
      ) : (
        <>
          <LinkExternal m="20px auto" href="https://docs.sweepstakes.finance/products/cake-bridging/aptos">
            How to bridge?
          </LinkExternal>
          <LinkExternal m="20px auto" href="https://docs.sweepstakes.finance/products/cake-bridging/faq">
            Need Help?
          </LinkExternal>
          <LinkExternal m="20px auto" href="https://docs.sweepstakes.finance/get-started-aptos/aptos-coin-guide">
            Don’t see your assets?
          </LinkExternal>
        </>
      )}
    </>
  )
}

export default AptosBridgeFooter
