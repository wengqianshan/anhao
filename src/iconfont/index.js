/* eslint-disable */

import React from 'react';

import IconPlayfill from './IconPlayfill';
import IconUnfold from './IconUnfold';
import IconBack from './IconBack';
import IconRight from './IconRight';
import IconFold from './IconFold';
import IconVideofill from './IconVideofill';

const IconFont = ({ name, ...rest }) => {
  switch (name) {
    case 'playfill':
      return <IconPlayfill key="1" {...rest} />;
    case 'unfold':
      return <IconUnfold key="2" {...rest} />;
    case 'back':
      return <IconBack key="3" {...rest} />;
    case 'right':
      return <IconRight key="4" {...rest} />;
    case 'fold':
      return <IconFold key="5" {...rest} />;
    case 'videofill':
      return <IconVideofill key="6" {...rest} />;
  }

  return null;
};

export default React.memo ? React.memo(IconFont) : IconFont;
