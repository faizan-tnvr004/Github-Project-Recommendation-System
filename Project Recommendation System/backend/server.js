import { config } from "dotenv";
import { app } from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { seedDB } from "./src/utils/seedDB.js";

config();

const PORT = Number(process.env.PORT || 5000);

async function start() {
  await connectDB();
  const seed = await seedDB();

  if (seed.seeded) {
    // eslint-disable-next-line no-console
    console.log(`Seeded Projects collection (${seed.count} docs)`);
  }

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

