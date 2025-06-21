import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs"; // Mudança aqui: bcrypt -> bcryptjs

class User {
  id;
  name;
  email;
  password;
  familia_id;
  papel;
  papel_detalhado;

  constructor(id = uuidv4(), name, email, password, familia_id = null, papel = null, papel_detalhado = null) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.familia_id = familia_id;
    this.papel = papel;
    this.papel_detalhado = papel_detalhado;
  }

  async encryptPassword() {
    if (!this.password) {
      throw new Error("Password is required for encryption");
    }
    
    const rounds = 10;
    this.password = await bcrypt.hash(this.password, rounds);
  }

  async checkPassword(reqPassword) {
    return await bcrypt.compare(reqPassword, this.password);
  }

  // Método para verificar se é dono da família
  isDono() {
    return this.papel_detalhado === 'dono';
  }

  // Método para verificar se é responsável (dono, pai, mãe, etc.)
  isResponsavel() {
    return ['dono', 'pai', 'mae', 'avo', 'avó'].includes(this.papel_detalhado);
  }

  // Método para verificar se é dependente
  isDependente() {
    return ['filho', 'filha', 'neto', 'neta'].includes(this.papel_detalhado);
  }
}

export default User;