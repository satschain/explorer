import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Content = ({ children, className }: Props) => {
  return (
    <Box as="main" className={ className } width="100%">
      { children }
    </Box>
  );
};

export default React.memo(chakra(Content));
