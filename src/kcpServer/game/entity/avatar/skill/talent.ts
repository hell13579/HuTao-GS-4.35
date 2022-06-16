import SkillData from '$/gameData/data/SkillData'
import SkillDepot from './skillDepot'

export default class Talent {
  depot: SkillDepot

  id: number
  prevTalent: Talent

  constructor(depot: SkillDepot, talentId: number) {
    this.depot = depot
    this.id = talentId

    const talentData = SkillData.getTalent(talentId)
    if (!talentData) return

    if (talentData.PrevTalent != null) this.prevTalent = new Talent(depot, talentData.PrevTalent)
  }
}