/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/naming-convention */
import _set from 'lodash/set';

import type { SmartContractMethodInput } from 'types/api/contract';

export type ContractMethodFormFields = Record<string, string | boolean | undefined>;

export const INT_REGEXP = /^(u)?int(\d+)?$/i;

export const BYTES_REGEXP = /^bytes(\d+)?$/i;

export const ARRAY_REGEXP = /^(.*)\[(\d*)\]$/;

export const getIntBoundaries = (power: number, isUnsigned: boolean) => {
  const maxUnsigned = BigInt(2 ** power);
  const max = isUnsigned ? maxUnsigned - BigInt(1) : maxUnsigned / BigInt(2) - BigInt(1);
  const min = isUnsigned ? BigInt(0) : -maxUnsigned / BigInt(2);
  return [ min, max ];
};

export function transformFormDataToMethodArgs(formData: ContractMethodFormFields) {
  const result: Array<unknown> = [];

  for (const field in formData) {
    const value = formData[field];
    const convertedValue = value ? convert_btc_address_to_evm(value) : undefined;
    _set(result, field.replaceAll(':', '.'), convertedValue);
  }

  return filterOurEmptyItems(result);
}

function filterOurEmptyItems(array: Array<unknown>): Array<unknown> {
  // The undefined value may occur in two cases:
  //    1. When an optional form field is left blank by the user.
  //        The only optional field is the native coin value, which is safely handled in the form submit handler.
  //    2. When the user adds and removes items from a field array.
  //        In this scenario, empty items need to be filtered out to maintain the correct sequence of arguments.
  return array
    .map((item) => Array.isArray(item) ? filterOurEmptyItems(item) : item)
    .filter((item) => item !== undefined);
}

export function getFieldLabel(input: SmartContractMethodInput, isRequired?: boolean) {
  const name = input.name || input.internalType || '<unnamed argument>';
  return `${ name } (${ input.type })${ isRequired ? '*' : '' }`;
}

function nativeSegwitToEVM(NS: string): string {
  // Define the Bech32 character map
  const charset = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  const bech32Reverse: { [char: string]: number } = {};
  charset.split('').forEach((c, i) => {
    bech32Reverse[c] = i;
  });

  // Discard the 'bc1q' prefix and the last 6 characters (checksum)
  const base32Encoded = NS.substring(4, NS.length - 6);

  // Convert each character to 5-bit representation
  const bitStream: Array<number> = [];
  for (const char of base32Encoded) {
    const index = bech32Reverse[char];
    // Convert index to binary and keep it as 5 bits
    bitStream.push(...Array.from(index.toString(2).padStart(5, '0')).map(x => parseInt(x)));
  }

  // Pack 5-bit groups into 8-bit bytes
  const bytesArray: Array<number> = [];
  let tempByte = 0;
  let bitCount = 0;
  for (const bit of bitStream) {
    tempByte = (tempByte << 1) | bit;
    bitCount += 1;
    if (bitCount === 8) {
      bytesArray.push(tempByte);
      tempByte = 0;
      bitCount = 0;
    }
  }

  // Ensure last bits are accounted for if they don't make up a full byte
  if (bitCount !== 0) {
    bytesArray.push(tempByte << (8 - bitCount));
  }

  // Convert bytes array to hex string
  const hexString = '0x' + bytesArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hexString;
}

function taprootToEVM(TR: string): string {
  // Define the Bech32 character map
  const charset = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  const bech32Reverse: { [char: string]: number } = {};
  charset.split('').forEach((c, i) => {
    bech32Reverse[c] = i;
  });

  // Discard the 'bc1p' prefix and the last 6 characters (checksum)
  const base32Encoded = TR.substring(4, TR.length - 6);

  // Convert each character to 5-bit representation
  const bitStream: Array<number> = [];
  for (const char of base32Encoded) {
    const index = bech32Reverse[char];
    // Convert index to binary and keep it as 5 bits
    bitStream.push(...Array.from(index.toString(2).padStart(5, '0')).map(x => parseInt(x)));
  }

  // Pack 5-bit groups into 8-bit bytes
  const bytesArray: Array<number> = [];
  let tempByte = 0;
  let bitCount = 0;
  for (const bit of bitStream) {
    tempByte = (tempByte << 1) | bit;
    bitCount += 1;
    if (bitCount === 8) {
      bytesArray.push(tempByte);
      tempByte = 0;
      bitCount = 0;
    }
  }

  // Ensure last bits are accounted for if they don't make up a full byte
  if (bitCount !== 0) {
    bytesArray.push(tempByte << (8 - bitCount));
  }

  // Strip the first 12 bytes and take the next 20 bytes
  let finalBytes: Array<number>;
  if (bytesArray.length > 32) {
    finalBytes = bytesArray.slice(12, 32); // Take bytes from 13th to 32nd byte
  } else {
    throw new Error('Expected at least 32 bytes after decoding, but got fewer.');
  }

  // Convert bytes array to hex string
  const hexString = '0x' + finalBytes.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hexString;
}

function isValidSegwitAddressTestnet(address: string): [boolean, string | null] {
  // Define the regular expressions for SegWit addresses on testnet
  const bech32_regex = /^tb1[p-z98c-h203jn54k6ma7l]{8,87}$/;
  const bech32m_regex = /^tb1p[p-z98c-h203jn54k6ma7l]{56}$/;

  // Check if the address matches either SegWit or Taproot regex
  if (bech32m_regex.test(address)) {
    return [ true, 'Taproot' ];
  } else if (bech32_regex.test(address)) {
    return [ true, 'SegWit' ];
  }
  return [ false, null ];
}

function is_native_address_mainnet(address: string): [boolean, string | null] {
  // Regular expression pattern for native SegWit address
  if (address.startsWith('bc1q')) {
    return [ true, 'SegWit' ];
  }
  if (address.startsWith('bc1p')) {
    return [ true, 'Taproot' ];
  }

  return isValidSegwitAddressTestnet(address);
}

function convert_btc_address_to_evm(address: string | boolean): string | boolean {
  // Validate if address is native segwit
  if (address === 'ac1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqwadhnj') {
    return '0x0000000000000000000000000000000000000000';
  }
  const [ is_valid, address_type ] = is_native_address_mainnet(address.toString());
  if (is_valid && address_type === 'SegWit') {
    return nativeSegwitToEVM(address.toString());
  }
  // Validate if address is taproot
  else if (is_valid && address_type === 'Taproot') {
    return taprootToEVM(address.toString());
  } else if (address.toString().startsWith('ac1q')) {
    const contract_address = nativeSegwitToEVM(address.toString());
    return contract_address;
  }

  return address;
}
