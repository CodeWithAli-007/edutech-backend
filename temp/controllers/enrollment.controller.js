"use strict";
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
exports.bulkEnrollStudentsHandler = exports.deleteEnrollmentHandler = exports.getEnrollmentsByStudentHandler = exports.getEnrollmentsByCourseHandler = exports.testEnrollmentsHandler = exports.getEnrollmentsHandler = exports.createEnrollmentHandler = void 0;
var data_source_1 = require("../utils/data-source");
var enrollment_entity_1 = require("../entities/enrollment.entity");
var User_entity_1 = require("../entities/User.entity");
var course_entity_1 = require("../entities/course.entity");
var createEnrollmentHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, studentId, courseId, updatedBy, studentUser, course, existingEnrollment, enrollment, savedEnrollment, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, studentId = _a.studentId, courseId = _a.courseId;
                updatedBy = res.locals.user_id;
                // Validate required fields
                if (!studentId || !courseId) {
                    return [2 /*return*/, res.status(400).json({
                            status: 'fail',
                            message: 'Student ID and Course ID are required'
                        })];
                }
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(User_entity_1.User).findOne({
                        where: { user_id: studentId, role: 'student' }
                    })];
            case 1:
                studentUser = _b.sent();
                if (!studentUser) {
                    return [2 /*return*/, res.status(404).json({
                            status: 'fail',
                            message: 'Student not found'
                        })];
                }
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(course_entity_1.Course).findOne({
                        where: { course_id: courseId }
                    })];
            case 2:
                course = _b.sent();
                if (!course) {
                    return [2 /*return*/, res.status(404).json({
                            status: 'fail',
                            message: 'Course not found'
                        })];
                }
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(enrollment_entity_1.Enrollment).findOne({
                        where: {
                            studentId: studentId,
                            course_id: courseId
                        }
                    })];
            case 3:
                existingEnrollment = _b.sent();
                if (existingEnrollment) {
                    return [2 /*return*/, res.status(409).json({
                            status: 'fail',
                            message: 'Student is already enrolled in this course'
                        })];
                }
                enrollment = new enrollment_entity_1.Enrollment();
                enrollment.studentId = studentId;
                enrollment.course_id = courseId;
                enrollment.updatedBy = updatedBy;
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(enrollment_entity_1.Enrollment).save(enrollment)];
            case 4:
                savedEnrollment = _b.sent();
                res.status(201).json({
                    status: 'success',
                    message: 'Student enrolled successfully',
                    data: {
                        enrollment: savedEnrollment
                    }
                });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                next(err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createEnrollmentHandler = createEnrollmentHandler;
var getEnrollmentsHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        try {
            console.log('getEnrollmentsHandler called');
            user = res.locals.user;
            console.log('User from locals:', user === null || user === void 0 ? void 0 : user.user_id);
            if (!user) {
                return [2 /*return*/, res.status(401).json({
                        status: 'fail',
                        message: 'User not authenticated'
                    })];
            }
            // Return empty array for now - this should work
            res.status(200).json({
                status: 'success',
                data: {
                    enrollments: []
                }
            });
        }
        catch (err) {
            console.error('Error in getEnrollmentsHandler:', err);
            next(err);
        }
        return [2 /*return*/];
    });
}); };
exports.getEnrollmentsHandler = getEnrollmentsHandler;
// Test endpoint without authentication
var testEnrollmentsHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            console.log('testEnrollmentsHandler called');
            res.status(200).json({
                status: 'success',
                message: 'Test endpoint working',
                data: {
                    enrollments: []
                }
            });
        }
        catch (err) {
            console.error('Error in testEnrollmentsHandler:', err);
            next(err);
        }
        return [2 /*return*/];
    });
}); };
exports.testEnrollmentsHandler = testEnrollmentsHandler;
var getEnrollmentsByCourseHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var courseId, enrollments, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                courseId = req.params.courseId;
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(enrollment_entity_1.Enrollment)
                        .createQueryBuilder('enrollment')
                        .leftJoinAndSelect('enrollment.user', 'user')
                        .leftJoinAndSelect('enrollment.course', 'course')
                        .where('enrollment.course_id = :courseId', { courseId: courseId })
                        .getMany()];
            case 1:
                enrollments = _a.sent();
                res.status(200).json({
                    status: 'success',
                    data: {
                        enrollments: enrollments
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getEnrollmentsByCourseHandler = getEnrollmentsByCourseHandler;
var getEnrollmentsByStudentHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, enrollments, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                studentId = req.params.studentId;
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(enrollment_entity_1.Enrollment)
                        .createQueryBuilder('enrollment')
                        .leftJoinAndSelect('enrollment.user', 'user')
                        .leftJoinAndSelect('enrollment.course', 'course')
                        .where('enrollment.studentId = :studentId', { studentId: studentId })
                        .getMany()];
            case 1:
                enrollments = _a.sent();
                res.status(200).json({
                    status: 'success',
                    data: {
                        enrollments: enrollments
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getEnrollmentsByStudentHandler = getEnrollmentsByStudentHandler;
var deleteEnrollmentHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var enrollmentId, enrollment, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                enrollmentId = req.params.enrollmentId;
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(enrollment_entity_1.Enrollment).findOne({
                        where: { enrollment_id: enrollmentId }
                    })];
            case 1:
                enrollment = _a.sent();
                if (!enrollment) {
                    return [2 /*return*/, res.status(404).json({
                            status: 'fail',
                            message: 'Enrollment not found'
                        })];
                }
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(enrollment_entity_1.Enrollment).remove(enrollment)];
            case 2:
                _a.sent();
                res.status(200).json({
                    status: 'success',
                    message: 'Enrollment deleted successfully'
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                next(err_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteEnrollmentHandler = deleteEnrollmentHandler;
var bulkEnrollStudentsHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, studentIds, courseId, updatedBy, course, results, errors, _i, studentIds_1, studentId, studentUser, existingEnrollment, enrollment, savedEnrollment, error_1, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                _a = req.body, studentIds = _a.studentIds, courseId = _a.courseId;
                updatedBy = res.locals.user_id;
                if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
                    return [2 /*return*/, res.status(400).json({
                            status: 'fail',
                            message: 'Student IDs array is required'
                        })];
                }
                if (!courseId) {
                    return [2 /*return*/, res.status(400).json({
                            status: 'fail',
                            message: 'Course ID is required'
                        })];
                }
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(course_entity_1.Course).findOne({
                        where: { course_id: courseId }
                    })];
            case 1:
                course = _b.sent();
                if (!course) {
                    return [2 /*return*/, res.status(404).json({
                            status: 'fail',
                            message: 'Course not found'
                        })];
                }
                results = [];
                errors = [];
                _i = 0, studentIds_1 = studentIds;
                _b.label = 2;
            case 2:
                if (!(_i < studentIds_1.length)) return [3 /*break*/, 9];
                studentId = studentIds_1[_i];
                _b.label = 3;
            case 3:
                _b.trys.push([3, 7, , 8]);
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(User_entity_1.User).findOne({
                        where: { user_id: studentId, role: 'student' }
                    })];
            case 4:
                studentUser = _b.sent();
                if (!studentUser) {
                    errors.push({ studentId: studentId, error: 'Student not found' });
                    return [3 /*break*/, 8];
                }
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(enrollment_entity_1.Enrollment).findOne({
                        where: {
                            studentId: studentId,
                            course_id: courseId
                        }
                    })];
            case 5:
                existingEnrollment = _b.sent();
                if (existingEnrollment) {
                    errors.push({ studentId: studentId, error: 'Already enrolled' });
                    return [3 /*break*/, 8];
                }
                enrollment = new enrollment_entity_1.Enrollment();
                enrollment.studentId = studentId;
                enrollment.course_id = courseId;
                enrollment.updatedBy = updatedBy;
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(enrollment_entity_1.Enrollment).save(enrollment)];
            case 6:
                savedEnrollment = _b.sent();
                results.push(savedEnrollment);
                return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                errors.push({ studentId: studentId, error: 'Failed to enroll' });
                return [3 /*break*/, 8];
            case 8:
                _i++;
                return [3 /*break*/, 2];
            case 9:
                res.status(201).json({
                    status: 'success',
                    message: "Successfully enrolled ".concat(results.length, " students"),
                    data: {
                        enrollments: results,
                        errors: errors
                    }
                });
                return [3 /*break*/, 11];
            case 10:
                err_5 = _b.sent();
                next(err_5);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.bulkEnrollStudentsHandler = bulkEnrollStudentsHandler;
