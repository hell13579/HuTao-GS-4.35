import { mhy128Enc } from './aes'
import { aesXorpad, keyXorpad } from './magic'
import MT19937 from './mt19937'

export function keyScramble(key: Buffer): void {
  const roundKeys = Buffer.alloc(11 * 16)
  for (let round = 0; round <= 10; round++) {
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        const idx = (round << 8) + (i * 16) + j
        roundKeys[round * 16 + i] ^= aesXorpad[1][idx] ^ aesXorpad[0][idx]
      }
    }
  }

  const chip = Buffer.alloc(16)
  mhy128Enc(key, roundKeys, chip)
  chip.copy(key)
}

export function getDecryptVector(key: Buffer, crypt: Buffer, output: Buffer): void {
  let val = 0xFFFFFFFFFFFFFFFFn
  for (let i = 0; i < crypt.length >> 3; i++) {
    val = crypt.readBigInt64LE(i << 3) ^ val
  }

  const mt = new MT19937()
  mt.seed(key.readBigUInt64LE(8) ^ 0xCEAC3B5A867837ACn ^ val ^ key.readBigInt64LE())

  for (let i = 0; i < output.length >> 3; i++) {
    output.writeBigUInt64LE(mt.int64(), i << 3)
  }
}

export default function ec2b(buf: Buffer): Buffer {
  const xorpad = Buffer.alloc(4096)

  if (!Buffer.isBuffer(buf) || buf.length < 8 || buf.readUint32LE() !== 0x62326345) return xorpad

  const keyLen = buf.readUInt32LE(4)
  if (buf.length < 8 + keyLen + 4) return xorpad
  const dataLen = buf.readUint32LE(8 + keyLen)
  if (buf.length < 8 + keyLen + 4 + dataLen) return xorpad

  const key = buf.slice(8, 8 + keyLen)
  const data = buf.slice(12 + keyLen, 12 + keyLen + dataLen)

  keyScramble(key)
  for (let i = 0; i < 16; i++) key[i] ^= keyXorpad[i]

  getDecryptVector(key, data, xorpad)

  return xorpad
}