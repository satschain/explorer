/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-bind */
import type { LinkProps } from '@chakra-ui/react';
import { Box, Link, Button, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import { IoCodeSlash, IoMenu } from 'react-icons/io5';
import { MdArrowOutward } from 'react-icons/md';

import useUnisatWallet from 'lib/useUnisatWallet';
import IconSvg from 'ui/shared/IconSvg';
import Settings from 'ui/snippets/topBar/settings/Settings';

const HeaderLink: React.FC<LinkProps & { children?: React.ReactNode }> = (props) => {
  return (
    <Link color="black" fontSize="14px" fontWeight="500" _hover={{ color: 'black', textDecoration: 'underline' }} { ...props } >{ props.children }</Link>
  );
};

const Header = () => {
  const [ showMobileMenu, setShowMobileMenu ] = React.useState(false);
  const { connect, address } = useUnisatWallet();
  const bgColor = useColorModeValue('gray.1000', 'gray.1500');
  const navTitleColor = useColorModeValue('gray.1200', 'gray.1300');

  const PageLinks = [
    {
      text: 'Transactions',
      link: '/txs',
      icon: 'transactions',
    },
    {
      text: 'Blocks',
      link: '/blocks',
      icon: 'block',
    },
    {
      text: 'Tokens',
      link: '/tokens',
      icon: 'token',
    },
    {
      text: 'Compiler',
      link: 'https://satschain.xyz/compile',
      iconComponent: <IoCodeSlash fontSize={ 20 } fontWeight={ 300 }/>,
    },
  ];

  const NavIcon = ({ item }: any) => {
    if (item.icon) {
      return <IconSvg name={ item.icon } boxSize="20px" flexShrink={ 0 }/>;
    }

    return item.iconComponent;

  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p="1.5em"
      >
        <Box>
          <Image
            src={ useColorModeValue('/stats-logo.png', '/logo.png') }
            alt="Example"
            width={ 200 }
            height={ 300 }
          />
        </Box>
        <Box
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
          gap="3em"
          border="1px"
          borderColor="#1414142E"
          borderRadius="1.5em"
          py="0.75em"
          px="1.5em"
          backgroundColor={ bgColor }
        >
          { PageLinks?.map((ele) => (
            <Box color={ navTitleColor } fontSize="14px" key={ ele.text }>
              <a
                href={ ele.link }
                key={ ele.text }
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >

                <NavIcon item={ ele }/>
                { ele.text }
              </a>
            </Box>
          )) }
        </Box>
        <Flex gap={ 4 } alignItems="center">
          <Box
            display={{ base: 'none', md: 'block' }}
            onClick={ connect }
            _disabled={ address }
          >
            <Button
              display="flex"
              gap="7px"
              borderRadius="1.5em"
              backgroundColor="black"
              _hover={{ backgroundColor: 'black' }}
            >
              { address ? (
                <Text color="linear-gradient(180deg, #FFFFFF 0%, #999999 100%)">
                  { address.slice(0, 10) }...
                </Text>
              ) : (
                <>
                  <Text color="linear-gradient(180deg, #FFFFFF 0%, #999999 100%)">
                    CONNECT
                  </Text>
                  <Box
                    background="linear-gradient(180deg, #FFFFFF 0%, #999999 100%)"
                    borderRadius="2em"
                    p="4px"
                  >
                    <MdArrowOutward color="black"/>
                  </Box>
                </>
              ) }
            </Button>
          </Box>
          <Settings/>
        </Flex>

        { /* eslint-disable-next-line react/jsx-no-bind */ }
        <Button
          onClick={ () => setShowMobileMenu(!showMobileMenu) }
          display={{ base: 'block', md: 'none' }}
          _hover={{ backgroundColor: 'transparent' }}
          padding="0"
          background="transparent"
        >
          <IoMenu color="black" size="32"/>
        </Button>
      </Box>
      { showMobileMenu && (
        <Box
          display="flex"
          flexDirection="column"
          background="white"
          borderRadius="1.5em"
          padding="20px"
          height="90vh"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="1em"
            borderRadius="1.5em"
            py="0.75em"
            px="1.5em"
            backgroundColor="white"
          >
            <HeaderLink>DASHBOARD</HeaderLink>
            <HeaderLink>DEPLOY SMART CONTRACT</HeaderLink>
            <HeaderLink>INTERACT WITH CONTRACT</HeaderLink>
            <HeaderLink>WHITEPAPER</HeaderLink>
            <Button
              display="flex"
              gap="7px"
              borderRadius="1.5em"
              backgroundColor="black"
              _hover={{ backgroundColor: 'black' }}
            >
              { address ? (
                <Text color="linear-gradient(180deg, #FFFFFF 0%, #999999 100%)">
                  { address.slice(0, 10) }...
                </Text>
              ) : (
                <>
                  <Text color="linear-gradient(180deg, #FFFFFF 0%, #999999 100%)">
                    CONNECT
                  </Text>
                  <Box
                    background="linear-gradient(180deg, #FFFFFF 0%, #999999 100%)"
                    borderRadius="2em"
                    p="4px"
                  >
                    <MdArrowOutward color="black"/>
                  </Box>
                </>
              ) }
            </Button>
          </Box>
        </Box>
      ) }
    </>
  );
};

export default Header;
