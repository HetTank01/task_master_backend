import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

const loadRoutes = async () => {
    const files = fs.readdirSync(__dirname).filter(file => file !== "index.js"); // array of files ["auth.routes.js", ...]

    await Promise.all(
        files.map(async (file) => {
            const module = await import(`./${file}`);
            router.use(`/${file.replace(".routes.js", "")}`, module.default);
        })
    );
};

await loadRoutes();

export default router;
