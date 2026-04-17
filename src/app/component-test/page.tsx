import React from 'react'
import { CurrencyIllustration } from '@/components/ui/illustrations/currency-illustration2'
import { FlowIllustration } from '@/components/illustrations/flow'

function ComponentTest() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12 p-8">
      <CurrencyIllustration />
      <FlowIllustration />
    </div>
  )
}

export default ComponentTest