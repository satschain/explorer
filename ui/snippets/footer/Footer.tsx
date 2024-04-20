/* eslint-disable react-hooks/rules-of-hooks */
// import type { GridProps } from '@chakra-ui/react';
// import { Box, Grid, Flex, Text, Link, VStack, Skeleton, useColorModeValue } from '@chakra-ui/react';
// import { useQuery } from '@tanstack/react-query';
import { Box, Divider, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import FooterLinkItem from './FooterLinkItem';

const Footer = () => {

  const SOCIAL_HANDLE = [
    {
      icon: 'social/git' as const,
      iconSize: '18px',
      url: 'https://twitter.com/satschain',
    },
    {
      icon: 'social/twitter' as const,
      iconSize: '18px',
      url: 'https://twitter.com/satschain',
    },
    {
      icon: 'social/discord' as const,
      iconSize: '24px',
      url: 'https://twitter.com/satschain',
    },
  ];

  const PageLinks = [
    {
      text: 'Transactions',
      link: '/txs',
    },
    {
      text: 'Blocks',
      link: '/blocks',
    },
    {
      text: 'Tokens',
      link: '/tokens',
    },
    {
      text: 'Compiler',
      link: 'https://satschain.xyz/compile',
    },
  ];
  return (
    <Box
      bg={ useColorModeValue('gray.1000', 'gray.1500') }
      p={{ base: '16px', lg: '32px' }}
      maxH={ 300 }
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={{
          base: '12px',
          lg: '24px',
        }}
      >
        <Image
          src={ useColorModeValue('/stats-logo.png', '/logo.png') }
          alt="Logo"
          width={ 200 }
          height={ 300 }
        />
        <Flex
          color={ useColorModeValue('black', 'gray.1300') }
          fontSize={{ lg: '16px', base: '12px' }}
          fontWeight="600"
          flexWrap="wrap"
          gap={{ lg: '20px', base: '8px' }}
        >
          { PageLinks?.map((ele) => (
            <a href={ ele.link } key={ ele.text }>
              { ele.text }
            </a>
          ),
          ) }
        </Flex>
      </Flex>
      <Divider
        bg={ useColorModeValue('rgba(0, 0, 0, 0.5)', 'gray.1300') }
        height="1px"
        mt={ 10 }
        mb={ 4 }
      />
      <Flex
        justifyContent={{ lg: 'space-between', base: 'center' }}
        alignItems="center"
        gap={ 4 }
        flexDirection={{
          base: 'column',
          lg: 'row',
        }}
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          gap={{
            base: '4px',
            lg: '12px',
          }}
          fontWeight={ 500 }
          fontSize={{
            base: '10px',
            lg: '14px',
          }}
          flexWrap="wrap"
          color={ useColorModeValue('rgba(0,0,0,1)', 'gray.1300') }
        >
          <Text>© 2024 SatsChain. All rights reserved.</Text>
          <Link
            href="/"
            style={{ textDecoration: 'underline !important' }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/"
            style={{ textDecoration: 'underline !important' }}
          >
            Terms of Service
          </Link>
        </Flex>
        <Flex>
          { SOCIAL_HANDLE?.map((link, index) => (
            <FooterLinkItem key={ index } { ...link }/>
          )) }
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(Footer);
