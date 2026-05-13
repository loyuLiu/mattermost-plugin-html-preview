import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';

const HtmlPreview = ({fileInfo, theme, onTogglePreview}) => {
    const [htmlContent, setHtmlContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const fetchHtmlContent = useCallback(async () => {
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
    }, [fileInfo.id]);

    useEffect(() => {
        fetchHtmlContent();
    }, [fetchHtmlContent]);

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
        padding: '12px 16px',
        backgroundColor: theme.sidebarHeaderBg || '#f5f5f5',
        borderBottom: `1px solid ${theme.centerChannelColor ? theme.centerChannelColor + '20' : '#e0e0e0'}`,
    };

    const headerTitleStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '600',
        fontSize: '14px',
    };

    const iconStyle = {
        width: '20px',
        height: '20px',
    };

    const buttonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '4px',
        color: theme.linkColor || '#1E88E5',
        fontSize: '13px',
        fontWeight: '500',
    };

    const buttonStyleHover = {
        ...buttonStyle,
        backgroundColor: theme.linkColor ? theme.linkColor + '10' : '#1E88E510',
    };

    const previewContainerStyle = {
        padding: isExpanded ? '0' : '0',
    };

    const iframeStyle = {
        width: '100%',
        height: isExpanded ? '600px' : '400px',
        border: 'none',
        backgroundColor: '#ffffff',
    };

    const loadingStyle = {
        padding: '40px',
        textAlign: 'center',
        color: theme.centerChannelColor ? theme.centerChannelColor + '80' : '#999',
    };

    const errorStyle = {
        padding: '16px',
        color: theme.errorTextColor || '#d32f2f',
        backgroundColor: theme.errorTextColor ? theme.errorTextColor + '10' : '#ffebee',
        borderRadius: '4px',
        margin: '8px 16px',
    };

    const footerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderTop: `1px solid ${theme.centerChannelColor ? theme.centerChannelColor + '20' : '#e0e0e0'}`,
        fontSize: '12px',
        color: theme.centerChannelColor ? theme.centerChannelColor + '80' : '#666',
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={loadingStyle}>
                    <div>Loading HTML preview...</div>
                </div>
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
                        <span>HTML Preview</span>
                    </div>
                </div>
                <div style={errorStyle}>{error}</div>
                <div style={footerStyle}>
                    <span>{fileInfo.name} ({formatFileSize(fileInfo.size)})</span>
                    <button 
                        style={buttonStyle} 
                        onClick={handleDownload}
                        onMouseEnter={(e) => Object.assign(e.target.style, buttonStyleHover)}
                        onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                    >
                        Download
                    </button>
                </div>
            </div>
        );
    }

    const sandboxAttributes = 'allow-scripts allow-same-origin';

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div style={headerTitleStyle}>
                    <svg style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM6 20V4h5v7h7v9H6z"/>
                    </svg>
                    <span>HTML Preview</span>
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                    <button 
                        style={buttonStyle} 
                        onClick={handleToggleExpand}
                        onMouseEnter={(e) => Object.assign(e.target.style, buttonStyleHover)}
                        onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                    >
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                    <button 
                        style={buttonStyle} 
                        onClick={handleDownload}
                        onMouseEnter={(e) => Object.assign(e.target.style, buttonStyleHover)}
                        onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                    >
                        Download
                    </button>
                </div>
            </div>
            <div style={previewContainerStyle}>
                <iframe
                    srcDoc={htmlContent}
                    style={iframeStyle}
                    sandbox={sandboxAttributes}
                    title={`Preview of ${fileInfo.name}`}
                />
            </div>
            <div style={footerStyle}>
                <span>{fileInfo.name} ({formatFileSize(fileInfo.size)})</span>
                <span>Rendered in sandboxed iframe</span>
            </div>
        </div>
    );
};

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

HtmlPreview.propTypes = {
    fileInfo: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        mime_type: PropTypes.string,
        size: PropTypes.number,
    }).isRequired,
    theme: PropTypes.object,
    onTogglePreview: PropTypes.func,
};

export default HtmlPreview;
