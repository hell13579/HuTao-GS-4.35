import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'

export interface ChangeMpTeamAvatarReq {
  avatarGuidList: string[]
  curAvatarGuid?: string
}

export interface ChangeMpTeamAvatarRsp {
  retcode: RetcodeEnum
  avatarGuidList?: string[]
  curAvatarGuid?: string
}

class ChangeMpTeamAvatarPacket extends Packet implements PacketInterface {
  constructor() {
    super('ChangeMpTeamAvatar', {
      reqState: ClientState.IN_GAME,
      reqStateMask: 0xF0FF
    })
  }

  async request(context: PacketContext, data: ChangeMpTeamAvatarReq): Promise<void> {
    const { player, seqId } = context
    const { teamManager, state } = player
    const { avatarGuidList, curAvatarGuid } = data
    const team = teamManager.getTeam()

    // Set client state
    player.state = (state & 0xFF00) | ClientState.SETUP_TEAM

    try {
      const retcode = await team.setUpAvatarTeam({
        teamId: 0,
        avatarTeamGuidList: avatarGuidList,
        curAvatarGuid
      }, undefined, seqId)

      await this.response(context, {
        retcode,
        avatarGuidList,
        curAvatarGuid
      })
    } catch (err) {
      await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
    }

    // Set client state
    player.state = (state & 0xFF00)
  }

  async response(context: PacketContext, data: ChangeMpTeamAvatarRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: ChangeMpTeamAvatarPacket
export default (() => packet = packet || new ChangeMpTeamAvatarPacket())()