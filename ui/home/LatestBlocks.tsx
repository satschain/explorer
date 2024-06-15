import { Box, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { HOMEPAGE_STATS } from 'stubs/stats';

import LatestBlocksItem from './LatestBlocksItem';

const LatestBlocks = () => {
  const isMobile = useIsMobile();
  // const blocksMaxCount = isMobile ? 2 : 3;
  let blocksMaxCount: number;
  if (config.features.rollup.isEnabled || config.UI.views.block.hiddenFields?.total_reward) {
    blocksMaxCount = isMobile ? 4 : 5;
  } else {
    blocksMaxCount = isMobile ? 2 : 3;
  }
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_blocks', {
    queryOptions: {
      placeholderData: Array(blocksMaxCount).fill(BLOCK),
    },
  });

  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const statsQueryResult = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('homepage_blocks'), (prevData: Array<Block> | undefined) => {

      const newData = prevData ? [ ...prevData ] : [];

      if (newData.some((block => block.height === payload.block.height))) {
        return newData;
      }

      return [ payload.block, ...newData ].sort((b1, b2) => b2.height - b1.height).slice(0, blocksMaxCount);
    });
  }, [ queryClient, blocksMaxCount ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: isPlaceholderData || isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  let content;

  if (isError) {
    content = <Text>No data. Please reload page.</Text>;
  }

  if (data) {
    const dataToShow = data.slice(0, blocksMaxCount);

    content = (
      <>
        { /*{ statsQueryResult.data?.network_utilization_percentage !== undefined && (*/ }
        { /*  <Skeleton isLoaded={ !statsQueryResult.isPlaceholderData } mb={{ base: 6, lg: 3 }} display="inline-block">*/ }
        { /*    <Text as="span" fontSize="sm">*/ }
        { /*      Network utilization:{ nbsp }*/ }
        { /*    </Text>*/ }
        { /*    <Text as="span" fontSize="sm" color="blue.400" fontWeight={ 700 }>*/ }
        { /*      { statsQueryResult.data?.network_utilization_percentage.toFixed(2) }%*/ }
        { /*    </Text>*/ }
        { /*  </Skeleton>*/ }
        { /*) }*/ }
        { /*<AnimatePresence initial={ false } >*/ }
        <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} gap="20px" flexWrap="wrap" justifyContent="space-between">
          { dataToShow.map(((block, index) => (
            <LatestBlocksItem
              key={ block.height + (isPlaceholderData ? String(index) : '') }
              block={ block }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </Box>
        { /*</AnimatePresence>*/ }
        { /*<Flex justifyContent="center">*/ }
        { /*  <LinkInternal fontSize="sm" href={ route({ pathname: '/blocks' }) }>View all blocks</LinkInternal>*/ }
        { /*</Flex>*/ }
      </>
    );
  }

  return (
    <Box width="100%" flexShrink={ 0 }>
      { /*<Heading as="h4" size="sm" mb={ 4 }>Latest blocks</Heading>*/ }
      { content }
    </Box>
  );
};

export default LatestBlocks;
