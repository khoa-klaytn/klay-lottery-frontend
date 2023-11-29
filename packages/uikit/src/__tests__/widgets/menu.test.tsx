import noop from "lodash/noop";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { renderWithProvider } from "../../testHelpers";
import { Menu, menuConfig } from "../../widgets/Menu";
import { footerLinks } from "../../components/Footer/config";
import { SubMenuItemsType } from "../../components";

/**
 * @see https://jestjs.io/docs/en/manual-mocks
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <BrowserRouter>
      <Menu
        chainId={56}
        isDark={false}
        toggleTheme={noop}
        klayPriceUsd={0.23158668932877668}
        links={menuConfig}
        subLinks={menuConfig[0].items as SubMenuItemsType[]}
        footerLinks={footerLinks}
        activeItem="Trade"
        activeSubItem="Exchange"
        buyKlayLink="https://sweepstakes.finance/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=56"
      >
        body
      </Menu>
    </BrowserRouter>
  );

  expect(asFragment()).toMatchSnapshot();
});
