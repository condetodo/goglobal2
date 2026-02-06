import { useState } from 'react'
import data from '@/../product/sections/vendors/data.json'
import { VendorsList } from './components/VendorsList'
import { VendorDetail } from './components/VendorDetail'
import { VendorForm } from './components/VendorForm'
import type { Vendor, WorkHistoryItem } from '@/../product/sections/vendors/types'

type View = 'list' | 'detail' | 'create' | 'edit'

export default function VendorsListPreview() {
  const vendors = data.vendors as Vendor[]
  const workHistory = data.workHistory as Record<string, WorkHistoryItem[]>

  const [currentView, setCurrentView] = useState<View>('list')
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)

  const selectedVendor = selectedVendorId
    ? vendors.find((v) => v.id === selectedVendorId)
    : null

  const selectedWorkHistory = selectedVendorId ? workHistory[selectedVendorId] || [] : []

  if (currentView === 'detail' && selectedVendor) {
    return (
      <VendorDetail
        vendor={selectedVendor}
        workHistory={selectedWorkHistory}
        onEdit={() => {
          setCurrentView('edit')
        }}
        onDelete={() => {
          console.log('Delete vendor:', selectedVendor.id)
          setCurrentView('list')
          setSelectedVendorId(null)
        }}
        onToggleActive={(active) => {
          console.log('Toggle active:', selectedVendor.id, active)
        }}
        onWorkHistoryClick={(assignmentId) => {
          console.log('View assignment:', assignmentId)
        }}
      />
    )
  }

  if (currentView === 'create' || (currentView === 'edit' && selectedVendor)) {
    return (
      <VendorForm
        vendor={currentView === 'edit' ? selectedVendor : null}
        onSubmit={(vendorData) => {
          console.log('Submit vendor:', vendorData)
          setCurrentView('list')
          setSelectedVendorId(null)
        }}
        onCancel={() => {
          setCurrentView('list')
          setSelectedVendorId(null)
        }}
      />
    )
  }

  return (
    <VendorsList
      vendors={vendors}
      onCreate={() => {
        setCurrentView('create')
        setSelectedVendorId(null)
      }}
      onView={(id) => {
        setSelectedVendorId(id)
        setCurrentView('detail')
      }}
      onEdit={(id) => {
        setSelectedVendorId(id)
        setCurrentView('edit')
      }}
      onDelete={(id) => {
        console.log('Delete vendor:', id)
      }}
      onToggleActive={(id, active) => {
        console.log('Toggle active:', id, active)
      }}
      onFilter={(filters) => {
        console.log('Filter vendors:', filters)
      }}
      onSearch={(query) => {
        console.log('Search vendors:', query)
      }}
    />
  )
}

