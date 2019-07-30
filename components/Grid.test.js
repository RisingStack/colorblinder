import React from 'react';
import renderer from 'react-test-renderer';

import { Grid } from './Grid';

describe('<Grid />', () => {
  it('has 1 child', () => {
    const tree = renderer
      .create(
        <Grid
          size={3}
          diffTileIndex={[1, 1]}
          diffTileColor="rgb(0, 0, 0)"
          rgb="rgb(10, 10, 10)"
          onPress={() => console.log('successful test!')}
        />,
      )
      .toJSON();
    expect(tree.length).toBe(3); // The length of the tree should be three because we want a 3x3 grid
  });
});
