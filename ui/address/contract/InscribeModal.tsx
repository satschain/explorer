/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useToast } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { TiPlusOutline } from 'react-icons/ti';
import Web3 from 'web3';

import { FeeDetail } from 'ui/FeeDetails';

import Logo from '../../../public/logo.png';
import { addContract, createOrder, fetchOrder, fetchRecommendedFeeRate } from './contract.service';

export type InscribeFileData = {
  filename: string;
  dataURL: string;
  size: number;
  type?: string;
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  encodedData: string;
  setOpenSuccessModal: (val: boolean) => void;
  setInscriptionId: (val: string) => void;
  fileList: Array<InscribeFileData>;
  byteCode: string;
};
export function stringToBase64(stringToEncode: string) {
  return btoa(stringToEncode);
}
const InscribeModal = ({ open, setOpen, encodedData, setOpenSuccessModal, setInscriptionId, fileList, byteCode }: Props) => {
  const toast = useToast();
  const [ outputValue, setOutputValue ] = useState<any>(564);
  const [ feeRate, setFeeRate ] = useState<any>(0);
  const [ loading, setLoading ] = useState(false);
  const address = localStorage.getItem('address');

  const convertByteCodeToSHA256 = async() => {
    try {
      const web3 = new Web3();
      const sha256Hash = web3.utils.sha3(byteCode);
      return sha256Hash;
    } catch (error) {
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const feeHandler = useCallback(async() => {
    try {
      const response = await fetchRecommendedFeeRate();
      const res: any = await response.json();
      setFeeRate(res?.halfHourFee);
    } catch (error: any) {
      toast({
        description: error?.message || '',
        status: 'error',
      });
    }
  }, [ toast ]);

  useEffect(() => {
    feeHandler();
  }, [ feeHandler ]);

  const inscribeOrder = async() => {
    setLoading(true);
    try {
      const response = await createOrder({
        receiveAddress: localStorage.getItem('address') || '',
        feeRate: Number(feeRate),
        outputValue,
        files: [
          {
            dataURL: `data:text/plain;charset=utf-8;base64,${ stringToBase64(encodedData) }`,
            filename: encodedData.slice(0, 64),
          },
        ],
        devAddress: '',
        devFee: 0,
      });

      const data: any = await response.json();
      await signOrderId(
        data?.data?.orderId,
        data?.data?.payAddress,
        data?.data?.amount,
        data?.data?.feeRate,
      );
    } catch (error: any) {
      setLoading(false);
      toast({
        description: error?.message || 'Error',
        status: 'error',
      });
      setOpen(false);

    }

  };

  async function addContractHandler(inscriptionId: string) {
    const contractHash = (await convertByteCodeToSHA256()) as string;
    try {
      const response = await addContract({
        contractHash,
        inscriptionId,
        raw_code: {},
      });
      const data = await response.json();
      setOpenSuccessModal(true);
    } catch (error: any) {
      toast({ status: 'error', description: error.message });
    }
  }
  const fetchOrderDetails = async(orderId: string) => {
    try {
      const response = await fetchOrder(orderId);
      if (response.ok) {
        const data: any = await response.json();
        if (data?.data?.files?.[0]?.inscriptionId) {
          setLoading(false);
          setInscriptionId(data?.data?.files?.[0]?.inscriptionId ?? '');
          addContractHandler(data?.data?.files?.[0]?.inscriptionId ?? '');
        } else {
          setTimeout(() => {
            fetchOrderDetails(orderId);
          }, 10000);
        }
      }
    } catch (error) {
      toast({ description: 'Some error occurred. Please try again!', status: 'error' });
    } finally {
      handleClose();
    }
  };
  const signOrderId = async(
    orderId: string,
    payAddress: string,
    orderAmount: number,
    orderFeeRate: number,
  ) => {
    const message = JSON.stringify({
      orderId,
    });
    await (window as any)?.unisat?.signMessage(message);
    const returnedSomething = await (window as any).unisat.sendBitcoin(
      payAddress,
      orderAmount,
      orderFeeRate,
    );
    if (returnedSomething) {
      fetchOrderDetails(orderId);
    }
  };
  return (
    <Modal isOpen={ open } onClose={ handleClose }>
      <ModalContent width="450px" borderRadius="40px" border="1px solid black">
        <ModalHeader mb={ 4 }>
          <Image src={ Logo } alt="Satch-Logo" width={ 30 }/>
        </ModalHeader>
        <ModalCloseButton color="red" _hover={{ color: 'red' }}/>
        <ModalBody>
          <Text textAlign="center" fontWeight="bold" fontSize="2xl" mb={ 8 }>
            Inscribe text
          </Text>
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormLabel width="200px" fontSize="sm" mb={ 0 }>
              Output Value
            </FormLabel>
            <Input
              type="number"
              value={ outputValue }
              onChange={ (e) => setOutputValue(e.target.value) }
              height="auto"
              padding="4px 12px"
              width="200px"
              fontSize="xs"
            />
          </FormControl>
          <FormControl
            mt={ 4 }
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormLabel width="200px" fontSize="sm" mb={ 0 }>
              Fee Rate
              <br/> (sat/vbytes)
            </FormLabel>
            <Input
              type="number"
              value={ feeRate }
              onChange={ (e) => setFeeRate(e.target.value) }
              height="auto"
              padding="4px 12px"
              width="200px"
              fontSize="xs"
            />
          </FormControl>
          <FeeDetail
            feeRate={ feeRate }
            outputValue={ outputValue }
            devFee={ 0 }
            fileList={ fileList }
            address={ address }
          />
        </ModalBody>

        <ModalFooter display="flex" justifyContent="end">
          <Button
            onClick={ inscribeOrder }
            borderRadius="40px"
            color="balck"
            background="white"
            border="1px solid black"
            fontSize="16px"
            padding="2px 16px"
            gap={ 2 }
            _hover={{ background: 'white' }}
          >
            { loading ? 'Loading...' : 'Inscribe' }
            <TiPlusOutline color="#E75F00"/>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InscribeModal;
