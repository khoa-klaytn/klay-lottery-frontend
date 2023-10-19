import { Campaign, TranslatableText } from 'config/constants/types'

export const getAchievementTitle = (campaign: Campaign): TranslatableText => {
  return campaign.title
}

export const getAchievementDescription = (campaign: Campaign): TranslatableText => {
  return campaign.description
}
