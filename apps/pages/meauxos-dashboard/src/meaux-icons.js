/**
 * MeauxOS Branded Icon System
 * All icons feature the distinctive "M" monogram
 * 
 * Usage: icons.iconName returns SVG path/elements as a string
 * Include in your HTML: <svg viewBox="0 0 24 24" fill="currentColor">${icons.dashboard}</svg>
 */

const icons = {
    // Dashboard & Navigation
    dashboard: `
        <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" opacity="0.2"/>
        <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" opacity="0.2"/>
        <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" opacity="0.2"/>
        <rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" opacity="0.2"/>
        <text x="7" y="9.5" font-family="Inter, sans-serif" font-weight="800" font-size="5" text-anchor="middle" fill="currentColor">M</text>
        <text x="17" y="9.5" font-family="Inter, sans-serif" font-weight="800" font-size="5" text-anchor="middle" fill="currentColor">M</text>
        <text x="7" y="19.5" font-family="Inter, sans-serif" font-weight="800" font-size="5" text-anchor="middle" fill="currentColor">M</text>
        <text x="17" y="19.5" font-family="Inter, sans-serif" font-weight="800" font-size="5" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Work/Kanban
    work: `
        <rect x="2" y="4" width="6" height="16" rx="1" fill="currentColor" opacity="0.15"/>
        <rect x="9" y="4" width="6" height="16" rx="1" fill="currentColor" opacity="0.15"/>
        <rect x="16" y="4" width="6" height="16" rx="1" fill="currentColor" opacity="0.15"/>
        <text x="5" y="13" font-family="Inter, sans-serif" font-weight="800" font-size="6" text-anchor="middle" fill="currentColor">M</text>
        <text x="12" y="13" font-family="Inter, sans-serif" font-weight="800" font-size="6" text-anchor="middle" fill="currentColor">M</text>
        <text x="19" y="13" font-family="Inter, sans-serif" font-weight="800" font-size="6" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Statistics/Analytics
    stats: `
        <rect x="3" y="18" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.6"/>
        <rect x="7" y="14" width="3" height="8" rx="0.5" fill="currentColor" opacity="0.6"/>
        <rect x="11" y="10" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.6"/>
        <rect x="15" y="6" width="3" height="16" rx="0.5" fill="currentColor" opacity="0.6"/>
        <rect x="19" y="2" width="3" height="20" rx="0.5" fill="currentColor" opacity="0.6"/>
    `,
    
    // Team/Users
    team: `
        <circle cx="9" cy="7" r="4" fill="currentColor" opacity="0.2"/>
        <circle cx="15" cy="7" r="4" fill="currentColor" opacity="0.2"/>
        <path d="M3 21c0-2.5 2-4.5 6-4.5s6 2 6 4.5" fill="currentColor" opacity="0.2"/>
        <path d="M15 21c0-2.5 2-4.5 6-4.5s6 2 6 4.5" fill="currentColor" opacity="0.2"/>
        <text x="9" y="9" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
        <text x="15" y="9" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Document
    doc: `
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="currentColor" opacity="0.15"/>
        <path d="M14 2v6h6" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <text x="12" y="15" font-family="Inter, sans-serif" font-weight="800" font-size="8" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Photo/Image
    photo: `
        <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.15"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" opacity="0.4"/>
        <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <text x="12" y="14" font-family="Inter, sans-serif" font-weight="800" font-size="7" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Gallery/Grid
    gallery: `
        <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.15"/>
        <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.15"/>
        <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.15"/>
        <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.15"/>
        <text x="6.5" y="7.5" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
        <text x="17.5" y="7.5" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
        <text x="6.5" y="18.5" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
        <text x="17.5" y="18.5" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Media/Video
    media: `
        <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" opacity="0.15"/>
        <polygon points="9,9 9,15 15,12" fill="currentColor" opacity="0.6"/>
        <text x="12" y="19" font-family="Inter, sans-serif" font-weight="800" font-size="5" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Cloud
    cloud: `
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor" opacity="0.2"/>
        <text x="12" y="16" font-family="Inter, sans-serif" font-weight="800" font-size="7" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // CAD/3D
    cad: `
        <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.1"/>
        <path d="M12 6 L6 12 L12 18 L18 12 Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.4"/>
    `,
    
    // App/Module
    app: `
        <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" opacity="0.2"/>
        <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" opacity="0.2"/>
        <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" opacity="0.2"/>
        <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" opacity="0.2"/>
        <text x="7" y="8.5" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
        <text x="17" y="8.5" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
        <text x="7" y="18.5" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
        <text x="17" y="18.5" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // AI/Brain
    ai: `
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
        <path d="M12 6 C8 6 6 9 6 12 C6 15 8 18 12 18 C16 18 18 15 18 12 C18 9 16 6 12 6" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4"/>
        <circle cx="9" cy="10" r="1" fill="currentColor"/>
        <circle cx="15" cy="10" r="1" fill="currentColor"/>
        <path d="M9 14 Q12 16 15 14" stroke="currentColor" stroke-width="1" fill="none"/>
    `,
    
    // Code
    code: `
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z" fill="currentColor" opacity="0.6"/>
        <path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor" opacity="0.6"/>
        <text x="12" y="14" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Payment/Card
    payment: `
        <rect x="3" y="4" width="18" height="16" rx="2" fill="currentColor" opacity="0.15"/>
        <rect x="3" y="8" width="18" height="3" fill="currentColor" opacity="0.3"/>
        <text x="12" y="16" font-family="Inter, sans-serif" font-weight="800" font-size="6" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Auth/Shield
    auth: `
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor" opacity="0.2"/>
        <text x="12" y="15" font-family="Inter, sans-serif" font-weight="800" font-size="7" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Integration/Connect
    integration: `
        <rect x="8" y="3" width="8" height="6" rx="1" fill="currentColor" opacity="0.2"/>
        <rect x="8" y="15" width="8" height="6" rx="1" fill="currentColor" opacity="0.2"/>
        <line x1="12" y1="9" x2="12" y2="15" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
    `,
    
    // Settings/Cog
    settings: `
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/>
        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <text x="12" y="14" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Terminal/Console
    terminal: `
        <rect x="3" y="4" width="18" height="16" rx="2" fill="currentColor" opacity="0.15"/>
        <path d="M7 9l3 3-3 3" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="12" y1="15" x2="17" y2="15" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Database
    database: `
        <ellipse cx="12" cy="6" rx="8" ry="3" fill="currentColor" opacity="0.2"/>
        <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" fill="currentColor" opacity="0.15"/>
        <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3V12" fill="currentColor" opacity="0.1"/>
    `,
    
    // Storage/Box
    storage: `
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.2"/>
        <path d="M2 7v10l10 5 10-5V7" fill="currentColor" opacity="0.1"/>
        <text x="12" y="14" font-family="Inter, sans-serif" font-weight="800" font-size="6" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Lightning/Fast
    lightning: `
        <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" fill="currentColor" opacity="0.3"/>
        <text x="12" y="15" font-family="Inter, sans-serif" font-weight="800" font-size="5" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Search
    search: `
        <circle cx="11" cy="11" r="8" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="2"/>
        <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
        <text x="11" y="13" font-family="Inter, sans-serif" font-weight="800" font-size="6" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Menu/Hamburger
    menu: `
        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/>
        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2"/>
        <text x="12" y="13" font-family="Inter, sans-serif" font-weight="800" font-size="4" text-anchor="middle" fill="currentColor" opacity="0.3">M</text>
    `,
    
    // Close/X
    close: `
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
        <path d="M15 9l-6 6m0-6l6 6" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Check/Success
    check: `
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
    `,
    
    // Warning/Alert
    warning: `
        <path d="M12 2L2 22h20L12 2z" fill="currentColor" opacity="0.15"/>
        <line x1="12" y1="9" x2="12" y2="14" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="18" r="1" fill="currentColor"/>
    `,
    
    // Error
    error: `
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
        <path d="M15 9l-6 6m0-6l6 6" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Info
    info: `
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
        <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="8" r="1" fill="currentColor"/>
    `,
    
    // Download
    download: `
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Upload
    upload: `
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M17 8l-5-5-5 5" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Refresh/Sync
    refresh: `
        <path d="M23 4v6h-6" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M1 20v-6h6" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" fill="none"/>
    `,
    
    // Plus/Add
    plus: `
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2"/>
        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Minus/Remove
    minus: `
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2"/>
    `,
    
    // External Link
    externalLink: `
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M15 3h6v6" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Copy
    copy: `
        <rect x="9" y="9" width="13" height="13" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2" fill="none"/>
    `,
    
    // Edit/Pencil
    edit: `
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Trash/Delete
    trash: `
        <path d="M3 6h18" stroke="currentColor" stroke-width="2"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="2"/>
        <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Star/Favorite
    star: `
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Heart/Like
    heart: `
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Send/Share
    send: `
        <path d="M22 2L11 13" stroke="currentColor" stroke-width="2"/>
        <path d="M22 2l-7 20-4-9-9-4 20-7z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Chat/Message
    chat: `
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
        <text x="12" y="12" font-family="Inter, sans-serif" font-weight="800" font-size="6" text-anchor="middle" fill="currentColor">M</text>
    `,
    
    // Bell/Notification
    bell: `
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
        <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Calendar
    calendar: `
        <rect x="3" y="4" width="18" height="18" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Clock/Time
    clock: `
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
        <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Location/Pin
    location: `
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="10" r="3" fill="currentColor" opacity="0.3"/>
    `,
    
    // User/Profile
    user: `
        <circle cx="12" cy="7" r="4" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Lock/Security
    lock: `
        <rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
    `,
    
    // Unlock
    unlock: `
        <rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
        <path d="M7 11V7a5 5 0 019.9-1" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
    `,
    
    // Eye/View
    eye: `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="2"/>
    `,
    
    // EyeOff/Hide
    eyeOff: `
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Filter
    filter: `
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Sort
    sort: `
        <line x1="4" y1="6" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
        <line x1="4" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="4" y1="18" x2="8" y2="18" stroke="currentColor" stroke-width="2"/>
        <path d="M16 12l4 6h-8l4-6z" fill="currentColor" opacity="0.2"/>
    `,
    
    // Globe/World
    globe: `
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
        <path d="M2 12h20" stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" stroke-width="1.5" fill="none"/>
    `,
    
    // Link/Chain
    link: `
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" fill="none"/>
    `,
    
    // Wifi
    wifi: `
        <path d="M5 12.55a11 11 0 0114.08 0" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M1.42 9a16 16 0 0121.16 0" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M8.53 16.11a6 6 0 016.95 0" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="12" cy="20" r="1" fill="currentColor"/>
    `,
    
    // Power
    power: `
        <path d="M18.36 6.64a9 9 0 11-12.73 0" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="12" y1="2" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Layers
    layers: `
        <polygon points="12,2 2,7 12,12 22,7" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
        <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
    `,
    
    // Zap/Bolt
    zap: `
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Sun
    sun: `
        <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/>
        <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"/>
    `,
    
    // Moon
    moon: `
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
    `,
    
    // MeauxOS Logo
    meauxos: `
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor" opacity="0.2"/>
        <text x="12" y="15" font-family="Inter, sans-serif" font-weight="900" font-size="10" text-anchor="middle" fill="currentColor">M</text>
    `
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = icons;
}

// Global availability
window.meauxIcons = icons;
