export { };

declare global {

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        message_key: string;
        statusCode: number | string;
        data?: T;
    }

    interface ILogin {
        access_token: string;
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        };
    }

    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }

    interface IUser {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;
    }
}
