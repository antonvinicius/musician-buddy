export type ApiError = {
    label: string;
    description: string;
}

export type ApiResponse = {
    message: string;
    errors: ApiError[];
    statusCode: number,
    data?: any
}