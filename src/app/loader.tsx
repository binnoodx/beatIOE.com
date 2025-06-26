'use client'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import 'nprogress/nprogress.css'

export default function Loading() {
  useEffect(() => {
    NProgress.start()
    return () => {
      NProgress.done()
    }
  }, [])

  return null
}
