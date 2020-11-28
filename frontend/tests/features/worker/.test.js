import React from 'react';
import { shallow } from 'enzyme';
import {  } from '../../../src/features/worker/';

describe('worker/', () => {
  it('renders node with correct class name', () => {
    const props = {
      worker: {},
      actions: {},
    };
    const renderedComponent = shallow(
      < {...props} />
    );

    expect(
      renderedComponent.find('.worker-').length
    ).toBe(1);
  });
});
