import { URL } from 'url';

export function normalizeUrl(url) {
    try {
        const parsedUrl = new URL(url);
        parsedUrl.hash = '';
        if (parsedUrl.pathname === '/') {
            parsedUrl.pathname = '';
        }
        parsedUrl.protocol = 'https:';
        parsedUrl.hostname = parsedUrl.hostname.replace(/^www\./, '');
        return parsedUrl.toString();
    } catch (err) {
        console.error(`Invalid URL: ${url}`);
        return url;
    }
}
