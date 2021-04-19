import { render, screen } from '@testing-library/react';
import { basicTestItems } from './testdata';

import React, { useState } from 'react';
import ChargePointTable from './ChargePointTable';

it("renders correctly", () => {
  const realUseState = useState
  const data = basicTestItems;

  render(<ChargePointTable data={data} />);

  expect(
    screen.queryByText(data[0].FriendlyName).textContent
  ).toEqual(data[0].FriendlyName);
  
  expect(
    screen.queryByText(data[0].FriendlyName).nextSibling.textContent
  ).toEqual(
    String(data[0].StateOfCharge)
  );

});