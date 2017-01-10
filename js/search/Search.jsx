import React from 'react';
import {loadDataSources} from './../helpers/http.js';
import {SearchWrapper} from './components/SearchWrapper.jsx';
import {SearchBar} from './components/SearchBar.jsx';
import {SearchList} from './components/SearchList.jsx';

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
		if(this.state.dataSources == {}) {
			return (null);
		}
		else {
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
}
