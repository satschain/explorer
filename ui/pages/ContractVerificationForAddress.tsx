import { Flex, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractVerificationMethod } from 'types/api/contract';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContractVerificationForm from 'ui/contractVerification/ContractVerificationForm';
import useFormConfigQuery from 'ui/contractVerification/useFormConfigQuery';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

const ContractVerificationForAddress = () => {
  const appProps = useAppContext();
  const router = useRouter();
  const listBgColor = useColorModeValue('white', 'blue.1000');

  const hash = getQueryParamString(router.query.hash);
  const method = getQueryParamString(router.query.method) as SmartContractVerificationMethod;

  const contractQuery = useApiQuery('contract', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
    },
  });

  throwOnResourceLoadError(contractQuery);

  const configQuery = useFormConfigQuery(Boolean(hash));

  React.useEffect(() => {
    if (method && hash) {
      router.replace({ pathname: '/address/[hash]/contract-verification', query: { hash } }, undefined, { scroll: false, shallow: true });
    }
  // onMount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const isVerifiedContract = contractQuery.data?.is_verified && !contractQuery.data.is_partially_verified;

  React.useEffect(() => {
    if (isVerifiedContract) {
      router.push({ pathname: '/address/[hash]', query: { hash, tab: 'contract' } }, undefined, { scroll: false, shallow: true });
    }
  }, [ hash, isVerifiedContract, router ]);

  const content = (() => {
    if (configQuery.isError || !hash || contractQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (configQuery.isPending || contractQuery.isPending || isVerifiedContract) {
      return <ContentLoader/>;
    }

    return (
      <ContractVerificationForm
        method={ method && configQuery.data.verification_options.includes(method) ? method : undefined }
        config={ configQuery.data }
        hash={ hash }
      />
    );
  })();

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/address');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to contract',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  return (
    <>
      <Flex direction="column" paddingX={{ base: 4, lg: 8 }}>
        <PageTitle
          title="New smart contract verification"
          backLink={ backLink }
        />
        <AddressEntity
          address={{ hash, is_contract: true, implementation_name: null }}
          noLink
          fontFamily="heading"
          fontSize="lg"
          fontWeight={ 500 }
          mb={ 12 }
        />
      </Flex>
      <Flex
        minH="75vh"
        bg={ listBgColor }
        borderTopRadius="2.5em"
        paddingY={{
          base: '1em',
          md: '2em',
        }}
        paddingX="1em"
        width="100%"
      >
        { content }
      </Flex>
    </>
  );
};

export default ContractVerificationForAddress;
