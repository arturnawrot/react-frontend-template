import React from 'react'
import ResponsiveText from '@/components/ResponsiveText'
import ComingSoonForm from './ComingSoonForm'
import styles from './ComingSoon.module.scss'

interface Office {
  city: string
  address: string
  phone?: string | null
}

interface ComingSoonBlock {
  blockType: 'comingSoon'
  heading: string
  headingLine2: string
  subheading: string
  formHeader: string
  formPlaceholder?: string | null
  formButtonText?: string | null
  offices?: Office[] | null
  copyrightText?: string | null
}

interface ComingSoonProps {
  block: ComingSoonBlock
}

export default function ComingSoon({ block }: ComingSoonProps) {
  const textColor = 'rgba(250, 249, 247, 1)'
  const secondaryTextColor = '#faf9f78c'

  return (
    <div className={styles.container}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img 
          src="/img/single-m-green-logo.png" 
          alt="Meybohm" 
          className={styles.logo}
        />
      </div>

      <div className="max-w-[885px]">
        

        {/* Heading */}
        <ResponsiveText
            as="h1"
            desktop="70px"
            mobile="32px"
            desktopLineHeight="96px"
            mobileLineHeight="32px"
            fontFamily="Copernicus New Cond Trial"
            fontWeight={300}
            color={textColor}
            align="center"
            letterSpacing="0"
            className={styles.heading}
        >
            {block.heading}
        </ResponsiveText>

        <ResponsiveText
            as="h2"
            desktop="70px"
            mobile="32px"
            desktopLineHeight="96px"
            mobileLineHeight="32px"
            fontFamily="Copernicus New Cond Trial"
            fontWeight={300}
            color={textColor}
            align="center"
            letterSpacing="0"
            className={styles.headingLine2}
        >
            {block.headingLine2}
        </ResponsiveText>

        {/* Subheading */}
        <ResponsiveText
            as="p"
            desktop="27px"
            mobile="16px"
            desktopLineHeight="32px"
            mobileLineHeight="20px"
            fontFamily="GT America Condensed"
            fontWeight={500}
            fontWeightMobile={400}
            color={textColor}
            align="center"
            letterSpacing="0"
            className={styles.subheading}
        >
            {block.subheading}
        </ResponsiveText>

        {/* Form Header */}
        <ResponsiveText
            as="p"
            desktop="36px"
            mobile="20px"
            desktopLineHeight="64px"
            mobileLineHeight="70px"
            fontFamily="GT America Condensed"
            fontWeight={500}
            color={textColor}
            align="center"
            letterSpacing="0"
            className={styles.formHeader}
        >
            {block.formHeader}
        </ResponsiveText>



    </div>

        {/* Email Form (Client Component) */}
        <ComingSoonForm 
        placeholder={block.formPlaceholder || undefined}
        buttonText={block.formButtonText || undefined}
        />


      {/* Office Locations */}
      {block.offices && block.offices.length > 0 && (
        <div className={styles.officesContainer}>
          {block.offices.map((office, index) => (
            <div key={index} className={styles.office}>
              <ResponsiveText
                as="p"
                desktop="22px"
                mobile="14px"
                fontFamily="GT America Condensed"
                fontWeight={400}
                color={secondaryTextColor}
                align="center"
                className={styles.officeCity}
              >
                {office.city}
              </ResponsiveText>
              <ResponsiveText
                as="p"
                desktop="22px"
                mobile="14px"
                fontFamily="GT America Condensed"
                fontWeight={400}
                color={secondaryTextColor}
                align="center"
                className={styles.officeAddress}
              >
                {office.address}
              </ResponsiveText>
              {office.phone && (
                <ResponsiveText
                  as="p"
                  desktop="22px"
                  mobile="14px"
                  fontFamily="GT America Condensed"
                  fontWeight={400}
                  color={secondaryTextColor}
                  align="center"
                  className={styles.officePhone}
                >
                  {office.phone}
                </ResponsiveText>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <ResponsiveText
          as="p"
          desktop="16px"
          mobile="13px"
          fontFamily="GT America Condensed"
          fontWeight={400}
          color={secondaryTextColor}
          align="center"
        >
          {block.copyrightText || '© 2025 Meybohm. All rights reserved.'}
        </ResponsiveText>
      </div>
    </div>
  )
}
