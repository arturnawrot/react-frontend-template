'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'

// No limit on agents per set

interface FeaturedAgentsSet {
  name: string
  agentIds: string[]
}

const FeaturedAgentsSetManager: UIFieldClientComponent = () => {
  const { value: setsValue, setValue: setSetsValue } = useField<FeaturedAgentsSet[]>({
    path: 'sets',
  })
  const [currentSetIndex, setCurrentSetIndex] = useState<number | null>(null)
  const [allAgents, setAllAgents] = useState<Array<{ id: string; fullName: string; cardImage?: any }>>([])
  const [loading, setLoading] = useState(true)

  // Initialize with empty array if needed
  const sets = Array.isArray(setsValue) ? setsValue : []

  // Fetch all agents via REST API (client components can't use Local API)
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents?limit=1000&depth=1', {
          credentials: 'include', // Include cookies for authentication
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Payload REST API returns { docs: [...], totalDocs: number, ... }
        const agents = data?.docs || []
        
        setAllAgents(agents.map((agent: any) => ({
          id: agent.id,
          fullName: agent.fullName || `${agent.firstName} ${agent.lastName}`,
          cardImage: agent.cardImage,
        })))
      } catch (error) {
        console.error('Error fetching agents:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAgents()
  }, [])

  const handleSetSelectionChange = (agentIds: string[]) => {
    if (currentSetIndex === null) return

    const newSets = [...sets]
    newSets[currentSetIndex] = {
      ...newSets[currentSetIndex],
      agentIds, // No limit
    }
    setSetsValue(newSets)
  }

  // Initialize sets if empty and normalize agentIds
  useEffect(() => {
    if (!Array.isArray(setsValue)) {
      setSetsValue([])
    } else {
      // Normalize sets to ensure all have agentIds array
      const normalizedSets = setsValue.map((set) => ({
        ...set,
        agentIds: Array.isArray(set.agentIds) ? set.agentIds : [],
      }))
      
      // Only update if normalization changed anything
      const needsUpdate = normalizedSets.some((set, index) => 
        !Array.isArray(setsValue[index]?.agentIds)
      )
      
      if (needsUpdate) {
        setSetsValue(normalizedSets)
      }
    }
  }, [setsValue, setSetsValue])

  const addNewSet = () => {
    const newSet = {
      name: `Set ${sets.length + 1}`,
      agentIds: [],
    }
    setSetsValue([...sets, newSet])
    setCurrentSetIndex(sets.length)
  }

  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index)
    setSetsValue(newSets)
    if (currentSetIndex === index) {
      setCurrentSetIndex(null)
    } else if (currentSetIndex !== null && currentSetIndex > index) {
      setCurrentSetIndex(currentSetIndex - 1)
    }
  }

  const updateSetName = (index: number, name: string) => {
    const newSets = [...sets]
    newSets[index] = {
      ...newSets[index],
      name,
      agentIds: newSets[index].agentIds || [], // Ensure agentIds is always an array
    }
    setSetsValue(newSets)
  }

  const toggleAgentSelection = (agentId: string) => {
    if (currentSetIndex === null) return

    const currentSet = sets[currentSetIndex]
    const currentAgentIds = currentSet?.agentIds || []
    
    let newAgentIds: string[]
    if (currentAgentIds.includes(agentId)) {
      // Remove agent
      newAgentIds = currentAgentIds.filter((id) => id !== agentId)
    } else {
      // Add agent (no limit)
      newAgentIds = [...currentAgentIds, agentId]
    }
    
    handleSetSelectionChange(newAgentIds)
  }

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading agents...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
          Featured Agents Sets
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
          Create and manage sets of featured agents. Each set can be assigned to agent carousel blocks.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {sets.map((set, index) => (
            <div
              key={index}
              style={{
                border: currentSetIndex === index ? '2px solid #2563eb' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: currentSetIndex === index ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                minWidth: '150px',
              }}
              onClick={() => setCurrentSetIndex(index)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={set.name}
                  onChange={(e) => updateSetName(index, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '16px',
                    fontWeight: '600',
                    flex: 1,
                    outline: 'none',
                    padding: '4px',
                  }}
                  placeholder="Set name"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSet(index)
                  }}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '0 4px',
                  }}
                >
                  ×
                </button>
              </div>
              <p style={{ color: '#6b7280', fontSize: '12px' }}>
                {set.agentIds?.length || 0} agents
              </p>
            </div>
          ))}

          <button
            onClick={addNewSet}
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '12px 24px',
              backgroundColor: '#ffffff',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            + Add New Set
          </button>
        </div>
      </div>

      {currentSetIndex !== null && sets[currentSetIndex] && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Select Agents for "{sets[currentSetIndex].name}"
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '12px',
            maxHeight: '400px',
            overflowY: 'auto',
          }}>
            {allAgents.map((agent) => {
              const isSelected = sets[currentSetIndex].agentIds?.includes(agent.id) || false
              const canSelect = !isSelected
              
              return (
                <div
                  key={agent.id}
                  onClick={() => canSelect || isSelected ? toggleAgentSelection(agent.id) : undefined}
                  style={{
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    cursor: canSelect || isSelected ? 'pointer' : 'not-allowed',
                    opacity: canSelect || isSelected ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e5e7eb',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}>
                    {agent.cardImage && typeof agent.cardImage === 'object' && (
                      <img 
                        src={agent.cardImage.url || agent.cardImage.filename} 
                        alt={agent.fullName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {agent.fullName}
                    </p>
                    {isSelected && (
                      <p style={{ fontSize: '12px', color: '#2563eb', margin: '4px 0 0 0' }}>
                        Selected
                      </p>
                    )}
                  </div>
                  {isSelected && (
                    <span style={{ color: '#2563eb', fontSize: '20px' }}>✓</span>
                  )}
                </div>
              )
            })}
          </div>
          {allAgents.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
              No agents found. Create agents first.
            </p>
          )}
        </div>
      )}

      {currentSetIndex === null && sets.length > 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          Select a set above to manage its agents
        </div>
      )}

      {sets.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          <p style={{ marginBottom: '16px' }}>No sets created yet.</p>
          <button
            onClick={addNewSet}
            style={{
              padding: '12px 24px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Create Your First Set
          </button>
        </div>
      )}
    </div>
  )
}

export default FeaturedAgentsSetManager

