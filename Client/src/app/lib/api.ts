async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }

    return response.json();
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

async function apiRequest<T>(
    method: HttpMethod,
    route: string,
    body?: Record<string, any>,
    headers?: Record<string, string>,
    renderError?: (error: Error) => void
): Promise<T> {
    try {
        route = route.startsWith("/") ? route : "/" + route
        const response = await fetch(`${process.env.API_URL}${route}`, {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
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

export default apiRequest;
