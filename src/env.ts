import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        NODE_ENV: z.string().optional(),
    },
    client: {

    },
    // For Next.js >= 13.4.4, you only need to destructure client variables:
    experimental__runtimeEnv: {

    }
});