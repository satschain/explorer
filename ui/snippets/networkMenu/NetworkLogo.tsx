import type { StyleProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

import { route } from 'nextjs-routes';

// import config from 'configs/app';
// import IconSvg from 'ui/shared/IconSvg';

import Logo from '../../../public/logo.png';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
  imageProps?: StyleProps;
}

// const LogoFallback = ({ isCollapsed, isSmall, imageProps }: { isCollapsed?: boolean; isSmall?: boolean; imageProps?: StyleProps }) => {
//   const field = isSmall ? 'icon' : 'logo';
//   const logoColor = useColorModeValue('blue.600', 'white');

//   const display = isSmall ? {
//     base: 'none',
//     lg: isCollapsed === false ? 'none' : 'block',
//     xl: isCollapsed ? 'block' : 'none',
//   } : {
//     base: 'block',
//     lg: isCollapsed === false ? 'block' : 'none',
//     xl: isCollapsed ? 'none' : 'block',
//   };

//   if (config.UI.sidebar[field].default) {
//     return <Skeleton w="100%" borderRadius="sm" display={ display }/>;
//   }

//   return (
//     <IconSvg
//       name={ isSmall ? 'networks/icon-placeholder' : 'networks/logo-placeholder' }
//       width="auto"
//       height="100%"
//       color={ logoColor }
//       display={ display }
//       { ...imageProps }
//     />
//   );
// };

const NetworkLogo = ({ isCollapsed, onClick }: Props) => {

  // const logoSrc = useColorModeValue(config.UI.sidebar.logo.default, config.UI.sidebar.logo.dark || config.UI.sidebar.logo.default);
  // const iconSrc = useColorModeValue(config.UI.sidebar.icon.default, config.UI.sidebar.icon.dark || config.UI.sidebar.icon.default);
  // const darkModeFilter = { filter: 'brightness(0) invert(1)' };
  // const logoStyle = useColorModeValue({}, !config.UI.sidebar.logo.dark ? darkModeFilter : {});
  // const iconStyle = useColorModeValue({}, !config.UI.sidebar.icon.dark ? darkModeFilter : {});

  return (
    <Box
      as="a"
      href={ route({ pathname: '/' }) }
      width={{ base: '120px', lg: isCollapsed === false ? '120px' : '30px', xl: isCollapsed ? '30px' : '120px' }}
      height={{ base: '24px', lg: isCollapsed === false ? '24px' : '30px', xl: isCollapsed ? '30px' : '24px' }}
      display="inline-flex"
      overflow="hidden"
      onClick={ onClick }
      flexShrink={ 0 }
      aria-label="Link to main page"
    >
      { /* big logo */ }
      <Image src={ Logo } alt="Example" width={ 40 } height={ 50 }/>
      { /* small logo */ }
    </Box>
  );
};

export default React.memo(NetworkLogo);
