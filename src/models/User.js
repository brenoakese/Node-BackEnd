import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";


class User {
  id;
  name;
  email;
  password;

  constructor(id = uuidv4(), name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  async encryptPassword() {
    console.log("Encrypting password...", this.password);
    
    if (!this.password) {
      throw new Error("Password is required for encryption");
    }
    
    const rounds = 10;
    this.password = await bcrypt.hash(this.password, rounds);
  }

  async checkPassword(reqPassword) {
    return await bcrypt.compare(reqPassword, this.password);
  }
}

export default User;
