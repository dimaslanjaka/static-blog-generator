import { TaskCallback } from 'undertaker';

export const deployFirebase = (done?: TaskCallback) => {
  console.log('DEPLOY FIREBASE NOT YET IMPLEMENTED');
  if (typeof done == 'function') done();
};

export default deployFirebase;
