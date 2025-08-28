import { MetadataRoute } from 'next';

const EXCLUDED_PATHS = ['/api', '/dashboard', '/user-panel'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://copaac.19872000.xyz';

    const staticPaths = [
        '/',
        '/terms-and-conditions',
        '/privacy-policy',
    ];

    const paths = [...staticPaths].filter(
        (path) => !EXCLUDED_PATHS.some((excluded) => path.startsWith(excluded))
    );

    return paths.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date().toISOString(),
    }));
}
