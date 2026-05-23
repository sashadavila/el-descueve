export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export interface WelcomeEmailData {
    name: string;
    email: string;
    company?: string;
}

export interface LoginAlertData {
    name: string;
    email: string;
    ip: string;
    userAgent: string;
    timestamp: Date;
    location?: string;
}

export interface PasswordChangeAlertData {
    name: string;
    email: string;
    ip: string;
    userAgent: string;
    timestamp: Date;
}

export interface PasswordResetData {
    name: string;
    email: string;
    resetToken: string;
    resetUrl: string;
}