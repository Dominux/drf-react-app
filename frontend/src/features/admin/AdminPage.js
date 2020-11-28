import React from 'react'
import { useFetchUsers } from './redux/hooks'

export default function AdminPage() {
  const { usersList, fetchUsers, fetchUsersError, fetchUsersPending } = useFetchUsers()

  return (
    <div className="admin-admin-page">
      <button disabled={fetchUsersPending} onClick={fetchUsers}>
        {fetchUsersPending ? 'Загрузка...' : 'Загрузить список пользователей'}
      </button>
      {fetchUsersError && <div>Failed to load: {fetchUsersError.toString()}</div>}
      {usersList.length > 0 ? (
        <ul>
          {usersList.map(item => (
            <li key={item.id}>{item.username}</li>
          ))}
        </ul>
      ) : (
        <div>Пользователей не найдено</div>
      )}
    </div>
  )
}
