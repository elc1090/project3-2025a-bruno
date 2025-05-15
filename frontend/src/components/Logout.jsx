import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logout({ onLogout }) {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem('loggedIn')
    onLogout()
    navigate('/login', { replace: true })
  }, [])

  return null
}
