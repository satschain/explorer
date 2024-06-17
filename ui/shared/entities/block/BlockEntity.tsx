import { chakra, useColorModeValue } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';
import { FaCube } from 'react-icons/fa';
import { MdOpenInNew } from 'react-icons/md';

import { route } from 'nextjs-routes';

import * as EntityBase from 'ui/shared/entities/base/components';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'hash' | 'number'>;

const Link = chakra((props: LinkProps) => {
  const heightOrHash = props.hash ?? String(props.number);
  const defaultHref = route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type IconProps = Omit<EntityBase.IconBaseProps, 'name'> & {
  name?: EntityBase.IconBaseProps['name'];
};

const Icon = (props: IconProps) => {
  return (
    <EntityBase.Icon
      { ...props }
      name={ props.name ?? 'block_slim' }
    />
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'number'>;

const Content = chakra((props: ContentProps) => {
  return (
    <EntityBase.Content
      { ...props }
      text={ String(props.number) }
      tailLength={ props.tailLength ?? 2 }
    />
  );
});

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  number: number;
  hash?: string;
}

const BlockEntity = (props: EntityProps) => {
  const linkProps = _omit(props, [ 'className' ]);
  const partsProps = _omit(props, [ 'className', 'onClick' ]);
  const color = useColorModeValue('black', 'gray.1300');

  const openBlock = () => {
    window.open(`https://mempool.space/testnet/block/${ props.number }`, '_blank');
  };

  return (
    <Container className={ props.className } gap={ 2 }>
      <FaCube { ...partsProps }/>
      <Link { ...linkProps }>
        <Content { ...partsProps } color={ color } fontWeight="500"/>
      </Link>
      { /* eslint-disable-next-line react/jsx-no-bind */ }
      <MdOpenInNew onClick={ openBlock }/>
    </Container>
  );
};

export default React.memo(chakra(BlockEntity));

export {
  Container,
  Link,
  Icon,
  Content,
};
