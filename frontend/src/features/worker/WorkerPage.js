import React from 'react'
import { useFetchRequests } from './redux/hooks'

export default function WorkerPage() {
  const {
    requestsList,
    fetchRequests,
    fetchRequestsPending,
    fetchRequestsError,
  } = useFetchRequests()

  return (
    <div className="worker-worker-page">
      <button disabled={fetchRequestsPending} onClick={fetchRequests}>
        {fetchRequestsPending ? 'Загрузка...' : 'Загрузить список запросов'}
      </button>
      {fetchRequestsError && (
        <div className="fetch-list-error">Failed to load: {fetchRequestsError.toString()}</div>
      )}
      {requestsList.length > 0 ? (
        <ul className="examples-reddit-list">
          {requestsList.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      ) : (
        <div className="no-items-tip">No items yet.</div>
      )}
    </div>
  )
}
