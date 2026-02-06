import { useState } from 'react'
import data from '@/../product/sections/rates/data.json'
import { RatesTable } from './components/RatesTable'
import { RateDetail } from './components/RateDetail'
import { RateForm } from './components/RateForm'
import type { Rate } from '@/../product/sections/rates/types'

type View = 'table' | 'detail' | 'create' | 'edit'

export default function RatesTablePreview() {
  const rates = data.rates as Rate[]

  const [currentView, setCurrentView] = useState<View>('table')
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null)

  const selectedRate = selectedRateId ? rates.find((r) => r.id === selectedRateId) : null

  if (currentView === 'detail' && selectedRate) {
    return (
      <RateDetail
        rate={selectedRate}
        onEdit={() => {
          setCurrentView('edit')
        }}
        onDelete={() => {
          console.log('Delete rate:', selectedRate.id)
          setCurrentView('table')
          setSelectedRateId(null)
        }}
      />
    )
  }

  if (currentView === 'create' || (currentView === 'edit' && selectedRate)) {
    return (
      <RateForm
        rate={currentView === 'edit' ? selectedRate : null}
        onSubmit={(rateData) => {
          console.log('Submit rate:', rateData)
          setCurrentView('table')
          setSelectedRateId(null)
        }}
        onCancel={() => {
          setCurrentView('table')
          setSelectedRateId(null)
        }}
      />
    )
  }

  return (
    <RatesTable
      rates={rates}
      onCreate={() => {
        setCurrentView('create')
        setSelectedRateId(null)
      }}
      onView={(id) => {
        setSelectedRateId(id)
        setCurrentView('detail')
      }}
      onEdit={(id) => {
        setSelectedRateId(id)
        setCurrentView('edit')
      }}
      onDelete={(id) => {
        console.log('Delete rate:', id)
      }}
      onCellEdit={(rateId, rangeKey, bonusType, value) => {
        console.log('Edit cell:', rateId, rangeKey, bonusType, value)
      }}
    />
  )
}

