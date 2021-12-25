/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

const IconVideofill = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 64C265.6 64 64 265.6 64 512s201.6 448 448 448 448-201.6 448-448S758.4 64 512 64zM691.2 544l-256 156.8C428.8 704 422.4 704 416 704c-6.4 0-9.6 0-16-3.2C390.4 694.4 384 684.8 384 672L384 352c0-12.8 6.4-22.4 16-28.8 9.6-6.4 22.4-6.4 32 0l256 166.4c9.6 6.4 16 16 16 28.8C704 528 700.8 540.8 691.2 544z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconVideofill.defaultProps = {
  size: 18,
};

export default React.memo ? React.memo(IconVideofill) : IconVideofill;
