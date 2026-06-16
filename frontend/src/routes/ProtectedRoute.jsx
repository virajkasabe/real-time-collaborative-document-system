import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ 
  children 
}) {
  const { user, loading } = useAuth()
  
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#F8FAFF]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full"/>
        <p className="text-sm text-[#64748B]">
          Loading...
        </p>
      </div>
    </div>
  )
  
  if (!user) return (
    <Navigate to="/login" replace />
  )
  
  return children
}
