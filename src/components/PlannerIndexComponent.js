import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import "./ComponentsStyle.css";

import MUIButton from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import CloseIcon from "@material-ui/icons/Close";
import FlagIcon from "@material-ui/icons/Flag";
import { Button } from "reactstrap";
import { usePlanTimetable } from "../context/PlanTimetableContextProvider";
import { resourcesData } from "./resources";

import "./ComponentsStyle.css";
import "./PlannerSearchCourseStyle.css";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const CourseDiv = function (props) {
  const {
    course,
    currentIdx,
    deleteElement,
    updateCurrentIdx,
    isIndexFixed,
    setIsIndexFixed,
  } = props;
  const classes = useStyles();
  const courseCode = course.courseCode;
  const indexes = course.index;

  return (
    <>
      <div className="row">
        <div className="col-4">{courseCode}</div>
        <div className="col-3">
          <MUIButton
            variant="outlined"
            color="secondary"
            className={classes.button}
            startIcon={<CloseIcon />}
            onClick={deleteElement}
            style={{ width: "40px", minWidth: "40px" }}
          ></MUIButton>
        </div>
        <div className="col-3">
          <MUIButton
            variant={isIndexFixed ? "contained" : "outlined"}
            color="primary"
            className={classes.button}
            startIcon={<FlagIcon />}
            onClick={() => {
              Object.keys(currentIdx).length === 0
                ? alert("You cannot fix an empty index!")
                : setIsIndexFixed(!isIndexFixed);
            }}
            style={{ width: "40px", minWidth: "40px" }}
          ></MUIButton>
        </div>
      </div>
      <div className="row">
        <div className="col-2">
          <FormControl className={classes.formControl} disabled={isIndexFixed}>
            <InputLabel htmlFor="index-native-simple">Index</InputLabel>
            <Select
              value={indexes.indexOf(currentIdx)}
              native
              onChange={updateCurrentIdx}
              className={classes.selectEmpty}
            >
              <option aria-label="None" value=""></option>
              {indexes.map((tempVar, index) => {
                return (
                  <option key={index} value={index}>
                    {tempVar.index_number}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </div>
    </>
  );
};

export default function ShareTimetable() {
  const planTimetableContext = usePlanTimetable();
  const courseDivs = planTimetableContext.courseDivs;
  const setCourseDivs = planTimetableContext.setCourseDivs;

  const combinations = planTimetableContext.combinations;
  const setCombinations = planTimetableContext.setCombinations;
  const currentTimeTablePage = planTimetableContext.currentTimeTablePage;
  const setCurrentTimeTablePage = planTimetableContext.setCurrentTimeTablePage;

  //Backend: this method will retrieve all course indexes then call backend method to return timetables
  //if clash then give a error message
  //convert courseDivs to courses
  const planCourse = (temp_course_divs) => {
    // console.log(temp_course_divs);
    //pass course to backend
    const temp_course_arr = temp_course_divs.map((item) => {
      if (item.isIndexFixed) {
        let tempCourse = { ...item.course };
        tempCourse.index = [item.currentIdx];
        return tempCourse;
      } else {
        return item.course;
      }
    });
    console.log(temp_course_arr);

    //
    // const backend_data_arr = backend_method(temp_course_arr)
    // const backend_data_arr = [];
    // //reset timetablestate.timetables
    // // for (let i=0;i<backend_data_arr.length;i++){
    // //   let tempTT = backend_data_arr[i];
    // // }
    // setTimetablesState({ ...timetablesState, timeTables: backend_data_arr });
    // displayCurrentTTpage();
    // const setCurrentIdx = () => {
    //   const tempCD = [...courseDivs];
    //   const tempIdx = tempCD[0].course.index.findIndex(
    //     (item) => item.index_number === "10064"
    //   );
    //   tempCD[0].currentIdx = tempCD[0].course.index[tempIdx];
    //   setCourseDivs(tempCD);
    // };

    // setCurrentIdx();
    // console.log(temp_course_arr);
  };

  const updateCurrentIdx = (event, idx) => {
    const tempCourseDivs = [...courseDivs];
    if (event.target.value !== "") {
      tempCourseDivs[idx].currentIdx =
        tempCourseDivs[idx].course.index[event.target.value];
    } else {
      tempCourseDivs[idx].currentIdx = {};
    }
    setCourseDivs(tempCourseDivs);

    //change combination of the current page
    const tempCs = [...combinations];
    //create course and respective index(empty default)
    tempCs[currentTimeTablePage - 1][tempCourseDivs[idx].course.courseCode] =
      tempCourseDivs[idx].currentIdx.index_number;
    setCombinations(tempCs);
  };

  const setIsIndexFixed = (value, idx) => {
    const tempCourseDivs = [...courseDivs];
    tempCourseDivs[idx].isIndexFixed = value;
    setCourseDivs(tempCourseDivs);
  };

  const deleteElement = (idx) => {
    const tempCourseDivs = [...courseDivs];
    const tempCourseDiv = tempCourseDivs.splice(idx, 1)[0];
    setCourseDivs(tempCourseDivs);

    //change combination of the current page
    const tempCs = [...combinations];
    //create course and respective index(empty default)
    delete tempCs[currentTimeTablePage - 1][tempCourseDiv.course.courseCode];
    setCombinations(tempCs);
  };

  return (
    <>
      {courseDivs.map((courseDiv, idx) => {
        return (
          <div
            key={idx}
            className="row"
            style={{
              border: "2px solid black",
              borderRadius: "5px",
              background: resourcesData[idx].color,
            }}
          >
            <CourseDiv
              key={idx}
              course={courseDiv.course}
              currentIdx={courseDiv.currentIdx}
              deleteElement={() => deleteElement(idx)}
              updateCurrentIdx={(event) => updateCurrentIdx(event, idx)}
              isIndexFixed={courseDiv.isIndexFixed}
              setIsIndexFixed={(value) => setIsIndexFixed(value, idx)}
            />
          </div>
        );
      })}
      <Button className="btn-warning" onClick={() => planCourse(courseDivs)}>
        Plan
      </Button>
    </>
  );
}
