FlowRouter.route('/decision/:_id', {
  name: 'Decision.show',
  action(params, queryParams) {
    console.log("Looking at a decision?", params);
  }
})
