import React from 'react';
import { shallow } from 'enzyme';
import { AdminPage } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<AdminPage />);
  expect(renderedComponent.find('.admin-admin-page').length).toBe(1);
});
