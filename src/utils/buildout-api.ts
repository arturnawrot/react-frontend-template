/**
 * Buildout API Client
 * Documentation: https://buildout.com/api/v1/
 */

const BUILDOUT_API_BASE = 'https://buildout.com/api/v1'
const BUILDOUT_API_KEY = process.env.BUILDOUT_API_KEY

if (!BUILDOUT_API_KEY) {
  console.warn('BUILDOUT_API_KEY is not set in environment variables')
}

/**
 * Buildout API Response wrapper
 */
interface BuildoutResponse<T> {
  message: string
  [key: string]: any
}

/**
 * Buildout Broker License
 */
export interface BuildoutBrokerLicense {
  id: number
  number: string
  state: string
  expiration: string
}

/**
 * Buildout Broker model
 */
export interface BuildoutBroker {
  id: number
  external_id: number | null
  first_name: string
  last_name: string
  email: string
  job_title: string
  biography: string | null
  bio_pdf_url: string | null
  address: string
  address2: string
  city: string
  state: string
  zip: string
  phone_number: string
  phone_extension: string
  cell_phone: string
  fax: string
  profile_photo_url: string | null
  linked_in_url: string
  facebook_url: string
  twitter_url: string
  instagram_url: string
  company_id: number
  company_office_id: number
  licenses: BuildoutBrokerLicense[]
  specialties: string[]
  education: string
  memberships_and_associations: string
  custom_fields: Record<string, any>
  can_access_property_edit_form: boolean
  can_have_properties: boolean
  can_make_non_branded_changes_in_documents: boolean
  force_include_on_broker_plugin: boolean
  hide_on_broker_plugin: boolean
  managing_director: boolean
}

/**
 * List Brokers Response
 */
export interface ListBrokersResponse extends BuildoutResponse<BuildoutBroker> {
  brokers: BuildoutBroker[]
  count: number
}

/**
 * Generic HTTP client for Buildout API
 */
class BuildoutApiClient {
  private baseUrl: string

  constructor() {
    if (!BUILDOUT_API_KEY) {
      console.warn('BUILDOUT_API_KEY is not set. Buildout API calls will fail.')
      this.baseUrl = `${BUILDOUT_API_BASE}/`
    } else {
      this.baseUrl = `${BUILDOUT_API_BASE}/${BUILDOUT_API_KEY}`
    }
  }

  /**
   * Generic GET request method
   */
  private async get<T extends BuildoutResponse<any>>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Buildout API error: ${response.status} ${response.statusText}. ${errorText}`
      )
    }

    return response.json()
  }

  /**
   * Find broker ID by email
   * @param email - Broker email address
   * @returns Broker ID if found, null if not found
   * @throws Error if API key is not set or API call fails
   */
  async findBrokerIdByEmail(email: string): Promise<number | null> {
    if (!BUILDOUT_API_KEY) {
      throw new Error('BUILDOUT_API_KEY environment variable is required')
    }

    try {
      const response = await this.get<ListBrokersResponse>('/brokers.json', {
        limit: '1',
        email: email,
      })

      if (response.brokers && response.brokers.length > 0) {
        return response.brokers[0].id
      }

      return null
    } catch (error) {
      console.error('Error fetching broker from Buildout API:', error)
      throw error
    }
  }

  /**
   * Get broker by email (full broker object)
   * @param email - Broker email address
   * @returns Broker object if found, null if not found
   */
  async getBrokerByEmail(email: string): Promise<BuildoutBroker | null> {
    try {
      const response = await this.get<ListBrokersResponse>('/brokers.json', {
        limit: 1,
        email: email,
      })

      if (response.brokers && response.brokers.length > 0) {
        return response.brokers[0]
      }

      return null
    } catch (error) {
      console.error('Error fetching broker from Buildout API:', error)
      throw error
    }
  }
}

// Export singleton instance (lazy initialization)
let _buildoutApiInstance: BuildoutApiClient | null = null

export const buildoutApi = {
  getInstance(): BuildoutApiClient {
    if (!_buildoutApiInstance) {
      _buildoutApiInstance = new BuildoutApiClient()
    }
    return _buildoutApiInstance
  },
  
  async findBrokerIdByEmail(email: string): Promise<number | null> {
    return this.getInstance().findBrokerIdByEmail(email)
  },
  
  async getBrokerByEmail(email: string): Promise<BuildoutBroker | null> {
    return this.getInstance().getBrokerByEmail(email)
  },
}

