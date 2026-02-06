import data from '@/../product/sections/orders/data.json'
import { OrdersList } from './components/OrdersList'
import type { Order, Episode } from '@/../product/sections/orders/types'

export default function OrdersListPreview() {
  return (
    <OrdersList
      orders={data.orders as Order[]}
      episodes={data.episodes as Episode[]}
      onView={(id) => console.log('View order:', id)}
      onEdit={(id) => console.log('Edit order:', id)}
      onDelete={(id) => console.log('Delete order:', id)}
      onCreate={() => console.log('Create new order')}
      onFilter={(filters) => console.log('Filter orders:', filters)}
      onSearch={(query) => console.log('Search orders:', query)}
    />
  )
}

