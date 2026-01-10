import type { Blog } from '@/payload-types'

interface InvestmentSpotlightSidebarProps {
  blog: Blog
}

export default function InvestmentSpotlightSidebar({ blog }: InvestmentSpotlightSidebarProps) {
  const propertyType = blog.propertyType
  const size = blog.size
  const market = blog.market
  const buyerType = blog.buyerType
  const closeTime = blog.closeTime
  const status = blog.status

  // Don't render if no data
  if (!propertyType && !size && !market && !buyerType && !closeTime && !status) {
    return null
  }

  return (
    <div className="bg-[#f5f3f0] rounded-lg p-6 mb-8">
      <div className="space-y-4">
        {propertyType && (
          <div>
            <p className="text-sm text-gray-600 mb-1">PROPERTY TYPE</p>
            <p className="text-lg font-semibold text-[#1a2e2a]">{propertyType}</p>
          </div>
        )}
        {size && (
          <div>
            <p className="text-sm text-gray-600 mb-1">SIZE</p>
            <p className="text-lg font-semibold text-[#1a2e2a]">{size}</p>
          </div>
        )}
        {market && (
          <div>
            <p className="text-sm text-gray-600 mb-1">MARKET</p>
            <p className="text-lg font-semibold text-[#1a2e2a]">{market}</p>
          </div>
        )}
        {buyerType && (
          <div>
            <p className="text-sm text-gray-600 mb-1">BUYER TYPE</p>
            <p className="text-lg font-semibold text-[#1a2e2a]">{buyerType}</p>
          </div>
        )}
        {closeTime && (
          <div>
            <p className="text-sm text-gray-600 mb-1">CLOSE TIME</p>
            <p className="text-lg font-semibold text-[#1a2e2a]">{closeTime}</p>
          </div>
        )}
        {status && (
          <div>
            <p className="text-sm text-gray-600 mb-1">STATUS</p>
            <p className="text-lg font-semibold text-[#1a2e2a]">{status}</p>
          </div>
        )}
      </div>
    </div>
  )
}


