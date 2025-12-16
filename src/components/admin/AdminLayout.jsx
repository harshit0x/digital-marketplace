import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { isAdmin } from '../../services/adminService'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const [checkingAdmin, setCheckingAdmin] = useState(true)
    const [isAdminUser, setIsAdminUser] = useState(false)

    useEffect(() => {
        const checkAdmin = async () => {
            if (isAuthenticated) {
                const adminStatus = await isAdmin()
                setIsAdminUser(adminStatus)
            }
            setCheckingAdmin(false)
        }

        if (!authLoading) {
            checkAdmin()
        }
    }, [isAuthenticated, authLoading])

    if (authLoading || checkingAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />
    }

    if (!isAdminUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-500">You don't have permission to access the admin panel.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="ml-64 pt-16 p-8">
                <Outlet />
            </main>
        </div>
    )
}
