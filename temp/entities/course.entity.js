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
exports.Course = void 0;
var typeorm_1 = require("typeorm");
var User_entity_1 = require("./User.entity");
var Course = /** @class */ (function (_super) {
    __extends(Course, _super);
    function Course() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
    ], Course.prototype, "course_id");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 100 })
    ], Course.prototype, "title");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 200, nullable: true })
    ], Course.prototype, "description");
    __decorate([
        (0, typeorm_1.Column)({ name: "teacher_id", type: "uuid", nullable: true })
    ], Course.prototype, "teacherId");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_entity_1.User; }, function (user) { return user.user_id; }, { onDelete: "CASCADE" }),
        (0, typeorm_1.JoinColumn)({ name: "teacher_id" })
    ], Course.prototype, "user");
    __decorate([
        (0, typeorm_1.Column)({ name: "institute_id", type: "uuid", nullable: true })
    ], Course.prototype, "instituteId");
    __decorate([
        (0, typeorm_1.Column)({ name: "updated_by", type: "uuid", nullable: false })
    ], Course.prototype, "updatedBy");
    __decorate([
        (0, typeorm_1.OneToMany)("Lesson", "course")
    ], Course.prototype, "lessons");
    Course = __decorate([
        (0, typeorm_1.Entity)("course")
    ], Course);
    return Course;
}(typeorm_1.BaseEntity));
exports.Course = Course;
