import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

export default function Navbar() {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [user, setUser] = useState(null);

    // Ref to track the avatar and dropdown container
    const menuRef = useRef(null);

    useEffect(() => {
        fetch('/api/user/profile')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data) setUser(data);
            })
            .catch((err) => console.error('Error fetching user profile:', err));
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Helper to extract uppercase initials (e.g., "John Smith" -> "JS")
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const displayName = user?.shortName || user?.name || 'Student';
    const initials = getInitials(displayName);

    return (
        <header className="nav-header">
            <div className="brand-group">
                <div className="logo-badge">📑</div>
                <span className="app-name">Desk</span>
            </div>

            <div className="banner-container">
                <span className="banner-text">Welcome back, <strong>{displayName}</strong></span>
            </div>

            <div className="actions-group">
                <div className="avatar-container" ref={menuRef}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="avatar-button"
                        style={
                            user?.avatarUrl
                                ? {
                                    backgroundImage: `url(${user.avatarUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }
                                : {}
                        }
                    >
                        {!user?.avatarUrl && <span>{initials}</span>}
                    </button>

                    {showProfileMenu && (
                        <div className="dropdown-menu">
                            {user?.primaryEmail && (
                                <>
                                    <div
                                        className="dropdown-item"
                                        style={{ fontSize: '0.75rem', color: '#64748b', cursor: 'default' }}
                                    >
                                        {user.primaryEmail}
                                    </div>
                                    <hr className="dropdown-divider" />
                                </>
                            )}
                            <div className="dropdown-item">Preferences (Currently Unavailable)</div>
                            <hr className="dropdown-divider" />
                            <div className="dropdown-item danger">Disconnect  (Currently Unavailable)</div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}