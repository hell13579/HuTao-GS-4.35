import SkillData from '$/gameData/data/SkillData'
import SkillDepot from './skillDepot'

export default class InherentProudSkill {
  depot: SkillDepot
  id: number
  data: any

  constructor(depot: SkillDepot, proudSkillId: number) {
    this.depot = depot
    this.id = proudSkillId
    this.data = SkillData.getProudSkill(proudSkillId)
  }
}