import MeasureTime from '../../../node/benchmark/measure-timing';
import { generateIndex } from './archives';
import getChunkOf from './getChunkOf';

const measure = new MeasureTime();

measure
  //.run('generate homepage', generateIndex, 'homepage')
  //.then(() => measure.run('generate all archive', generateIndex, 'all'))
  //.then(() => measure.run('generate archive page 1', generateIndex, 1))
  .run('generate tags', generateIndex, getChunkOf);
