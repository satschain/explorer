import type { ThemingProps } from '@chakra-ui/react';
import { Flex, chakra, useDisclosure, Popover, PopoverTrigger, PopoverContent, PopoverBody, Box } from '@chakra-ui/react';
import React from 'react';

import type { UserTags } from 'types/api/addressParams';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import Tag from 'ui/shared/chakra/Tag';

interface TagData {
  label: string;
  display_name: string;
  colorScheme?: ThemingProps<'Tag'>['colorScheme'];
  variant?: ThemingProps<'Tag'>['variant'];
}

interface Props {
  className?: string;
  data?: UserTags;
  isLoading?: boolean;
  tagsBefore?: Array<TagData | undefined>;
  tagsAfter?: Array<TagData | undefined>;
  contentAfter?: React.ReactNode;
}

const EntityTags = ({ className, data, tagsBefore = [], tagsAfter = [], isLoading, contentAfter }: Props) => {
  const isMobile = useIsMobile();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const tags: Array<TagData> = [
    ...tagsBefore,
    ...(data?.private_tags || []),
    ...(data?.public_tags || []),
    ...(data?.watchlist_names || []),
    ...tagsAfter,
  ]
    .filter(Boolean);

  const metaSuitesPlaceholder = config.features.metasuites.isEnabled ?
    <Box display="none" id="meta-suites__address-tag" data-ready={ !isLoading }/> :
    null;

  if (tags.length === 0 && !contentAfter) {
    return metaSuitesPlaceholder;
  }

  const content = (() => {
    if (isMobile && tags.length > 2) {
      return (
        <>
          {
            tags
              .slice(0, 2)
              .map((tag) => (
                <Tag
                  key={ tag.label }
                  isLoading={ isLoading }
                  isTruncated
                  maxW={{ base: '115px', lg: 'initial' }}
                  colorScheme={ 'colorScheme' in tag ? tag.colorScheme : 'gray' }
                  variant={ 'variant' in tag ? tag.variant : 'subtle' }
                >
                  { tag.display_name }
                </Tag>
              ))
          }
          { metaSuitesPlaceholder }
          <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
            <PopoverTrigger>
              <Tag isLoading={ isLoading }onClick={ onToggle }>+{ tags.length - 1 }</Tag>
            </PopoverTrigger>
            <PopoverContent w="240px">
              <PopoverBody >
                <Flex columnGap={ 2 } rowGap={ 2 } flexWrap="wrap">
                  {
                    tags
                      .slice(2)
                      .map((tag) => (
                        <Tag
                          key={ tag.label }
                          colorScheme={ 'colorScheme' in tag ? tag.colorScheme : 'gray' }
                          variant={ 'variant' in tag ? tag.variant : 'subtle' }
                        >
                          { tag.display_name }
                        </Tag>
                      ))
                  }
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </>
      );
    }

    return (
      <>
        { tags.map((tag) => (
          <Tag
            key={ tag.label }
            isLoading={ isLoading }
            isTruncated
            maxW={{ base: '115px', lg: 'initial' }}
            background="#F4F4F4"
            borderRadius="8px"
            border="0.94px solid #FFFFFF"
            padding="8px 18px"
          >
            { tag.display_name }
          </Tag>
        )) }
        { metaSuitesPlaceholder }
      </>
    );
  })();

  return (
    <Flex className={ className } columnGap={ 2 } rowGap={ 2 } flexWrap="wrap" alignItems="center" flexGrow={ 1 }>
      { content }
      { contentAfter }
    </Flex>
  );
};

export default React.memo(chakra(EntityTags));
