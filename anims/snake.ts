
import { Painter } from '../paint/paint';
import { Point } from '../src/models/point';

const EMPTY_CHAR = ' ';
const FILL_CHAR = '•';

export function getSnakeAnim(painter: Painter) {
  let matrix: string[][];
  let head: Point;
  matrix = Array(painter.width).fill(0).map(() => {
    return Array(painter.height).fill(0).map(() => ' ');
  });
  head = new Point(0, 0);
  return async () => {
    painter.setPoint(head.x, head.y, FILL_CHAR);
    await painter.draw();
    if(head.x >= painter.width) {
      if(head.y >= painter.height) {
        head.x = 0;
        head.y = 0;
      } else {
        head.x = 0;
        head.y += 1;
      }
    } else if(head.y >= painter.height) {
      head.y = 0;
    } else {
      head.x += 1;
    }
  };
}
