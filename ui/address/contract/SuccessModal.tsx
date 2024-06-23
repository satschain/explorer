/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { TiPlusOutline } from 'react-icons/ti';

import { fetchContractAddress } from './contract.service';

type Props = {
  open: boolean;
  inscriptionId: string;
  setOpen: (val: boolean) => void;
  rlp: string;
};
const SuccessModal = ({ open, inscriptionId, setOpen, rlp }: Props) => {
  const toast = useToast();
  const [ contractAddress, setContractAddress ] = useState('');
  const handleClose = () => {
    setOpen(false);
  };
  const copyTransactionId = () => {
    navigator.clipboard.writeText(inscriptionId);
    toast({
      description: 'Transaction Id copied successfully',
      status: 'success',
    });
  };
  const copyContractId = () => {
    navigator.clipboard.writeText(contractAddress);
    toast({
      description:
           'Contract Id copied successfully',
      status: 'success',
    });
  };
  useEffect(() => {
    if (localStorage.getItem('address')) {
      fetchContractAddress({
        inscriptionId,
        address: localStorage.getItem('address'),
        rlp: rlp,
      })
        .then(async(response: any) => {
          const data = await response.json();
          setContractAddress(data?.btcContractAddress);
        })
        .catch((err: any) => {
          toast({
            description: err?.message || 'Error',
            status: 'error',
          });
        });
    }
  }, [ rlp, toast, inscriptionId ]);
  return (
    <Modal isOpen={ open } onClose={ handleClose }>
      <ModalContent width="450px" borderRadius="40px" border="1px solid black">
        <ModalCloseButton/>
        <ModalBody fontWeight={ 700 } fontSize={ 20 }>
          Contract Inscribed successfully.
        </ModalBody>
        <ModalBody
          fontSize={ 16 }
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          { ' ' }
          Tx ID : { inscriptionId?.substring(0, 10) }...
          { inscriptionId?.substring(56, 66) }
          <FaRegCopy className="cursor-pointer" onClick={ copyTransactionId }/>
        </ModalBody>
        <ModalBody
          fontSize={ 16 }
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          { ' ' }
          Contract ID : { contractAddress?.substring(0, 10) }...
          { contractAddress?.substring(56, 66) }
          <FaRegCopy className="cursor-pointer" onClick={ copyContractId }/>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="end">
          <Button
            onClick={ handleClose }
            borderRadius="40px"
            color="balck"
            background="white"
            border="1px solid black"
            fontSize="16px"
            padding="2px 16px"
            gap={ 2 }
            _hover={{ background: 'white' }}
          >
            Ok
            <TiPlusOutline color="#E75F00"/>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SuccessModal;
