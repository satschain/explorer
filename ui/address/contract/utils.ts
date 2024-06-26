/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Abi } from 'abitype';

import type { SmartContractWriteMethod } from 'types/api/contract';

export const getNativeCoinValue = (value: unknown) => {
  if (typeof value !== 'string') {
    return BigInt(0);
  }

  return BigInt(value);
};

export function prepareAbi(abi: Abi, item: SmartContractWriteMethod): Abi {
  if ('name' in item) {
    const hasMethodsWithSameName =
      abi.filter((abiItem) =>
        'name' in abiItem ? abiItem.name === item.name : false,
      ).length > 1;

    if (hasMethodsWithSameName) {
      return abi.filter((abiItem) => {
        if (!('name' in abiItem)) {
          return true;
        }

        if (abiItem.name !== item.name) {
          return true;
        }

        if (abiItem.inputs.length !== item.inputs.length) {
          return false;
        }

        return abiItem.inputs.every(({ name, type }) => {
          const itemInput = item.inputs.find((input) => input.name === name);
          return Boolean(itemInput) && itemInput?.type === type;
        });
      });
    }
  }

  return abi;
}

export const findMostMatchedString = (
  bytecodeToMatch: string,
  tempContractsList: Record<string, any>,
): Record<string, any> => {
  const arrayOfContracts = Object.keys(tempContractsList)?.map(
    (ele: string) => {
      const currentContract = tempContractsList?.[ele];
      return {
        ...currentContract,
        contractName: ele,
      };
    },
  );
  let mostMatched: Record<string, any> = {};
  let maxCharMatchCount = 0;
  arrayOfContracts?.forEach((element) => {
    const currentContractBytecode: Record<string, any> =
      element?.evm?.bytecode?.object;
    let charMatchCount = 0;
    for (let i = 0; i < bytecodeToMatch?.length; i++) {
      if (bytecodeToMatch[i] === currentContractBytecode[i]) {
        charMatchCount += 1;
      } else {
        break;
      }
    }
    if (charMatchCount > maxCharMatchCount) {
      maxCharMatchCount = charMatchCount;
      mostMatched = element;
    }
  });
  return mostMatched;
};
