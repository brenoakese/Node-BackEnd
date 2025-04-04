class UserDTO {
  name;
  password;
  email;

  constructor(name, password, email) {
    if (!name) {
      throw new Error("Name is required");
    }
    if (!email ) {
      throw new Error(`Invalid email ${email} ${name}`);
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export default UserDTO;
