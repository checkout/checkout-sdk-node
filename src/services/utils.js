// eslint-disable-next-line import/prefer-default-export
export const buildQueryParams = (path, params) => {
    let url = path;
    if (params) {
        const queryString = Object.keys(params)
            .map((key) => `${key}=${params[key]}`)
            .join('&');
        url += `?${queryString}`;
    }

    return url;
};
