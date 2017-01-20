import {attempt} from 'lodash';
import {stringify as queryStringify} from 'query-string';

export let PCUrl = "http://www.pathwaycommons.org/pc2/";

export let httpGetAsync = (url, callback) => {
	var http = new XMLHttpRequest();
	http.responseType = "text";
	http.onload = function() {
		if (http.readyState === http.DONE) {
			if (http.status === 200) {
				callback(http.responseText);
			} else {
				callback(null);
			}
		}
	};
	http.open("GET", url, true);
	http.send(null);
}

export let getSearchQueryURL = (queryArr) => {
	return PCUrl + 'search.json?' + queryStringify(queryArr);
}

export let getPathwayURL = (uri, dataFormat) => {
	return PCUrl + 'get?format=' + dataFormat + '&user=pc2pathways&uri=' + encodeURIComponent(uri);
}

export let getLogoURL = (dataSources, dsUriOrName) => {
	var base = "img/datasources/";
	dsUriOrName = dsUriOrName || "";
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

export let base64toBlob = (base64Data, contentType) => {
	contentType = contentType || '';
	var sliceSize = 1024;
	var byteCharacters = atob(base64Data);
	var bytesLength = byteCharacters.length;
	var slicesCount = Math.ceil(bytesLength / sliceSize);
	var byteArrays = new Array(slicesCount);

	for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		var begin = sliceIndex * sliceSize;
		var end = Math.min(begin + sliceSize, bytesLength);

		var bytes = new Array(end - begin);
		for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}
	return new Blob(byteArrays, {
		type: contentType
	});
}
