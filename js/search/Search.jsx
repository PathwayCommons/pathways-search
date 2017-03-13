import React from 'react';
import {SearchWrapper} from './components/SearchWrapper.jsx';
import {SearchBar} from './components/SearchBar.jsx';
import {SearchList} from './components/SearchList.jsx';

// Search
// Prop Dependencies ::
// none

// Note: Spread operator used to provide props to SearchWrapper, therefore Search also adopts SearchWrapper dependencies in addition to those provided above
export class Search extends React.Component {
	render() {
		return (
			<div className="Search">
				<SearchWrapper {...this.props}>
					<SearchBar/>
					<SearchList/>
				</SearchWrapper>
			</div>
		);
	}
}
