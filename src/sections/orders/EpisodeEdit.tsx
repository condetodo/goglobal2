import data from '@/../product/sections/orders/data.json'
import { EpisodeEdit } from './components/EpisodeEdit'
import type { Order, Episode } from '@/../product/sections/orders/types'

export default function EpisodeEditPreview() {
  // Use the first order and first episode for preview
  const order = data.orders[0] as Order
  const episode =
    (data.episodes as Episode[]).find((ep) => ep.orderId === order.id) ||
    (data.episodes[0] as Episode)

  return (
    <EpisodeEdit
      episode={episode}
      order={order}
      onSave={(episode) => console.log('Save episode:', episode)}
      onCancel={() => console.log('Cancel editing')}
      onAddVendor={(episodeId, vendor) => console.log('Add vendor:', episodeId, vendor)}
      onRemoveVendor={(episodeId, vendorId, phase) =>
        console.log('Remove vendor:', episodeId, vendorId, phase)
      }
      onUpdateMinutes={(episodeId, vendorId, phase, minutes) =>
        console.log('Update minutes:', episodeId, vendorId, phase, minutes)
      }
    />
  )
}

