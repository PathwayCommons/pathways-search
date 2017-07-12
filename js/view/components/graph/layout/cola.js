const colaLayout = (cy) => {
  cy.layout({
    name: 'cola',
    fit: true,
    randomize: false,
    nodeSpacing: function( node ){
      if (node.data('class').includes('process')) {
        return 40;
      } else {
        return 0;
      }
    } // extra spacing around nodes
  }).run();
};

export default colaLayout;
