export const $routes = {
    index: '/',
    domains: '/domains',
    wallet: '/wallet',
    storage: {
        index: '/storage',
        categories: '/storage/categories',
        tags: '/storage/tags',
    },
    clients: '/clients',
    library: {
        index: '/library',
        module: (slug) => `/library/${slug}`,
    },
    store: {
        index: '/store',
        module: (slug) => `/store/${slug}`
    }
}