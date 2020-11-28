import React from 'react';
import { shallow } from 'enzyme';
import { WorkerPage } from '../../../src/features/worker/WorkerPage';

describe('worker/WorkerPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      worker: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <WorkerPage {...props} />
    );

    expect(
      renderedComponent.find('.worker-worker-page').length
    ).toBe(1);
  });
});
