import React, {useState, useEffect, useCallback, useRef} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const ImagePreview = ({fileInfo, post, theme}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0});
    const containerRef = useRef(null);
    const imageRef = useRef(null);

    const imageUrl = `/api/v4/files/${fileInfo.id}`;

    const handleImageLoad = useCallback((e) => {
        const img = e.target;
        setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight
        });
        setLoading(false);
    }, []);

    const handleImageError = useCallback(() => {
        setError('Failed to load image preview');
        setLoading(false);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            const parent = containerRef.current.closest('.file-view__wrapper, .post-attachment, .file-thumbnail__content, [class*="file"]');
            if (parent) {
                parent.style.height = 'auto';
                parent.style.maxHeight = 'none';
                parent.style.overflow = 'visible';
            }
            const postBody = containerRef.current.closest('.post-body, .post__content, [class*="post-body"]');
            if (postBody) {
                postBody.style.overflow = 'visible';
            }
        }
    }, [isExpanded]);

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleFullscreen = () => {
        setShowFullscreen(true);
    };

    const handleDownload = () => {
        const url = `/api/v4/files/${fileInfo.id}/download`;
        window.open(url, '_blank');
    };

    const containerStyle = {
        backgroundColor: theme?.centerChannelBg || '#ffffff',
        color: theme?.centerChannelColor || '#333333',
        border: `1px solid ${theme?.centerChannelColor ? theme.centerChannelColor + '20' : '#e0e0e0'}`,
        borderRadius: '8px',
        margin: '8px 0',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        backgroundColor: theme?.sidebarHeaderBg || '#f5f5f5',
        borderBottom: `1px solid ${theme?.centerChannelColor ? theme.centerChannelColor + '20' : '#e0e0e0'}`,
        flexShrink: 0,
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
        border: '1px solid ' + (theme?.linkColor || '#1E88E5'),
        cursor: 'pointer',
        padding: '4px 10px',
        borderRadius: '4px',
        color: theme?.linkColor || '#1E88E5',
        fontSize: '12px',
        fontWeight: '500',
        marginLeft: '6px',
    };

    const loadingStyle = {
        padding: '30px',
        textAlign: 'center',
        color: theme?.centerChannelColor ? theme.centerChannelColor + '80' : '#999',
        fontSize: '13px',
    };

    const errorStyle = {
        padding: '12px',
        color: theme?.errorTextColor || '#d32f2f',
        backgroundColor: theme?.errorTextColor ? theme.errorTextColor + '10' : '#ffebee',
        borderRadius: '4px',
        margin: '8px 12px',
        fontSize: '13px',
    };

    const footerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        borderTop: `1px solid ${theme?.centerChannelColor ? theme.centerChannelColor + '20' : '#e0e0e0'}`,
        fontSize: '11px',
        color: theme?.centerChannelColor ? theme.centerChannelColor + '80' : '#666',
        flexShrink: 0,
    };

    const imageContainerStyle = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme?.centerChannelBg ? theme.centerChannelBg + '50' : '#f9f9f9',
        minHeight: isExpanded ? 'auto' : '300px',
        maxHeight: isExpanded ? 'none' : '500px',
        overflow: 'hidden',
    };

    const imageStyle = {
        maxWidth: '100%',
        maxHeight: isExpanded ? 'none' : '500px',
        height: 'auto',
        display: 'block',
        objectFit: 'contain',
    };

    const fullscreenOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        backgroundColor: theme?.centerChannelBg || '#000000',
        display: 'flex',
        flexDirection: 'column',
    };

    const fullscreenHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        backgroundColor: theme?.sidebarHeaderBg || '#333333',
        borderBottom: `1px solid ${theme?.centerChannelColor ? theme.centerChannelColor + '20' : '#e0e0e0'}`,
    };

    const fullscreenImageContainerStyle = {
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
        padding: '20px',
    };

    const fullscreenImageStyle = {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <div style={headerTitleStyle}>
                        <svg style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        <span>{fileInfo.name}</span>
                    </div>
                </div>
                <div style={loadingStyle}>Loading image preview...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <div style={headerTitleStyle}>
                        <svg style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
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

    const fullscreenContent = showFullscreen ? ReactDOM.createPortal(
        <div style={fullscreenOverlayStyle}>
            <div style={fullscreenHeaderStyle}>
                <div style={headerTitleStyle}>
                    <svg style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <span>Image Preview: {fileInfo.name}</span>
                </div>
                <div>
                    <button style={buttonStyle} onClick={handleDownload}>Download</button>
                    <button style={buttonStyle} onClick={() => setShowFullscreen(false)}>Close</button>
                </div>
            </div>
            <div style={fullscreenImageContainerStyle}>
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt={fileInfo.name}
                    style={fullscreenImageStyle}
                />
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div ref={containerRef} style={{width: '100%', maxWidth: '100%'}}>
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <div style={headerTitleStyle}>
                        <svg style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        <span>Image Preview: {fileInfo.name}</span>
                    </div>
                    <div>
                        <button style={buttonStyle} onClick={handleToggleExpand}>
                            {isExpanded ? 'Collapse' : 'Expand'}
                        </button>
                        <button style={buttonStyle} onClick={handleFullscreen}>Fullscreen</button>
                        <button style={buttonStyle} onClick={handleDownload}>Download</button>
                    </div>
                </div>
                <div style={imageContainerStyle}>
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt={fileInfo.name}
                        style={imageStyle}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                </div>
                <div style={footerStyle}>
                    <span>{formatFileSize(fileInfo.size)}</span>
                    {imageDimensions.width > 0 && (
                        <span>{imageDimensions.width} × {imageDimensions.height}px</span>
                    )}
                </div>
            </div>
            {fullscreenContent}
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

ImagePreview.propTypes = {
    fileInfo: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        mime_type: PropTypes.string,
        size: PropTypes.number,
    }).isRequired,
    post: PropTypes.object,
    theme: PropTypes.object,
};

export default ImagePreview;
