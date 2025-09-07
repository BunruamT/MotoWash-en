"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_repository_1 = require("./users.repository");
const supabase_constants_1 = require("../database/supabase.constants");
let AuthService = class AuthService {
    constructor(supabase, jwtService, configService, usersRepository) {
        this.supabase = supabase;
        this.jwtService = jwtService;
        this.configService = configService;
        this.usersRepository = usersRepository;
    }
    async verifyLiffToken(idToken) {
        const response = await fetch('https://api.line.me/oauth2/v2.1/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                id_token: idToken,
                client_id: this.configService.getOrThrow('LINE_LOGIN_CHANNEL_ID'),
                nonce: '',
            }),
        });
        if (!response.ok) {
            throw new Error('Invalid LINE LIFF token');
        }
        const lineProfile = await response.json();
        const user = await this.usersRepository.findOrCreateByLineId(lineProfile.sub);
        const payload = {
            sub: user.id,
            role: 'customer',
            lineUserId: lineProfile.sub,
        };
        return this.jwtService.sign(payload);
    }
    async adminLogin(email, password) {
        const admin = await this.usersRepository.findAdminByEmail(email);
        if (!admin || !await this.usersRepository.verifyPassword(password, admin.password)) {
            throw new Error('Invalid credentials');
        }
        const payload = {
            sub: admin.id,
            role: 'admin',
        };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_constants_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_repository_1.UsersRepository])
], AuthService);
//# sourceMappingURL=auth.service.js.map