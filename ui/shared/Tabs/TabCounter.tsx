import { chakra } from '@chakra-ui/react';
import React from 'react';

import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

const COUNTER_OVERLOAD = 50;

type Props = {
  count?: number | null;
}

const TabCounter = ({ count }: Props) => {

  if (count === undefined || count === null) {
    return null;
  }

  return (
    <chakra.span color="#38A169" ml={ 2 } { ...getDefaultTransitionProps() } fontSize="16px">
      { count > COUNTER_OVERLOAD ? `${ COUNTER_OVERLOAD }+` : count }
    </chakra.span>
  );
};

export default TabCounter;
