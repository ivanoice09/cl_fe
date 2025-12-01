export class RegisterCredentials {

    name: string;
    surname: string;
    middlename?: string;
    email: string;
    password: string;
    phone: string;

    constructor(name: string, surname: string, middlename: string, email: string, password: string, phone: string) {
        this.name = name;
        this.surname = surname;
        this.middlename = middlename;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }

}