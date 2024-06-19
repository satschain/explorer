import type { LazyMode } from '@chakra-ui/lazy-utils';
import type { ChakraProps, ThemingProps } from '@chakra-ui/react';
import { Tabs, TabPanel, TabPanels, chakra, Box, Flex } from '@chakra-ui/react';
import _debounce from 'lodash/debounce';
import React, { useEffect, useRef, useState } from 'react';

import type { TabItem } from './types';

import isBrowser from 'lib/isBrowser';

import AdaptiveTabsList from './AdaptiveTabsList';
import useAdaptiveTabs from './useAdaptiveTabs';

export interface Props extends ThemingProps<'Tabs'> {
  tabs: Array<TabItem>;
  lazyBehavior?: LazyMode;
  tabListProps?:
  | ChakraProps
  | (({
    isSticky,
    activeTabIndex,
  }: {
    isSticky: boolean;
    activeTabIndex: number;
  }) => ChakraProps);
  rightSlot?: React.ReactNode;
  rightSlotProps?: ChakraProps;
  stickyEnabled?: boolean;
  onTabChange?: (index: number) => void;
  defaultTabIndex?: number;
  className?: string;
  type?: string;
}

const TabsWithScroll = ({
  tabs,
  lazyBehavior,
  tabListProps,
  rightSlot,
  rightSlotProps,
  stickyEnabled,
  onTabChange,
  defaultTabIndex,
  className,
  type,
  ...themeProps
}: Props) => {
  const [ activeTabIndex, setActiveTabIndex ] = useState<number>(
    defaultTabIndex || 0,
  );
  const [ screenWidth, setScreenWidth ] = React.useState(
    isBrowser() ? window.innerWidth : 0,
  );
  const { tabsCut, rightSlotRef } = useAdaptiveTabs(tabs);

  const tabsRef = useRef<HTMLDivElement>(null);
  const handleTabChange = React.useCallback(
    (index: number) => {
      onTabChange ? onTabChange(index) : setActiveTabIndex(index);
    },
    [ onTabChange ],
  );

  useEffect(() => {
    if (defaultTabIndex !== undefined) {
      setActiveTabIndex(defaultTabIndex);
    }
  }, [ defaultTabIndex ]);

  React.useEffect(() => {
    const resizeHandler = _debounce(() => {
      setScreenWidth(window.innerWidth);
    }, 100);
    const resizeObserver = new ResizeObserver(resizeHandler);

    resizeObserver.observe(document.body);
    return function cleanup() {
      resizeObserver.unobserve(document.body);
    };
  }, []);

  if (tabs.length === 1) {
    return <div>{ tabs[0].component }</div>;
  }

  return (
    <Tabs
      className={ className }
      variant={ themeProps.variant || 'soft-rounded' }
      colorScheme={ themeProps.colorScheme || 'blue' }
      isLazy
      overflow="scroll"
      onChange={ handleTabChange }
      index={ activeTabIndex }
      position="relative"
      size={ themeProps.size || 'md' }
      ref={ tabsRef }
      lazyBehavior={ lazyBehavior }
      width="100%"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <AdaptiveTabsList
          key={ screenWidth }
          tabs={ tabs }
          type={ type }
          tabListProps={ tabListProps }
          rightSlot={ rightSlot }
          rightSlotProps={ rightSlotProps }
          stickyEnabled={ stickyEnabled }
          activeTabIndex={ activeTabIndex }
          onItemClick={ handleTabChange }
          themeProps={ themeProps }
        />
        { rightSlot && tabsCut > 0 ? (
          <Flex
            ref={ rightSlotRef }
            ml="auto"
            // margin="24px 0px"
            marginTop="0px"
            justifyContent="end"
          >
            <Box>{ rightSlot }</Box>
          </Flex>
        ) : null }
      </Box>
      <Box padding="20px">
        <TabPanels>
          { tabs.map((tab) => (
            <TabPanel padding={ 0 } key={ tab.id }>
              { tab.component }
            </TabPanel>
          )) }
        </TabPanels>
      </Box>
    </Tabs>
  );
};

export default React.memo(chakra(TabsWithScroll));
