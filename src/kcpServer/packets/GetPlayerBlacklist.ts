import Packet, { PacketInterface, PacketContext } from '#/packet'
import { FriendBrief } from '@/types/game/social'
import { RetcodeEnum } from '@/types/enum/retcode'

export interface GetPlayerBlacklistReq { }

export interface GetPlayerBlacklistRsp {
  retcode: RetcodeEnum
  blacklist: FriendBrief[]
}

class GetPlayerBlacklistPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetPlayerBlacklist')
  }

  async request(context: PacketContext, _data: GetPlayerBlacklistReq): Promise<void> {
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      blacklist: []
    })
  }

  async response(context: PacketContext, data: GetPlayerBlacklistRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetPlayerBlacklistPacket
export default (() => packet = packet || new GetPlayerBlacklistPacket())()