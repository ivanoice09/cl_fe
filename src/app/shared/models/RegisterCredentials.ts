export class RegisterCredentials {

    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    password: string;
    phone?: string;

    constructor(firstName: string, lastName: string, middleName: string, email: string, password: string, phone: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }

}