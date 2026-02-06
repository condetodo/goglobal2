import data from '@/../product/sections/assignment/data.json'
import { OrderCreationForm } from './components/OrderCreationForm'

export default function OrderCreationFormPreview() {
  // Filtrar vendors activos y actualizar especializaciones para las 5 etapas
  const vendors = (data.vendors || []).map((vendor: any) => ({
    ...vendor,
    specializations: vendor.specializations.filter((spec: string) =>
      ['adaptación', 'voice recording', 'sound editing', 'subtítulos', 'QA'].includes(spec)
    ),
  }))

  const shows = data.shows || [
    { id: 'show-001', name: 'Dark Secrets', description: 'Serie de suspenso' },
    { id: 'show-002', name: 'City Lights', description: 'Drama urbano' },
    { id: 'show-003', name: 'The Last Journey', description: 'Aventura épica' },
  ]

  return (
    <OrderCreationForm
      vendors={vendors}
      shows={shows}
      onCancel={() => console.log('Cancel creating order')}
      onCreate={(orderData) => {
        console.log('Create order:', orderData)
        const totalVendors = orderData.vendorAssignments.reduce(
          (sum, assignment) => sum + (assignment.vendors?.length || 0),
          0
        )
        alert(
          `Order creada con ${orderData.episodeCount} episodios y ${totalVendors} vendors asignados en ${orderData.vendorAssignments.length} etapas`
        )
      }}
    />
  )
}
