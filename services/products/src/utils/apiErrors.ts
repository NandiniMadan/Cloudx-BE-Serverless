export class ApiError {
    statusCode: number;
    body: string;
    headers: {
        'Content-Type': string;
        'Access-Control-Allow-Origin': string;
    };
    constructor(
        message = 'An error occurred',
        statusCode = 500,
    ) {
        const body = JSON.stringify({ message });
        this.statusCode = statusCode;
        this.body = body;
        this.headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        };
    }
}