import {attempt} from 'lodash';

export let PCUrl = "http://www.pathwaycommons.org/pc2/";

export let httpGetAsync = (url, callback) => {
	var http = new XMLHttpRequest();
	http.onreadystatechange = () => {
		if (http.readyState == 4 && http.status == 200)
			callback(http.responseText);
	}
	http.open("GET", url, true);
	http.send(null);
}

export let getSearchQueryURL = (query) => {
	return PCUrl + 'search.json?type=pathway&user=pc2pathways&q=' + encodeURIComponent(query);
}

export let getPathwayURL = (uri, dataFormat) => {
	return PCUrl + 'get?format=' + dataFormat + '&user=pc2pathways&uri=' + encodeURIComponent(uri);
}

export let getLogoURL = (dataSources, dsUriOrName) => {
	var base = "img/datasources/";
	for (var key in dataSources) {
		var ds = dataSources[key];
		if (ds.uri == dsUriOrName || ds.name.toLowerCase() == dsUriOrName.toLowerCase()) {
			return base + ds.id + '.png';
		}
	}
}

export let loadDataSources = (callback) => {
	//copy data sources to the global array: kepp just some fields and only pathway data sources (not e.g., ChEBI)
	httpGetAsync(PCUrl + 'metadata/datasources?user=pc2pathways', (data) => {
		var output = {};
		data = parseJSON(data).filter(source => source.notPathwayData == false);
		data.map((ds) => {
			var name = (ds.name.length > 1) ? ds.name[1] : ds.name[0];
			output[ds.uri] = {
				id: ds.identifier,
				uri: ds.uri,
				name: name,
				description: ds.description,
				type: ds.type
			};
		});
		callback(output);
	});
}

export let parseJSON = (string) => {
	return attempt(JSON.parse.bind(null, string));
}
