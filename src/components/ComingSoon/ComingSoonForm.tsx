'use client'

import React, { useState, FormEvent } from 'react'
import styles from './ComingSoon.module.scss'

interface ComingSoonFormProps {
  placeholder?: string
  buttonText?: string
}

export default function ComingSoonForm({ placeholder, buttonText }: ComingSoonFormProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      // TODO: Replace with actual newsletter signup endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting email:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <p className={styles.successMessage}>
        Thank you! We&apos;ll notify you when we go live.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder || 'Enter your email'}
        required
        className={styles.input}
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.button}
      >
        {isSubmitting ? '...' : (buttonText || 'Notify Me')}
      </button>
    </form>
  )
}
