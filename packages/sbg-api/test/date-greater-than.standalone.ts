import moment, { Moment } from 'moment';

// moment.tz('Asia/Jakarta');
// differ(moment('2024-01-21T09:54:43.398Z'));
// differ(moment('3000-01-21T09:54:43.398Z'));
differ(moment('2024-01-21T10:53:29+07:00'));

function differ(target: Moment) {
  // const today = new Date().getTime();
  // const diff = target.toDate().getTime() <= today;
  // console.log({ today, target: target.toDate().getTime(), diff });
  const today = moment(new Date());
  console.log({ today, target, diff: today.isAfter(target) });
}
