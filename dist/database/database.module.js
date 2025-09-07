"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_constants_1 = require("./supabase.constants");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: supabase_constants_1.SUPABASE_CLIENT,
                useFactory: (configService) => {
                    return (0, supabase_js_1.createClient)(configService.getOrThrow('SUPABASE_URL'), configService.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'));
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [supabase_constants_1.SUPABASE_CLIENT],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map