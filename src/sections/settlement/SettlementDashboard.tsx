import data from '@/../product/sections/settlement/data.json'
import { SettlementDashboard } from './components/SettlementDashboard'

export default function SettlementDashboardPreview() {
  return (
    <SettlementDashboard
      summary={data.settlementSummary}
      calculatedPayments={data.calculatedPayments}
      purchaseOrders={data.purchaseOrders}
      onMonthChange={(month) => console.log('Month changed:', month)}
      onCalculatePayments={(month) => console.log('Calculate payments for:', month)}
      onGeneratePOs={(vendorIds) => console.log('Generate POs for vendors:', vendorIds)}
      onViewCalculation={(id) => console.log('View calculation:', id)}
      onViewPO={(id) => console.log('View PO:', id)}
      onFilter={(filters) => console.log('Filter:', filters)}
    />
  )
}
