import React from 'react';
import { render } from '@testing-library/react';

import { MoneriumProvider } from '@monerium/sdk-react-provider';
import Index from '../pages/index';

describe('Index', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MoneriumProvider>
        <Index />
      </MoneriumProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
