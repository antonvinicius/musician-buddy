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

// export class ApiResponse {
//     constructor(
//         public message: string,
//         public errors: Array<{ label: string, description: string }>,
//         public statusCode: number,
//         public data: any = null
//     ) { }
// }