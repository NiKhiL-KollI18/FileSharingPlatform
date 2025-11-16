import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFileAlt, faFolder, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import '../styles/Dashboard.css';
import { getFiles } from '../api';

const Dashboard = () => {
    const [categories, setCategories] = useState([
        { id: 'images', title: 'Image', icon: faImage, count: 0, used: 0, total: 100, color: '#2eaae3', bgColor: 'rgb(200,247,255)' },
        { id: 'videos', title: 'Video', icon: faVideo, count: 0, used: 0, total: 100, color: '#ff8c43', bgColor: 'rgb(255,221,200)' },
        { id: 'documents', title: 'Document', icon: faFileAlt, count: 0, used: 0, total: 100, color: '#0aff3e', bgColor: 'rgb(189,246,168)' },
        { id: 'others', title: 'Others', icon: faFolder, count: 0, used: 0, total: 100, color: '#ffd400', bgColor: 'rgb(255,255,205)' },
    ]);
    const [recentFiles, setRecentFiles] = useState([]);
    const [suggestedFiles, setSuggestedFiles] = useState([]);

    useEffect(() => {
        const loadFiles = async () => {
            try {
                const allFiles = await getFiles();
                if (!allFiles) return;

                // Update categories
                const newCategories = categories.map(cat => {
                    const filesInCat = allFiles.filter(f => {
                        // Use f.fileType instead of f.type
                        if (cat.id === 'images') return f.fileType.startsWith('image/');
                        if (cat.id === 'videos') return f.fileType.startsWith('video/');
                        if (cat.id === 'documents') return f.fileType.startsWith('application/');
                        return !['image/', 'video/', 'application/'].some(t => f.fileType.startsWith(t));
                    });
                    const totalSize = filesInCat.reduce((acc, f) => acc + f.size, 0);
                    const usedGB = Math.round((totalSize / (1024 * 1024 * 1024)) * 100) / 100;
                    return { ...cat, count: filesInCat.length, used: usedGB };
                });
                setCategories(newCategories);

                // Recent files - Sorting by ID as a proxy for recency.
                const sorted = [...allFiles].sort((a, b) => b.id - a.id);
                setRecentFiles(sorted.slice(0, 5));

                // Suggested files
                const shuffled = [...allFiles].sort(() => 0.5 - Math.random());
                setSuggestedFiles(shuffled.slice(0, 4));
            } catch (err) {
                console.error('Error loading files:', err);
            }
        };

        loadFiles();
        window.addEventListener('storage', loadFiles);
        return () => window.removeEventListener('storage', loadFiles);
    }, [categories]); // Added 'categories' to dependency array for clarity

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) return faImage;
        if (fileType.startsWith('video/')) return faVideo;
        if (fileType.startsWith('application/')) return faFileAlt;
        return faFolder; // Default icon for other types
    };

    return (
        <div className="dashboard">
            <section className="overview-section">
                <h2>Overview Storage</h2>
                <div className="storage-categories">
                    {categories.map(cat => (
                        <div className="category-card" key={cat.id}>
                            <div className="category-icon" style={{ backgroundColor: cat.bgColor, color: cat.color }}>
                                <FontAwesomeIcon icon={cat.icon} />
                            </div>
                            <div className="category-info">
                                <h3>{cat.title}</h3>
                                <p>{cat.count} items</p>
                            </div>
                            <div className="category-storage">
                                <div className="storage-bar">
                                    <div className="storage-used" style={{ width: `${(cat.used / cat.total) * 100}%`, backgroundColor: cat.color }}></div>
                                </div>
                                <p>{cat.used} GB of {cat.total} GB</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <hr />

            <section className="suggested-section">
                <h2>Suggested Files</h2>
                <div className="suggested-files">
                    {suggestedFiles.map(f => (
                        <div className="suggested-file-card">
                        <div className="suggested-file" key={f.id}>
                            <div className="file-thumbnail"><FontAwesomeIcon icon={getFileIcon(f.fileType)} /></div>
                            <p>{f.filename}</p>
                        </div>
                        </div>
                    ))}
            </div>
            </section>

            <hr />

            <section className="recent-section">
                <h2>Recent Files</h2>
                <div className="recent-files">
                    {recentFiles.map(f => (
                        <div className="recent-file" key={f.id}>
                            <div className="recent-icon"> <FontAwesomeIcon icon={getFileIcon(f.fileType)} /> </div>
                            <p>{f.filename}</p>
                            <span>{formatFileSize(f.size)}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;