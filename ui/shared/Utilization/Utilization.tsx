import { Flex, chakra, Skeleton } from '@chakra-ui/react';
import clamp from 'lodash/clamp';
import React from 'react';

interface Props {
  className?: string;
  value: number;
  colorScheme?: 'green' | 'gray';
  isLoading?: boolean;
  parenthesis?: boolean;
}

// const Utilization = ({ className, value, colorScheme = 'green', isLoading }: Props) => {
const Utilization = ({ className, value, isLoading, parenthesis: parenthesis = false }: Props) => {
  const valueString = (clamp(value * 100 || 0, 0, 100)).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '%';
  // const colorGrayScheme = useColorModeValue('gray.500', 'gray.400');
  // const color = colorScheme === 'gray' ? colorGrayScheme : 'green.500';

  return (
    <Flex className={ className } alignItems="center" columnGap={ 2 }>
      { /* <Skeleton isLoaded={ !isLoading } w={ `${ WIDTH }px` } h="4px" borderRadius="full" overflow="hidden">
        <Box bg={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') } h="100%">
          <Box bg={ color } w={ valueString } h="100%"/>
        </Box>
      </Skeleton> */ }
      <Skeleton
        isLoaded={ !isLoading }
        color="rgba(77, 80, 82, 1)"
        fontWeight="medium"
      >
        <span>{ parenthesis ? '(' : '' }{ valueString }{ parenthesis ? ')' : '' }</span>
      </Skeleton>
    </Flex>
  );
};

export default React.memo(chakra(Utilization));
