import { PrismaClient } from "@prisma/client";
import { demoData } from "../src/seed/demo-data";
const client = new PrismaClient();

async function main() {
  await client.suggestion.createMany({
    data: demoData,
  });
}

main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
    process.exit(1);
  });
