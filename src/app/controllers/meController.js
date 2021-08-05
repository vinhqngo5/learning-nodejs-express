const Course = require("../models/Courses");
const { multipleMongooseToObject } = require("../../utils/mongoose");
class MeController {
  // [GET] /me/stored/courses
  storedCourses(req, res, next) {
    let courseQuery = Course.find({});

    if (req.query.hasOwnProperty("_sort")) {
      courseQuery = courseQuery.sort({
        [req.query.column]: req.query.type,
      });
    }

    Promise.all([Course.countDocumentsDeleted(), courseQuery])
      .then(([deletedCount, courses]) => {
        courses = {
          deletedCount,
          courses: multipleMongooseToObject(courses),
        };
        res.render("me/stored-courses", courses);
      })
      .catch(next);
  }
  // [GET] /me/trash/courses tìm các khóa học bị xóa
  trashCourses(req, res, next) {
    Course.findDeleted({})
      .then((courses) => {
        courses = multipleMongooseToObject(courses);
        res.render("me/trash-courses", { courses });
      })
      .catch(next);
  }
}

module.exports = () => new MeController();
/**
 * if module.exports = new NewsController()
 * => Only create one instance
 * => Return a function to create instance
 */
