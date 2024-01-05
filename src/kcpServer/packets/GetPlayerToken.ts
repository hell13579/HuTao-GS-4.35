import Packet, { PacketContext, PacketInterface } from '#/packet'
import GlobalState from '@/globalState'
import Logger from '@/logger'
import { ClientStateEnum } from '@/types/enum'
import { RetcodeEnum } from '@/types/proto/enum'
import DispatchKey from '@/utils/dispatchKey'
import { rsaDecrypt, rsaEncrypt, rsaSign } from '@/utils/rsa'

const logger = new Logger('PTOKEN', 0x80f0ff)

interface GetPlayerTokenReq {
  accountType: number
  accountUid: string
  accountToken: string
  accountExt?: string
  uid?: number
  birthday?: string
  isGuest?: boolean
  platformType: number
  onlineId?: string
  psnRegion?: string
  channelId: number
  subChannelId?: number
  countryCode?: string
  psnId?: string
  clientIpStr?: string
  cloudClientIp?: number
  // >= 2.7.50
  keyId?: number
  // custom name
  clientSeed?: string
  // official name
  clientRandKey?: string
}

interface GetPlayerTokenRsp {
  retcode: RetcodeEnum
  msg?: string
  uid: number
  token: string
  blackUidEndTime?: number
  accountType: number
  accountUid: string
  birthday?: string
  isProficientPlayer?: boolean
  secretKey?: string
  gmUid?: number
  secretKeySeed?: string
  securityCmdBuffer: string
  platformType: number
  extraBinData?: string
  isGuest?: boolean
  channelId: number
  subChannelId?: number
  tag: number
  countryCode: string
  isLoginWhiteList?: boolean
  psnId?: string
  clientVersionRandomKey?: string
  regPlatform?: number
  clientIpStr?: string
  // >= 2.7.50
  // custom name
  encryptedSeed?: string
  seedSignature?: string
  // official name
  serverRandKey?: string
  sign?: string
}

class GetPlayerTokenPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetPlayerToken')
  }

  async request(context: PacketContext, data: GetPlayerTokenReq) {
    const { game, client } = context
    const {
      accountUid,
      accountToken,
      accountType,
      platformType,
      channelId,
      keyId,
      clientSeed,
      clientRandKey
    } = data

    const { uid, userData } = await game.getPlayerInfo(accountUid)
    const seed = GlobalState.get('GenerateSeed') ? (
      BigInt(Math.floor(0x10000 * Math.random())) << 48n |
      BigInt(Math.floor(0x10000 * Math.random())) << 32n |
      BigInt(Math.floor(0x10000 * Math.random())) << 16n |
      BigInt(Math.floor(0x10000 * Math.random()))
    ) : 0n

    const rsp: GetPlayerTokenRsp = {
      retcode: RetcodeEnum.RET_SUCC,
      uid: uid,
      token: accountToken,
      accountType: accountType,
      accountUid: accountUid,
      isProficientPlayer: !!userData,
      securityCmdBuffer: 'b39ETyh1gfpSg/6AVwTnilJQDLi8whrmKeORAAeLACQ=',
      platformType: platformType,
      channelId: channelId,
      regPlatform: 1,
      tag: 5,
      countryCode: 'HK',
      serverRandKey: "CfO2d7eEYha5bJRXdCfoiemPNAtXDpyNTQ3ObeTt5a7SSHz6GAEO1WPiTQ7fR6OG8LqhVN3ZTxH9Bnkc09BnCxud+kn0+PiGv1PTOuWK0LkQQ1xmg89zA9IHS+OJd1yKT2BBmJf4sN61gi+WtT7aFwRlzku3kGCk6p2wiPo2enE7UwCFi/GiD4vq/m3hNZiKBjitAvheaqbSLjMpBax+c8HXoY5G09ap1PjEnUQPIK0xZRRQKpnrWcCyP4j8N3WwYYQGDW+OYOJjBvJdv+D6XSdEi+4IsZASYVpu9V8UZ570Cakbc+IjUm0UZJXghcR7izIjKtoNHf2Fmc26DEp1Jw==",
      sign : "mMx/Klovbzq1QxQvVgm30nYhj0jDOykyo9aparyWRNz3ACxV/2gIdLpyM/SMerWMTcx26NapQ9HsKK7BRK7Yx+nMR0O83BkBlxfl+NEarYr6kj9lBKAxZYXTXFRYA4sRynvwa/MOPmGwYMNl6aVvMohhvrsTopsRvIuGFtnCVL2wBfbxcNnbVfP5k+DxPuQnxa/vi+ju8TogW2R+r0p9zQ5NJe1oaYe4xYbyhefFVv11FA/JQHwMHLEyrEdPqTzdN75CUmE09yLuAoeJzoJ1vwwjwfcH9dMDPxsewNJBGiylVHYf56kF4HypNkYNjtxbghgLBaHg0ZoeYHTOJ7YUTQ=="
    }

    if (keyId != null) {
      // >= 2.7.50
      try {
        const { client, server } = await DispatchKey.getKeyPairs(keyId)

        const crkEncrypted = Buffer.from(clientSeed || clientRandKey, 'base64')
        const crk = rsaDecrypt(server.private, crkEncrypted)

        const srk = Buffer.alloc(8)
        srk.writeBigUInt64BE(seed ^ crk.readBigUInt64BE())

        rsp.serverRandKey = rsp.encryptedSeed = rsaEncrypt(client.public, srk).toString('base64')
        rsp.sign = rsp.seedSignature = rsaSign(server.private, srk).toString('base64')
      } catch (err) {
        logger.warn(err)
      }
    } else {
      // < 2.7.50
      rsp.secretKeySeed = seed.toString()
    }

    await this.response(context, rsp)

    await client.setKeyFromSeed(seed)
    client.setUid(accountUid, uid)

    // Set client state
    client.state = ClientStateEnum.EXCHANGE_TOKEN
  }

  async response(context: PacketContext, data: GetPlayerTokenRsp) {
    await super.response(context, data)
  }
}

let packet: GetPlayerTokenPacket
export default (() => packet = packet || new GetPlayerTokenPacket())()
