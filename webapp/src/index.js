import React from 'react';
import HtmlFilePreview from './components/HtmlFilePreview';
import ImagePreview from './components/ImagePreview';

class Plugin {
    initialize(registry, store) {
        const isHtmlFile = (fileInfo) => {
            if (!fileInfo) return false;
            return fileInfo.mime_type === 'text/html' ||
                   (fileInfo.name && fileInfo.name.toLowerCase().endsWith('.html'));
        };

        const isImageFile = (fileInfo) => {
            if (!fileInfo) return false;
            const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff', 'image/x-icon', 'image/avif'];
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.tif', '.ico', '.avif'];
            
            if (fileInfo.mime_type && imageMimeTypes.includes(fileInfo.mime_type)) {
                return true;
            }
            
            if (fileInfo.name) {
                const lowerName = fileInfo.name.toLowerCase();
                return imageExtensions.some(ext => lowerName.endsWith(ext));
            }
            
            return false;
        };

        registry.registerFilePreviewComponent(
            (fileInfo, post) => isHtmlFile(fileInfo),
            HtmlFilePreview
        );

        registry.registerFilePreviewComponent(
            (fileInfo, post) => isImageFile(fileInfo),
            ImagePreview
        );
    }

    uninitialize() {
    }
}

window.registerPlugin('com.mattermost.html-preview', new Plugin());
