import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import MyStorage from './pages/MyStorage'
import SharedFiles from './pages/SharedFiles'
import TeamStorage from './pages/TeamStorage'
import Favorites from './pages/Favorites'
import Recents from './pages/Recents'
import Trash from './pages/Trash'
import FilePreview from './pages/FilePreview'
import Settings from './pages/Settings'
import SignIn from './pages/SignIn'
import './styles/App.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

function App() {

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    useEffect(() => {
        // Check for user AND token to consider them logged in
        const user = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (user && token) {
            setIsAuthenticated(true)
        }
    }, [])

    // UPDATED: Now accepts token as the second argument
    const handleSignIn = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData))

        if (token) {
            localStorage.setItem('token', token)
        }

        setIsAuthenticated(true)
    }

    const handleSignOut = () => {
        // Clear everything
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setIsAuthenticated(false)
    }

    if (!isAuthenticated) {
        return <SignIn onSignIn={handleSignIn} />
    }

    return (
        <div className="app">
            <Sidebar collapsed={sidebarCollapsed} />
            <div className={`page-container ${sidebarCollapsed ? 'expanded' : ''}`}>
                <Header toggleSidebar={toggleSidebar} onSignOut={handleSignOut} />
                <div className="page-container">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/my-storage" element={<MyStorage />} />
                        <Route path="/recents" element={<Recents />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/trash" element={<Trash />} />
                        <Route path="/shared-files" element={<SharedFiles />} />
                        <Route path="/team-storage" element={<TeamStorage />} />
                        <Route path="/preview/:fileId" element={<FilePreview />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/signin" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default App