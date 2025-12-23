'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const BuildoutBrokerIdField: TextFieldClientComponent = (props) => {
  const { field, path, value: valueProp } = props
  
  // Use useField hook to get the setValue function and current value
  const { value: fieldValue, setValue: setFieldValue } = useField<string>({
    path,
  })

  // Use prop value if available, otherwise use field value from hook
  const currentValue = valueProp ?? fieldValue ?? ''
  const setValue = setFieldValue

  const [email, setEmail] = useState<string>('')
  const [brokerId, setBrokerId] = useState<string | number | null>(currentValue || null)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Sync brokerId with field value
  useEffect(() => {
    if (currentValue && currentValue !== brokerId) {
      setBrokerId(currentValue)
    }
  }, [currentValue])

  // Update field value when brokerId changes
  useEffect(() => {
    if (brokerId !== null && brokerId !== currentValue) {
      setValue(brokerId as string)
    }
  }, [brokerId, setValue, currentValue])

  const validateEmail = async (emailToValidate: string) => {
    if (!emailToValidate || !emailToValidate.includes('@')) {
      setError('Please enter a valid email address')
      setBrokerId(null)
      if (setValue) {
        setValue('')
      }
      setSuccess(false)
      return
    }

    setIsValidating(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/buildout/validate-broker-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToValidate }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate email')
      }

      if (data.brokerId) {
        const brokerIdString = data.brokerId.toString()
        setBrokerId(brokerIdString)
        if (setValue) {
          setValue(brokerIdString)
        }
        setSuccess(true)
        setError(null)
      } else {
        setError('No broker found with this email address')
        setBrokerId(null)
        if (setValue) {
          setValue('')
        }
        setSuccess(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while validating email'
      setError(errorMessage)
      setBrokerId(null)
      if (setValue) {
        setValue('')
      }
      setSuccess(false)
    } finally {
      setIsValidating(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    setSuccess(false)
    setError(null)
  }

  const handleEmailBlur = () => {
    if (email.trim()) {
      validateEmail(email.trim())
    }
  }

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (email.trim()) {
        validateEmail(email.trim())
      }
    }
  }

  return (
    <div className="field-type buildout-broker-id-field">
      <div className="field-label">
        <label htmlFor={`field-${path}`}>{field.label || 'Buildout Broker ID'}</label>
        {field.admin?.description && (
          <div className="field-description">{field.admin.description}</div>
        )}
      </div>

      <div className="field-input">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <input
              id={`field-${path}`}
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              onKeyDown={handleEmailKeyDown}
              placeholder="Enter broker email (e.g., mrogers@meybohm.com)"
              disabled={isValidating}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: error ? '1px solid #dc2626' : success ? '1px solid #16a34a' : '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
            {isValidating && (
              <span style={{ padding: '8px', color: '#6b7280' }}>Validating...</span>
            )}
          </div>

          {error && (
            <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{error}</div>
          )}

          {success && brokerId && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ color: '#16a34a', fontSize: '12px' }}>
                ✓ Broker found! Broker ID: <strong>{brokerId}</strong>
              </div>
              <input
                type="hidden"
                value={brokerId}
                readOnly
              />
            </div>
          )}

          {brokerId && !success && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Current Broker ID: <strong>{brokerId}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuildoutBrokerIdField

