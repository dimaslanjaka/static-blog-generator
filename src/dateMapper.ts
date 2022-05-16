import moment from "moment";

/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
export class dateMapper {
  data: moment.Moment;
  constructor(date: moment.MomentInput) {
    if (typeof date == 'string') {
      this.data = moment(date);
    }
  }
  format = (pattern: string) => this.data.format(pattern);
  year = () => this.data.format('YYYY');
  toString = () => this.data.format('YYYY-MM-DDTHH:mm:ssZ');
}
