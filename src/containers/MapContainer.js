//#region import file
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GoogleApiWrapper } from 'google-maps-react';
import TheMap from '../components/TheMap';
import { addLocation } from '../actions';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
//#endregion

const styles = theme => ({
  addLocationContainer:{
		position: 'fixed',
		top: '600px',
  },
});

export class MapContainer extends Component{
	constructor(props) {
        super(props);
        this.selectPlace = this.selectPlace.bind(this);
        this.state = {
        	place: {
        		name:null,
        		id:null,
        		address:null
        	}
        }
        this.pacCard = React.createRef();
    }
    selectPlace(place){
    	this.state.place = {...place};
    	console.log(this.state.place);
    	// this.props.dispatch();
    }
    addPlaceOnClick(e){
    	this.props.actions(this.state.place);
    }
   	render(){
			const {classes} = this.props;
   		return(
   			<div className="MapContainer" >	
   				<TheMap google={this.props.google} selectPlace={this.selectPlace} pacCard = {this.pacCard}></TheMap>
					<Button
							className={classes.addLocationContainer}
							variant="contained"
							color="primary"
							onClick={(e) => {this.addPlaceOnClick(e)}}
						>
							Add Location
					</Button>
   			</div>
   		)
   	}
}
function mapDispatchToProps(dispatch){
	return{
		actions: bindActionCreators(addLocation, dispatch)
	}
}
MapContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(connect(null,mapDispatchToProps)(GoogleApiWrapper({
	apiKey: 'AIzaSyDpE6ASlrK_fyKwheIpwS6RvmByadRFb_o',
	libraries: ['places']
})(MapContainer)))