import type { BuildoutBroker } from './buildout-api'

/**
 * Broker lookup maps for efficient property transformation
 */
export interface BrokerMaps {
  nameMap: Map<number, string>
  imageMap: Map<number, string | null>
}

/**
 * Create broker lookup maps from broker array
 * Used for efficient property transformation with agent names and images
 */
export function createBrokerMaps(brokers: BuildoutBroker[]): BrokerMaps {
  const nameMap = new Map<number, string>()
  const imageMap = new Map<number, string | null>()

  brokers.forEach((broker) => {
    nameMap.set(broker.id, `${broker.first_name} ${broker.last_name}`)
    imageMap.set(broker.id, broker.profile_photo_url || null)
  })

  return { nameMap, imageMap }
}

/**
 * Get agent name and image from broker maps
 * Returns default values if broker not found
 */
export function getAgentInfo(
  brokerId: number | null | undefined,
  brokerMaps: BrokerMaps
): { name: string; image: string | null } {
  if (!brokerId || !brokerMaps.nameMap.has(brokerId)) {
    return { name: 'Agent', image: null }
  }

  return {
    name: brokerMaps.nameMap.get(brokerId)!,
    image: brokerMaps.imageMap.get(brokerId) ?? null,
  }
}

/**
 * Get agent name and image from broker array (alternative to maps)
 * Useful when you already have the broker array
 */
export function getAgentInfoFromBrokers(
  brokerId: number | null | undefined,
  brokers: BuildoutBroker[]
): { name: string; image: string | null } {
  if (!brokerId) {
    return { name: 'Agent', image: null }
  }

  const broker = brokers.find((b) => b.id === brokerId)
  if (!broker) {
    return { name: 'Agent', image: null }
  }

  return {
    name: `${broker.first_name} ${broker.last_name}`,
    image: broker.profile_photo_url || null,
  }
}

