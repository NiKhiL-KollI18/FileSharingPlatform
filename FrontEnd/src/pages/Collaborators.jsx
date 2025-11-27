import { useState, useEffect } from 'react';
import '../styles/Collaborators.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faUserMinus, faUserCircle } from '@fortawesome/free-solid-svg-icons';

// Assuming user data structure { id, username, email }
const MOCK_COLLABORATORS = [
    { id: 101, username: 'alex.smith', email: 'alex@example.com', status: 'Added' },
    { id: 102, username: 'gemini_dev', email: 'gemini@dev.com', status: 'Pending' },
];

const Collaborators = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [collaborators, setCollaborators] = useState(MOCK_COLLABORATORS);
    const [statusMessage, setStatusMessage] = useState('');

    const handleSearch = async () => {
        if (!searchTerm) return;
        setLoading(true);
        setStatusMessage('');
        
        // --- MOCK SEARCH LOGIC ---
        // Simulating an API call delay
        await new Promise(r => setTimeout(r, 800));
        
        const mockResult = [
            { id: 201, username: searchTerm, email: `${searchTerm}@domain.com` }
        ].filter(() => !collaborators.some(c => c.username === searchTerm));

        setSearchResults(mockResult);
        if (mockResult.length === 0) {
             setStatusMessage(`No new users found matching "${searchTerm}". (Mocked Response)`);
        } else {
             setStatusMessage('');
        }
        setLoading(false);
    };

    const handleAddCollaborator = (user) => {
        // Mocking the successful addition of a collaborator
        setCollaborators([...collaborators, { ...user, status: 'Added' }]);
        setSearchResults([]);
        setSearchTerm('');
        alert(`User ${user.username} added to your circle! (Mocked Action)`);
    };

    const handleRemoveCollaborator = (id) => {
        // Mocking the removal of a collaborator
        setCollaborators(collaborators.filter(c => c.id !== id));
        alert('Collaborator removed. (Mocked Action)');
    };

    return (
        <div className="collaborators-page">
            <h2>👥 Collaboration Circle</h2>
            <p className="description">Manage users you frequently share files with. Adding a user here allows for direct file transfer within StackDeck.</p>
            
            {/* Search Section */}
            <div className="search-box">
                <input 
                    type="text"
                    placeholder="Search users by username or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} disabled={loading || !searchTerm}>
                    <FontAwesomeIcon icon={faSearch} />
                    {loading ? ' Searching...' : ' Search'}
                </button>
            </div>
            
            {statusMessage && <p className="status-message">{statusMessage}</p>}

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="search-results">
                    <h3>Search Results</h3>
                    <ul>
                        {searchResults.map(user => (
                            <li key={user.id}>
                                <FontAwesomeIcon icon={faUserCircle} />
                                <span>{user.username} ({user.email})</span>
                                <button onClick={() => handleAddCollaborator(user)}>
                                    <FontAwesomeIcon icon={faUserPlus} /> Add
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Collaborator List */}
            <div className="collaborators-list">
                <h3>Your Current Collaborators</h3>
                <ul>
                    {collaborators.map(collab => (
                        <li key={collab.id} className={collab.status === 'Pending' ? 'pending' : ''}>
                            <FontAwesomeIcon icon={faUserCircle} />
                            <div>
                                <span>{collab.username}</span>
                                <span className="status">{collab.status === 'Pending' ? 'Invitation Pending' : 'Added'}</span>
                            </div>
                            <button 
                                onClick={() => handleRemoveCollaborator(collab.id)}
                                className="remove-btn"
                            >
                                <FontAwesomeIcon icon={faUserMinus} /> Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Collaborators;