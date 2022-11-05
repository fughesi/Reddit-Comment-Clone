import fastify from "fastify";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
dotenv.config();

const app = fastify();
const prisma = new PrismaClient();

app.register(sensible);

await app.register(cors, {
  origin: process.env.REACT_APP_CLIENT_URL,
  credentials: true,
});

app.get("/posts", async (req, res) => {
  return await commitToDB(
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  );
});

async function commitToDB(promise) {
  const [error, data] = await app.to(promise);
  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}

app.listen({ port: process.env.REACT_APP_PORT });
