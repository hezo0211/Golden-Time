import * as bcrypt from 'bcrypt';
const hashedPassword = async (plainPassword: string) => {
  return await bcrypt.hash(plainPassword, 10);
};
export default hashedPassword;
