import pathwayCommons from 'pathway-commons';

import querySearch from './search';

const PathwayCommonsService = {
  // query pathway commons for pathways, sbgn, information, etc.
  query (uri, format, path=null) {
    let query;
    if (path != null) {
      query = pathwayCommons.traverse();
      query.path(path);
    } else {
      query = pathwayCommons.get();
    }

    return query
      .uri(uri)
      .format(format)
      .fetch();
  },

  // id the app as a user of pathwaycommons
  registerUser (name) {
    pathwayCommons.utilities.user(name);
  },

  // check if pathway commons is online
  isServiceOnline (delay) {
    return pathwayCommons.utilities.pcCheck(delay);
  },

  lookupDataSourceIcon (datasourceString) {
    return pathwayCommons.datasources.lookupIcon(datasourceString);
  }

};

PathwayCommonsService.querySearch = querySearch;

PathwayCommonsService.core = pathwayCommons;

export default PathwayCommonsService;