// locationReducer.js
import * as actionType from '../actions/ActionType';
import produce from "immer";

const today = new Date();
const initialState = {
  startDate: today,
  endDate: today,
  duration: 1,
  focusDay: 1,  //default focus first day
  day:{
    1:{
      location:[],
      date:new Date(),
      isFocus:true,
      latestTime: '00:00',
      travelMode: 'RAIL'
    }
  }
};
const locationReducer = (state = initialState, action) => {
  let nextState;
  nextState = produce(state, draftState => {
    switch (action.type) {
      case actionType.UPDATE_FOCUS_DAY:
        draftState.focusDay = action.payload;
        draftState.day[state.focusDay].isFocus = false;
        draftState.day[draftState.focusDay].isFocus = true;
        break;
      case actionType.ADD_LOCATION:
        let newLocation = {...action.payload, startTime: state.day[state.focusDay].latestTime}
        draftState.day[draftState.focusDay].location.push(newLocation);
        break;
      case actionType.DELETE_LOCATION:
        draftState.day[action.payload.dayID].location.splice(action.payload.index,1);
        break;
      case actionType.UPDATE_LOCATION_TIME:
        let {dayID,index,time} = action.payload;
        if(time === ''){
          draftState.day[dayID].location[index].startTime = '00:00'
        }else{
          draftState.day[dayID].location[index].startTime = time;
          draftState.day[dayID].location.sort((a,b) => a.startTime > b.startTime ? 
            1: (b.startTime > a.startTime ? -1 : 0));
          draftState.day[dayID].latestTime = 
          draftState.day[dayID].location[draftState.day[dayID].location.length - 1].startTime;
        }
        break;
      case actionType.UPDATE_TRIP_DURATION:
        const prevDuration = state.duration;

        draftState.startDate = action.payload.startDate;
        draftState.endDate = action.payload.endDate;
        draftState.duration = action.payload.duration;
        const startDate = new Date(draftState.startDate);

        
        for(let i = 0 ; i < draftState.duration ; i++){
          let tmpDate = new Date(draftState.startDate);
          let dayID = i+1;
          tmpDate.setDate(startDate.getDate()+i);
          if(draftState.day[dayID] === undefined){
            draftState.day[dayID] = {location: [],latestTime: '00:00',travelMode: 'DRIVING'};
          }
          draftState.day[dayID].date = new Date(tmpDate);
          draftState.day[dayID].isFocus = false;
          // let prevLocation = draftState.day[dayID] !== undefined ? draftState.day[dayID] : {location: []};
          // tmpDay[dayID] = {...prevLocation,date: new Date(tmpDate), isFocus:false};
        }

        //delete the days outside the updated duration
        for(let i = draftState.duration+1; i <= prevDuration; i++){
          delete draftState.day[i];
        }
        // draftState.day = tmpDay;
        draftState.focusDay = 1;
        draftState.day[1].isFocus = true;
        // console.log(draftState.day[1].location === state.day[1].location);
        break;
      case actionType.UPDATE_TRAVEL_MODE:
        draftState.day[action.payload.dayID].travelMode = action.payload.travelMode;
        break;
      default:
        return state;
    }
  });
  console.log(nextState);
  return nextState;
}

export default locationReducer;
