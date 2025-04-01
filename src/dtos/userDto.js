
class UserDTO {
    name;
    password;
    email;

    constructor(name, password, email) {
        this.name = name;
        this.password = password;
        this.email = email;
    }
}

export default UserDTO;