import { Box, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { BLOCK } from 'stubs/block';
import { generateListStub } from 'stubs/utils';
import BlocksContent from 'ui/blocks/BlocksContent';
import BlocksTabSlot from 'ui/blocks/BlocksTabSlot';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: -5,
};

const BlocksPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const tab = getQueryParamString(router.query.tab);
  const listBgColor = useColorModeValue('white', 'blue.1000');

  const blocksQuery = useQueryWithPages({
    resourceName: 'blocks',
    filters: { type: 'block' },
    options: {
      enabled: tab === 'blocks' || !tab,
      placeholderData: generateListStub<'blocks'>(BLOCK, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
  });
  const reorgsQuery = useQueryWithPages({
    resourceName: 'blocks',
    filters: { type: 'reorg' },
    options: {
      enabled: tab === 'reorgs',
      placeholderData: generateListStub<'blocks'>(BLOCK, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
  });
  const unclesQuery = useQueryWithPages({
    resourceName: 'blocks',
    filters: { type: 'uncle' },
    options: {
      enabled: tab === 'uncles',
      placeholderData: generateListStub<'blocks'>(BLOCK, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
  });

  const pagination = (() => {
    if (tab === 'reorgs') {
      return reorgsQuery.pagination;
    }
    if (tab === 'uncles') {
      return unclesQuery.pagination;
    }
    return blocksQuery.pagination;
  })();

  const tabs: Array<RoutedTab> = [
    { id: 'blocks', title: 'All', component: <BlocksContent type="block" query={ blocksQuery }/> },
    { id: 'reorgs', title: 'Forked', component: <BlocksContent type="reorg" query={ reorgsQuery }/> },
    { id: 'uncles', title: 'Uncles', component: <BlocksContent type="uncle" query={ unclesQuery }/> },
  ];

  return (
    <Box
      bgColor={ listBgColor }
      borderTopRadius="2.5em"
      padding={{
        base: '1em',
        md: '3em',
      }}
      paddingY="3em"
    >
      <RoutedTabs
        tabs={ tabs }
        type="parent_tabs"
        tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ <BlocksTabSlot pagination={ pagination }/> }
        stickyEnabled={ !isMobile }
      />
    </Box>
  );
};

export default BlocksPageContent;
