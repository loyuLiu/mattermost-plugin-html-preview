import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';

const HtmlPreviewAttachment = ({fileInfo, theme, postId}) => {
    const [htmlContent, setHtmlContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const isHtmlFile = useCallback(() => {
        if (!fileInfo) return false;
        return fileInfo.mime_type === 'text/html' || 
               (fileInfo.name && fileInfo.name.toLowerCase().endsWith('.html'));
    }, [fileInfo]);

    const fetchHtmlContent = useCallback(async () => {
        if (!isHtmlFile()) return;
        
        setLoading(true);
        setError('');
        try {
            const url = `/api/v4/files/${fileInfo.id}`;
            const response = await fetch(url, {
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.status}`);
            }
            
            const text = await response.text();
            setHtmlContent(text);
        } catch (err) {
            setError(`Failed to load HTML preview: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [fileInfo, isHtmlFile]);

    useEffect(() => {
        fetchHtmlContent();
    }, [fetchHtmlContent]);

    if (!isHtmlFile()) {
        return null;
    }

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDownload = () => {
        const url = `/api/v4/files/${fileInfo.id}/download`;
        window.open(url, '_blank');
    };

    const containerStyle = {
        backgroundColor: theme.centerChannelBg || '#ffffff',
        color: theme.centerChannelColor || '#333333',
        border: `1px solid ${theme.centerChannelColor ? theme.centerChannelColor + '20' : '#e0e0e0'}`,
        borderRadius: '8px',
        margin: '8px 0',
        overflow: 'hidden',
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        backgroundColor: theme.sidebarHeaderBg || '#f5f5f5',
        borderBottom: `1px solid ${theme.centerChannelColor ? theme.centerChannelColor + '20' : '#e0e0e0'}`,
    };

    const headerTitleStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '600',
        fontSize: '13px',
    };

    const iconStyle = {
        width: '18px',
        height: '18px',
    };

    const buttonStyle = {
        background: 'none',
        border: '1px solid ' + (theme.linkColor || '#1E88E5'),
        cursor: 'pointer',
        padding: '4px 10px',
        borderRadius: '4px',
        color: theme.linkColor || '#1E88E5',
        fontSize: '12px',
        fontWeight: '500',
        marginLeft: '6px',
    };

    const loadingStyle = {
        padding: '30px',
        textAlign: 'center',
        color: theme.centerChannelColor ? theme.centerChannelColor + '80' : '#999',
        fontSize: '13px',
    };

    const errorStyle = {
        padding: '12px',
        color: theme.errorTextColor || '#d32f2f',
        backgroundColor: theme.errorTextColor ? theme.errorTextColor + '10' : '#ffebee',
        borderRadius: '4px',
        margin: '8px 12px',
        fontSize: '13px',
    };

    const footerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        borderTop: `1px solid ${theme.centerChannelColor ? theme.centerChannelColor + '20' : '#e0e0e0'}`,
        fontSize: '11px',
        color: theme.centerChannelColor ? theme.centerChannelColor + '80' : '#666',
    };

    const iframeStyle = {
        width: '100%',
        height: isExpanded ? '700px' : '400px',
        border: 'none',
        backgroundColor: '#ffffff',
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={loadingStyle}>Loading HTML preview...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <div style={headerTitleStyle}>
                        <svg style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM6 20V4h5v7h7v9H6z"/>
                        </svg>
                        <span>{fileInfo.name}</span>
                    </div>
                    <div>
                        <button style={buttonStyle} onClick={handleDownload}>Download</button>
                    </div>
                </div>
                <div style={errorStyle}>{error}</div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div style={headerTitleStyle}>
                    <svg style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM6 20V4h5v7h7v9H6z"/>
                    </svg>
                    <span>HTML Preview: {fileInfo.name}</span>
                </div>
                <div>
                    <button style={buttonStyle} onClick={handleToggleExpand}>
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                    <button style={buttonStyle} onClick={handleDownload}>Download</button>
                </div>
            </div>
            <iframe
                srcDoc={htmlContent}
                style={iframeStyle}
                sandbox="allow-scripts allow-same-origin"
                title={`Preview of ${fileInfo.name}`}
            />
            <div style={footerStyle}>
                <span>{formatFileSize(fileInfo.size)}</span>
                <span>Sandboxed preview</span>
            </div>
        </div>
    );
};

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

HtmlPreviewAttachment.propTypes = {
    fileInfo: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        mime_type: PropTypes.string,
        size: PropTypes.number,
    }),
    theme: PropTypes.object,
    postId: PropTypes.string,
};

export default HtmlPreviewAttachment;
