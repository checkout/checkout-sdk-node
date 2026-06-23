export const buildQueryParams = (path, params) => {
    let url = path;
    if (params) {
        const queryString = Object.keys(params)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        url += `?${queryString}`;
    }

    return url;
};
