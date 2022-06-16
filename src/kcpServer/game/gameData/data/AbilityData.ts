import Loader from '$/gameData/loader'
import AbilityData from '@/types/data/AbilityData'
import ConfigAbilityConfig from '@/types/data/BinOutput/ConfigAbility'

class AbilityDataLoader extends Loader {
  declare data: {
    Animal: AbilityData
    Avatar: AbilityData
    Equip: AbilityData
    Monster: AbilityData
  }

  constructor() {
    super('AbilityData')
  }

  getAbility(group: string, name: string): ConfigAbilityConfig[] {
    return this.data?.[group]?.[name] || []
  }
}

let loader: AbilityDataLoader
export default (() => loader = loader || new AbilityDataLoader())()