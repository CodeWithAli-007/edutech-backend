"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.User = exports.RoleEnumType = void 0;
var typeorm_1 = require("typeorm");
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var institute_entity_1 = require("./institute.entity");
var RoleEnumType;
(function (RoleEnumType) {
    RoleEnumType["USER"] = "user";
    RoleEnumType["ADMIN"] = "admin";
    RoleEnumType["STUDENT"] = "student";
    RoleEnumType["TEACHER"] = "teacher";
    RoleEnumType["PARENT"] = "parent";
    RoleEnumType["INSTITUTE_ADMIN"] = "institute_admin";
})(RoleEnumType = exports.RoleEnumType || (exports.RoleEnumType = {}));
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    User.prototype.hashPassword = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, bcrypt.hash(this.password, 12)];
                    case 1:
                        _a.password = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.hashPasswordOnUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.password && !this.password.startsWith('$2a$'))) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, bcrypt.hash(this.password, 12)];
                    case 1:
                        _a.password = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    User.comparePasswords = function (candidatePassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt.compare(candidatePassword, hashedPassword)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    User.createVerificationCode = function () {
        var verificationCode = crypto.randomBytes(32).toString('hex');
        var hashedVerificationCode = crypto
            .createHash('sha256')
            .update(verificationCode)
            .digest('hex');
        return { verificationCode: verificationCode, hashedVerificationCode: hashedVerificationCode };
    };
    User.prototype.toJSON = function () {
        return __assign(__assign({}, this), { password: undefined, verified: undefined, verificationCode: undefined });
    };
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
    ], User.prototype, "user_id");
    __decorate([
        (0, typeorm_1.Column)({ name: "user_name", type: "varchar", length: 50, unique: true })
    ], User.prototype, "userName");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 255 })
    ], User.prototype, "password");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'enum',
            "enum": RoleEnumType,
            "default": RoleEnumType.ADMIN
        })
    ], User.prototype, "role");
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", "enum": ["active", "inactive"], "default": "active" })
    ], User.prototype, "status");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: "timestamp", "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], User.prototype, "created_at");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], User.prototype, "updated_at");
    __decorate([
        (0, typeorm_1.Index)('email_index'),
        (0, typeorm_1.Column)({
            unique: true
        })
    ], User.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)({
            "default": false
        })
    ], User.prototype, "verified");
    __decorate([
        (0, typeorm_1.Index)('verificationCode_index'),
        (0, typeorm_1.Column)({
            type: 'text',
            nullable: true
        })
    ], User.prototype, "verificationCode");
    __decorate([
        (0, typeorm_1.Column)({ name: "institute_id", type: "uuid", nullable: true })
    ], User.prototype, "instituteId");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return institute_entity_1.Institute; }, function (institute) { return institute.institute_id; }),
        (0, typeorm_1.JoinColumn)({ name: "institute_id" })
    ], User.prototype, "institute");
    __decorate([
        (0, typeorm_1.BeforeInsert)()
    ], User.prototype, "hashPassword");
    __decorate([
        (0, typeorm_1.BeforeUpdate)()
    ], User.prototype, "hashPasswordOnUpdate");
    User = __decorate([
        (0, typeorm_1.Entity)("user")
    ], User);
    return User;
}(typeorm_1.BaseEntity));
exports.User = User;
