import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import LenisProvider from './components/LenisProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import MobileNav from './components/layout/MobileNav'

// Public Pages
import HomePage from './pages/HomePage'
import BrowseListingsPage from './pages/BrowseListingsPage'
import ListingDetailPage from './pages/ListingDetailPage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'

// Protected Pages
import CreateListingPage from './pages/CreateListingPage'
import DashboardPage from './pages/DashboardPage'
import MessagesPage from './pages/MessagesPage'
import CheckoutPage from './pages/CheckoutPage'

// Admin Pages
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminVerify from './pages/admin/AdminVerify'
import AdminListings from './pages/admin/AdminListings'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminWithdrawals from './pages/admin/AdminWithdrawals'

function App() {
    return (
        <Router>
            <LenisProvider>
                <AuthProvider>
                    <NotificationProvider>
                        <Routes>
                            {/* Admin Routes - No Navbar */}
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="verify" element={<AdminVerify />} />
                                <Route path="listings" element={<AdminListings />} />
                                <Route path="users" element={<AdminUsers />} />
                                <Route path="transactions" element={<AdminTransactions />} />
                                <Route path="withdrawals" element={<AdminWithdrawals />} />
                            </Route>

                            {/* Main App Routes */}
                            <Route path="/*" element={
                                <div className="min-h-screen bg-white">
                                    <Navbar />
                                    <main className="pb-20 md:pb-0">
                                        <AnimatePresence mode="wait">
                                            <Routes>
                                                {/* Public Routes */}
                                                <Route path="/" element={<HomePage />} />
                                                <Route path="/browse" element={<BrowseListingsPage />} />
                                                <Route path="/listing/:id" element={<ListingDetailPage />} />
                                                <Route path="/auth" element={<AuthPage />} />
                                                <Route path="/profile/:id" element={<ProfilePage />} />

                                                {/* Protected Routes */}
                                                <Route path="/dashboard" element={
                                                    <ProtectedRoute>
                                                        <DashboardPage />
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="/create" element={
                                                    <ProtectedRoute>
                                                        <CreateListingPage />
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="/messages" element={
                                                    <ProtectedRoute>
                                                        <MessagesPage />
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="/checkout/:orderId" element={
                                                    <ProtectedRoute>
                                                        <CheckoutPage />
                                                    </ProtectedRoute>
                                                } />
                                            </Routes>
                                        </AnimatePresence>
                                    </main>
                                    <MobileNav />
                                </div>
                            } />
                        </Routes>
                    </NotificationProvider>
                </AuthProvider>
            </LenisProvider>
        </Router>
    )
}

export default App
