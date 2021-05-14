import React from 'react'
import {render as rtlRender, RenderOptions} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {AppProviders} from 'context/app-providers'

function render(ui: React.ReactElement, renderOptions?: RenderOptions) {
  return rtlRender(ui, {wrapper: AppProviders, ...renderOptions})
}

export * from '@testing-library/react'
export {render, userEvent}
