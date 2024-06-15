import { Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Container = ({ children }: Props) => {
  // const bgImage = useColorModeValue(
  //   'url(\'/background-pattern.png\')',
  //   'url(\'/dark_background.jpg\')',
  // );
  return (
    <Box
      minWidth={{ base: '100vw', lg: 'fit-content' }}
      backgroundColor="#FFFFFF"
    >
      { children }
    </Box>
  );
};

export default React.memo(Container);
