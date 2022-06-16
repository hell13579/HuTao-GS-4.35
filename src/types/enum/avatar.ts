export enum AvatarExpeditionStateEnum {
  AVATAR_EXPEDITION_NONE = 0,
  AVATAR_EXPEDITION_DOING = 1,
  AVATAR_EXPEDITION_FINISH_WAIT_REWARD = 2,
  AVATAR_EXPEDITION_CALLBACK_WAIT_REWARD = 3,
  AVATAR_EXPEDITION_LOCKED = 4
}

export enum AvatarTypeEnum {
  NONE = 0,
  FORMAL = 1,
  TRIAL = 2,
  MIRROR = 3
}

export enum FetterStateEnum {
  NONE = 0,
  NOT_OPEN = 1,
  OPEN = 2,
  FINISH = 3
}

export enum GrantReasonEnum {
  INVALID = 0,
  GRANT_BY_QUEST = 1,
  GRANT_BY_TRIAL_AVATAR_ACTIVITY = 2,
  GRANT_BY_DUNGEON_ELEMENT_CHALLENGE = 3,
  GRANT_BY_MIST_TRIAL_ACTIVITY = 4,
  GRANT_BY_SUMO_ACTIVITY = 5
}