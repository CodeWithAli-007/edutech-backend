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
exports.Enrollment = void 0;
var typeorm_1 = require("typeorm");
var course_entity_1 = require("./course.entity");
var User_entity_1 = require("./User.entity");
var Enrollment = /** @class */ (function (_super) {
    __extends(Enrollment, _super);
    function Enrollment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
    ], Enrollment.prototype, "enrollment_id");
    __decorate([
        (0, typeorm_1.Column)({ name: "student_id", type: "uuid" })
    ], Enrollment.prototype, "studentId");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_entity_1.User; }, { onDelete: "CASCADE" }),
        (0, typeorm_1.JoinColumn)({ name: "student_id", referencedColumnName: "user_id" })
    ], Enrollment.prototype, "user");
    __decorate([
        (0, typeorm_1.Column)({ name: "course_id", type: "uuid" })
    ], Enrollment.prototype, "course_id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return course_entity_1.Course; }, { onDelete: "CASCADE" }),
        (0, typeorm_1.JoinColumn)({ name: "course_id", referencedColumnName: "course_id" })
    ], Enrollment.prototype, "course");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: "enrolledAt", type: "timestamp", "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], Enrollment.prototype, "enrolledAt");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp", "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], Enrollment.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp", "default": function () { return "CURRENT_TIMESTAMP"; } })
    ], Enrollment.prototype, "updatedAt");
    __decorate([
        (0, typeorm_1.Column)({ name: "updated_by", type: "uuid", nullable: false })
    ], Enrollment.prototype, "updatedBy");
    Enrollment = __decorate([
        (0, typeorm_1.Entity)("enrollment"),
        (0, typeorm_1.Unique)(["user", "course"])
    ], Enrollment);
    return Enrollment;
}(typeorm_1.BaseEntity));
exports.Enrollment = Enrollment;
