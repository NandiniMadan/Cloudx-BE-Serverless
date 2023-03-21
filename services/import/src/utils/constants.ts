export enum STATUS_CODES {
    OK = 200,
    ACCEPTED = 202,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
};

export const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

export const BUCKET_NAME = 'magnum-imports';
export const REGION = 'us-east-1';
export const UPLOAD_PREFIX = 'uploaded';
export const PARSE_PREFIX = 'parsed';
