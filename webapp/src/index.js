import React from 'react';
import HtmlFilePreview from './components/HtmlFilePreview';

class Plugin {
    initialize(registry, store) {
        const isHtmlFile = (fileInfo) => {
            if (!fileInfo) return false;
            return fileInfo.mime_type === 'text/html' ||
                   (fileInfo.name && fileInfo.name.toLowerCase().endsWith('.html'));
        };

        registry.registerFilePreviewComponent(
            (fileInfo, post) => isHtmlFile(fileInfo),
            HtmlFilePreview
        );
    }

    uninitialize() {
    }
}

window.registerPlugin('com.mattermost.html-preview', new Plugin());
