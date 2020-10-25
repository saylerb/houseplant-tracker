const bcrypt = require("bcrypt");

const PLAINTEXT_PASSWORD = process.env.PLAINTEXT_PASSWORD;
const SALT_ROUNDS = 12;

async function createPassword() {
  const hashed = await bcrypt.hash(PLAINTEXT_PASSWORD, SALT_ROUNDS);

  console.log({ hashed });

  return hashed;
}

async function comparePassword() {
  const hashed = await createPassword();

  const result = await bcrypt.compare(PLAINTEXT_PASSWORD, hashed);

  console.log({ result });
}

comparePassword()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {});
