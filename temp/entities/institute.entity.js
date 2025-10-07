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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Institute = void 0;
var typeorm_1 = require("typeorm");
var User_entity_1 = require("./User.entity");
var Institute = /** @class */ (function (_super) {
    __extends(Institute, _super);
    function Institute() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
    ], Institute.prototype, "institute_id");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 200 })
    ], Institute.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ name: "house_no", type: "varchar", length: 20, nullable: true })
    ], Institute.prototype, "houseNo");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true })
    ], Institute.prototype, "street");
    __decorate([
        (0, typeorm_1.Column)({ name: "postal_code", type: "varchar", length: 20, nullable: true })
    ], Institute.prototype, "postalCode");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true })
    ], Institute.prototype, "state");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true })
    ], Institute.prototype, "city");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }) // or use length: 2 for strict ISO code
    ], Institute.prototype, "country");
    __decorate([
        (0, typeorm_1.Column)({ name: "mobile_no1", type: "varchar", length: 20, nullable: true })
    ], Institute.prototype, "mobileNo1");
    __decorate([
        (0, typeorm_1.Column)({ name: "mobile_no2", type: "varchar", length: 20, nullable: true })
    ], Institute.prototype, "mobileNo2");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: true })
    ], Institute.prototype, "telephone1");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: true })
    ], Institute.prototype, "telephone2");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true })
    ], Institute.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true })
    ], Institute.prototype, "web");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp", "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], Institute.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp", "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], Institute.prototype, "updatedAt");
    __decorate([
        (0, typeorm_1.Column)({ name: "updated_by", type: "char", nullable: false })
    ], Institute.prototype, "updatedBy");
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return User_entity_1.User; }, function (user) { return user; }),
        (0, typeorm_1.JoinColumn)({ name: 'updated_by' })
    ], Institute.prototype, "user");
    Institute = __decorate([
        (0, typeorm_1.Entity)("institute")
    ], Institute);
    return Institute;
}(typeorm_1.BaseEntity));
exports.Institute = Institute;
