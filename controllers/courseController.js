const Course = require('../models/courseModel');

// Controller for fetching course data by courseid
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ courseid: req.params.courseid });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller for adding a new course
exports.addCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCourse = async (req,res) => {
    try {
        const getCourse = await Course.find()
        res.status(201).json(getCourse);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }   
}


 exports.updatecourse = async (req, res) => {
  const courseId = req.params.courseId;
  const updatedData = req.body; 

  try {
    const course = await Course.findOne({ courseid: courseId });

    // Check if the course exists
    if (!course) {
      console.log('Course not found with courseid:', courseId);
      return res.status(404).json({ message: "Course not found" });
    }

    if (updatedData.date) {
      let dateToAdd = updatedData.date;
      if (Array.isArray(dateToAdd) && dateToAdd.length === 1) {
        dateToAdd = dateToAdd[0];
      }

      console.log('Date to be added:', updatedData);
      const updatedCourse = await Course.findOneAndUpdate(
        { courseid: courseId },
        {
          $push: {
            dates: updatedData
          },
        },
        { new: true, upsert: false } // Return the updated document
      );
      
      // If no course is updated, return an error
      if (!updatedCourse) {
        console.log('Failed to update course:', courseId); // Debugging log
        return res.status(404).json({ message: "Failed to update course" });
      }

      // Send success response with the updated course
      return res.status(200).json({
        message: "Course updated successfully",
        updatedCourse,
      });
    } else {
      return res.status(400).json({ message: "Date is required for the update" });
    }
  } catch (error) {
    // Handle errors and send a 500 status code with the error message
    console.log('Error updating course:', error); // Debugging log
    return res.status(500).json({
      message: "Server error while updating course",
      error: error.message,
    });
  }
};

exports.updatedate = async (req, res) => {
  const dateId = req.params.dateId;
  const updatedData = req.body;

  try {
    const course = await Course.findOne({ "dates._id": dateId });
    if (!course) {
      console.log('Date not found with _id:', dateId);
      return res.status(404).json({ message: "Date not found" });
    }
    const updatedCourse = await Course.findOneAndUpdate(
      { "dates._id": dateId },
      {
        $set: {
          "dates.$": updatedData,
        },
      },
      { new: true, upsert: false }
    );

    if (!updatedCourse) {
      console.log('Failed to update date with _id:', dateId);
      return res.status(500).json({ message: "Failed to update date" });
    }

    return res.status(200).json({
      message: "Date updated successfully",
      updatedCourse,
    });
  } catch (error) {
    console.log('Error updating date:', error);
    return res.status(500).json({
      message: "Server error while updating date",
      error: error.message,
    });
  }
};







