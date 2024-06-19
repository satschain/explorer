/* eslint-disable react/jsx-no-bind */
import type { LinkProps } from '@chakra-ui/react';
import { Box, Link, Button, Text, useColorModeValue } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import { IoMenu } from 'react-icons/io5';
import { MdArrowOutward } from 'react-icons/md';

import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import useUnisatWallet from 'lib/useUnisatWallet';
import NavLink from 'ui/snippets/navigation/NavLink';
import NavLinkGroupDesktop from 'ui/snippets/navigation/NavLinkGroupDesktop';
import Settings from 'ui/snippets/topBar/settings/Settings';

import Logo from '../../../../public/logo.png';

const HeaderLink: React.FC<LinkProps & { children?: React.ReactNode }> = (props) => {
  return (
    <Link color="black" fontSize="14px" fontWeight="500" _hover={{ color: 'black', textDecoration: 'underline' }} { ...props } >{ props.children }</Link>
  );
};

const Header = () => {
  const { mainNavItems } = useNavItems();
  const [ showMobileMenu, setShowMobileMenu ] = React.useState(false);
  const { connect, address } = useUnisatWallet();
  const bgColor = useColorModeValue('#191919', 'gray.1500');

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p="1.5rem 4rem"
        backgroundColor="#F2FAFF"
        borderBottomRadius="40px"
      >
        <Box>
          <Link href="/">
            <Image src={ Logo } alt="Example" width={ 40 } height={ 50 }/>
          </Link>
        </Box>
        <Box
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
          gap="1em"
          border="1px"
          borderColor="#1414142E"
          color="#FFFFFF"
          borderRadius="1.5em"
          py="0.75em"
          px="1.5em"
          backgroundColor={ bgColor }
        >
          { mainNavItems.map((item) => {
            if (isGroupItem(item)) {
              return (
                <NavLinkGroupDesktop
                  key={ item.text }
                  item={ item }
                  isCollapsed={ false }
                />
              );
            } else {
              return (
                <NavLink key={ item.text } item={ item } isCollapsed={ false }/>
              );
            }
          }) }
        </Box>
        <Box gap={ 4 } alignItems="center" display={{ base: 'none', md: 'flex' }}>
          <Box onClick={ connect } _disabled={ address }>
            <Button
              display="flex"
              gap="7px"
              borderRadius="1.5em"
              backgroundColor="#E75F00"
              _hover={{ backgroundColor: '#E75F00' }}
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
                  <Box background="white" borderRadius="2em" p="4px">
                    <MdArrowOutward color="black"/>
                  </Box>
                </>
              ) }
            </Button>
          </Box>
          { /* <Settings/> */ }
        </Box>
        { /* eslint-disable-next-line react/jsx-no-bind */ }
        <Box gap={ 3 } alignItems="center" display={{ md: 'none', base: 'flex' }}>
          <Settings/>
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
