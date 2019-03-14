

export class Board {
  path = [[1, 4], [0, 2], [1, 3], [2, 7], [0, 5, 8], [4, 6], [5, 7], [3, 6, 9], [4, 9], [7, 8]];
  path_pink = [[1, 4], [0, 2, 5, 7], [1, 3, 6], [2, 7], [0, 5, 8, 9], [4, 6, 1, 8], [5, 7, 2, 9], [3, 6, 9, 1], [4, 9, 5], [7, 8, 4, 6]];

  lock = undefined;

  getLinkForRoom = (room, pink = false) => {
    if (this.lock || (JSON.stringify(this.lock[0]) !== JSON.stringify(room) && JSON.stringify(this.lock[1]) !== JSON.stringify(room))) {
      return !pink ? this.path[room] : this.path_pink[room];
    }

    let tmp = !pink ? this.path : this.path_pink;

    if (JSON.stringify(this.lock[0]) === JSON.stringify(room)) {
      return tmp[this.lock[0]].filter(_ =>
        JSON.stringify(tmp[this.lock[0]]) === JSON.stringify(this.lock[1]))
    } else if (JSON.stringify(this.lock[1]) === JSON.stringify(room)) {
      return tmp[this.lock[0]].filter(_ =>
        JSON.stringify(tmp[this.lock[1]]) === JSON.stringify(this.lock[0]))
    }
  }

  lockPath = (origin, next_room) => {
    this.lock = [origin, next_room];
  }
}