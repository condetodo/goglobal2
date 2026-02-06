import data from '@/../product/sections/orders/data.json'
import { OrderDetail } from './components/OrderDetail'
import type { Order, Episode } from '@/../product/sections/orders/types'

export default function OrderDetailPreview() {
  // Use the first order and its episodes for preview
  const order = data.orders[0] as Order
  const episodes = (data.episodes as Episode[]).filter((ep) => ep.orderId === order.id)

  return (
    <OrderDetail
      order={order}
      episodes={episodes}
      onEdit={(id) => console.log('Edit order:', id)}
      onDelete={(id) => console.log('Delete order:', id)}
      onAddEpisode={(id) => console.log('Add episode to order:', id)}
      onStatusChange={(id, status) => console.log('Change order status:', id, status)}
      onEpisodeClick={(id) => console.log('View/edit episode:', id)}
    />
  )
}

