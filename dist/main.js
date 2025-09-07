"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = require("@fastify/helmet");
const cors_1 = require("@fastify/cors");
const rate_limit_1 = require("@fastify/rate-limit");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const fastifyAdapter = new platform_fastify_1.FastifyAdapter();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, fastifyAdapter);
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api');
    await fastifyAdapter.register(helmet_1.default);
    await fastifyAdapter.register(cors_1.default, {
        origin: configService.get('FRONTEND_ORIGIN'),
        credentials: true,
    });
    await fastifyAdapter.register(rate_limit_1.default, {
        max: 100,
        timeWindow: '1 minute',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const port = configService.get('PORT', 3000);
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map