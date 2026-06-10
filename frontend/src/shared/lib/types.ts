export interface MessageResponse {
    message: string;
}

export interface ForgotPasswordRequest {
    username: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface ApiError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}
