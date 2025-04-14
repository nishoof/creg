"use client"

import type React from "react"

import { useState } from "react"
import styles from "./page.module.css"

interface AccordionProps {
  id: string
  title: string
  children: React.ReactNode
}

export default function Accordion({ id, title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`${styles.accordionItem} ${isOpen ? styles.accordionOpen : ""}`}>
      <div className={styles.accordionHeader} onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span className={styles.accordionIcon}>▼</span>
      </div>
      <div className={styles.accordionContent}>{children}</div>
    </div>
  )
}

