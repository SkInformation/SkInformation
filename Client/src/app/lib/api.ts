import * as url from "url";

export async function apiRequest<T>(
    method: HttpMethod,
    route: string,
    query: Record<string, any> = {},
    body?: Record<string, any>,
    headers?: Record<string, string>,
    renderError?: (error: Error) => void
): Promise<T> {
    try {
        const queryParams = Object.keys(query)
        if (queryParams.length > 0) {
            route += "?"
            queryParams.forEach(key => {
                route += `${key}=${query[key]}`
            })
        }
        const resolvedUrl = url.resolve(process.env.NEXT_PUBLIC_API_URL ?? '', route)
        let contentType = 'application/json';

        const response = await fetch(resolvedUrl, {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': contentType,
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        return handleResponse<T>(response);
    } catch (error: any) {
        console.error('API request failed:', error.message);

        if (renderError) {
            renderError(error);
        }

        throw error;
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        if (response.body) {
            console.error(response.json())
        }
        throw new Error('Something went wrong in the request.');
    }

    return response.json();
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export async function submitMultipartForm<T>(formData: FormData, route: string): Promise<T> {
    try {
        const resolvedUrl = url.resolve(process.env.NEXT_PUBLIC_API_URL ?? '', route);
        const response = await fetch(resolvedUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return handleResponse(response);
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}