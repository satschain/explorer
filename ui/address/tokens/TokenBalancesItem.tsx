import { Box, Flex, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

const TokenBalancesItem = ({ name, value, isLoading }: {name: string; value: string; isLoading: boolean }) => {

  return (
    <Flex p={ 5 } borderRadius="16px" alignItems="center" border="1px solid black">
      <IconSvg name="wallet" boxSize="30px" mr={ 3 } flexShrink={ 0 }/>
      <Box>
        <Text variant="secondary" fontSize="xs">{ name }</Text>
        <Skeleton isLoaded={ !isLoading } fontWeight="500" whiteSpace="pre-wrap" wordBreak="break-word">{ value }</Skeleton>
      </Box>
    </Flex>
  );
};

export default React.memo(TokenBalancesItem);
