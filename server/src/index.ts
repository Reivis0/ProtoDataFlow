import { Elysia } from "elysia";
import { users } from "./routes/users";
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { data } from "./routes/data";
import { settings } from "./routes/settings";

const app = new Elysia().use(cors()).use(swagger()).use(users).use(data).use(settings).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
