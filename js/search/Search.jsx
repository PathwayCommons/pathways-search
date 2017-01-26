import React from 'react';
import {loadDataSources} from './../helpers/http.js';
import {SearchWrapper} from './components/SearchWrapper.jsx';
import {SearchBar} from './components/SearchBar.jsx';
import {SearchList} from './components/SearchList.jsx';

// Search
// Prop Dependencies ::
// none

// Note: Spread operator used to provide props to SearchWrapper, therefore Search also adopts SearchWrapper dependencies in addition to those provided above
export class Search extends React.Component {
	constructor(props) {
		super(props);
		loadDataSources((dsObj) => this.updateDataSources(dsObj));
		this.state = {
			dataSources: {}
		}
	}

	updateDataSources(dsObj) {
		this.setState({dataSources: dsObj});
	}

	render() {
		return (
			<div className="Search">
				<SearchWrapper {...this.props} dataSources={this.state.dataSources}>
					<SearchBar/>
					<SearchList/>
				</SearchWrapper>
			</div>
		);
	}
}
