// utils/event.ts
import mitt from 'mitt';

type Events = {
  movie_saved: void;
};

const emitter = mitt<Events>();

export default emitter;


