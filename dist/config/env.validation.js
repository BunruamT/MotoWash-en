"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().transform((val) => parseInt(val, 10)),
    FRONTEND_ORIGIN: zod_1.z.string().url(),
    SUPABASE_URL: zod_1.z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string(),
    SUPABASE_ANON_KEY: zod_1.z.string(),
    SUPABASE_JWT_SECRET: zod_1.z.string(),
    LINE_LOGIN_CHANNEL_ID: zod_1.z.string(),
    LINE_LOGIN_CHANNEL_SECRET: zod_1.z.string(),
    LIFF_ID: zod_1.z.string(),
    LINE_MESSAGING_CHANNEL_ID: zod_1.z.string(),
    LINE_MESSAGING_CHANNEL_SECRET: zod_1.z.string(),
    LINE_MESSAGING_ACCESS_TOKEN: zod_1.z.string(),
    RECEIPT_BASE_URL: zod_1.z.string().url(),
    BOOKING_TIMEBLOCK_MINUTES: zod_1.z.string().transform((val) => parseInt(val, 10)),
});
function validate(config) {
    const result = envSchema.safeParse(config);
    if (!result.success) {
        throw new Error(`Config validation error: ${JSON.stringify(result.error.issues)}`);
    }
    return result.data;
}
//# sourceMappingURL=env.validation.js.map