import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.js";


async function main() {
  // Create a new user with a post
  const pword = await bcrypt.hash("randompassword", 10);
  console.log(pword);
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prismo.nt",
      posts: {
        create: {
          title: "Hello World",
          content: "This is my first post!",
          published: true,
        },
      },
    },
    include: {
      posts: true,
    },
  });
  console.log("Created user:", user);

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });