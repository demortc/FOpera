import Board from "./board";
import * as Character from '../player/Character';
import { Color } from './Character';

class PlayLevelId {
  static GHOST = 0;
  static INSPECTOR = 1;
  static INSPECTOR2 = 2;
  static GHOST2 = 3;
  static INSPECTOR3 = 4;
  static GHOST3 = 5;
  static GHOST4 = 6;
  static INSPECTOR4 = 7;
}

class PlayLevel {
  static getNextMove = (level) => {
    const roles = [
      PlayLevelId.GHOST,
      PlayLevelId.INSPECTOR,
      PlayLevelId.INSPECTOR2,
      PlayLevelId.GHOST2,
      PlayLevelId.INSPECTOR3,
      PlayLevelId.GHOST3,
      PlayLevelId.GHOST4,
      PlayLevelId.INSPECTOR4
    ];

    const levelIndex = roles.findIndex((index) => index === level);

    if (levelIndex + 1 === roles.length) {
      return PlayLevelId.GHOST;
    }

    return roles[levelIndex + 1];
  }

  static isGhostTurn = (level) => {
    if ([PlayLevelId.INSPECTOR, PlayLevelId.INSPECTOR2, PlayLevelId.INSPECTOR3, PlayLevelId.INSPECTOR4].includes(level)) {
      return true;
    }

    return false;
  }

  static isInspectorTurn = (level) => {
    if ([PlayLevelId.GHOST, PlayLevelId.GHOST2, PlayLevelId.GHOST3, PlayLevelId.GHOST4].includes(level)) {
      return true;
    }

    return false;
  }

  static isAdverseMove = (jid, level) => {
    if ((jid === 0 && PlayLevel.isGhostTurn(level)) || (jid === 1 && PlayLevel.isInspectorTurn(level))) {
      return true;
    }

    return false;
  }
}

export class Node {

  constructor() {
    this.depth = 0;
    this.playLevel = undefined;
    this.playedCharacter = undefined;
    this.ghostColor = character.Color.NONE;
    this.parent = undefined;
    this.child = [];
    this.characters = [
      new character.Character(character.Color.RED, 0, true),
      new character.Character(character.Color.PINK, 0, true),
      new character.Character(character.Color.GREY, 0, true),
      new character.Character(character.Color.BLUE, 0, true),
      new character.Character(character.Color.PURPLE, 0, true),
      new character.Character(character.Color.BROWN, 0, true),
      new character.Character(character.Color.BLACK, 0, true),
      new character.Character(character.Color.WHITE, 0, true)
    ]
    this.lock = [0, 1];
    this.lightOff = 0;
    this.board = new Board();
    this.heuristic = undefined;
  }

  moveCharacter = (to_move, new_position) => {
    const path = Board.path;
    const path_pink = Board.path;

    if (new_position < 0 || new_position > 9 ||
      (this.characters[to_move.value].position === this.lock[0] && new_position === this.lock[1]) ||
      (this.characters[to_move.value].position === this.lock[1] && new_position === this.lock[0])) {
      return false;
    }

    if (to_move === character.Color.PINK) {
      if (path_pink[this.characters[to_move.value].position].includes(new_position)) {
        this.characters[to_move.value].position = new_position;
        return true;
      } else {
        return false;
      }
    } else {
      if (path[this.characters[to_move.value].position].includes(new_position)) {
        this.characters[to_move.value].position = new_position;
        return true;
      } else {
        return false;
      }
    }
  }

  dump = () => {
    console.log("Characters : ");
    this.characters.forEach((character) => character.dump());

    console.log("Lights are off in room : "+ self.lightOff);
    console.log("Lock : " + self.lock)
    console.log("Playing for : ");

    if (PlayLevel.isGhostTurn(this.playLevel)) {
      console.log("Ghost");
    } else {
      if (PlayLevel.isInspectorTurn(this.playLevel)) {
        console.log("Inspector\n");
      } else {
        console.log("Unknown");
      }
    }
  }

  computeScoreInspector = () => {
    let seen = 0;
    let unseen = 0;

    this.characters.forEach((character) => {
      if (character.suspect) {
        if (character.position === this.lightOff)
          unseen += 1;
        else if (this.countPeopleInRoom(character.position)) {
          seen += 1;
        } else {
          unseen += 1;
        }
      }
    });

    return Math.abs(seen - unseen);
  }

  countPeopleInRoom = (position) => {
    var count = 0;

    this.characters.forEach((character) => {
      if (character.position === position) {
        count += 1
      }
    })

    return count;
  }

  computeScoreGhost = (ghost_color) => {
    let ghost = this.characters[ghost_color.value];
    let seen = 0;
    let unseen = 0;
    let ghostSeen = false;

    if (this.lightOff !== ghost.position && this.countPeopleInRoom(ghost.position) > 1) {
      ghostSeen = true;
    }

    this.characters.forEach((character) => {
      if (character.suspect) {
        if (character.position === this.lightOff) {
          unseen += 1;
        } else if (this.countPeopleInRoom(character.position) > 1) {
          seen += 1;
        } else {
          unseen += 1;
        }
      }
    });

    if ((ghostSeen && seen === 1) || (!ghostSeen && unseen === 1)) {
      return -1000;
    }

    if (ghostSeen) {
      return seen - unseen;
    }

    return unseen - seen + 1;
  }

  generateDirectChild = (depth = 0, max_depth = 2) => {
    for (let char in Object.keys(Color)) {
      if (char !== Color.NONE) {
        break;
      }

      this.board.lockPath(this.lock[0], this.lock[1]);
      this.board.getLinkForRoom(this.characters[char].position).forEach((room) => {
        let tmp = new Node();

        tmp.parent = this;
        tmp.depth = this.depth + 1;

        this.characters.forEach((character, index) => {
          tmp.characters[index] = new Character(character.color, character.position, character.suspect)
        });

        tmp.playedCharacter = char;
        tmp.lightOff = this.lightOff;
        tmp.lock = this.lock;
        tmp.setPosition(char, room);
        tmp.playLevel = PlayLevel.getNextMove(this.playLevel);
        tmp.ghostColor = this.ghostColor;

        if (this.ghostColor !== Color.NONE) {
          tmp.heuristic = tmp.computeScoreGhost(tmp.ghostColor);
        } else {
          tmp.heuristic = tmp.computeScoreInspector();
        }

        if (depth < max_depth) {
          tmp.generateDirectChild(depth + 1);
        }

        this.child.append(tmp);
        this.child.sort((a, b) => a - b);
      });
    }
  }

  createChildNode = () => {
    let tmp = new Node();
    tmp.parent = this;

    this.characters.forEach((character, index) => {
      tmp.characters[index] = new Character(character.color, character.position, character.suspect)
    });

    tmp.playedCharacter = Color.NONE;
    tmp.lightOff = this.lightOff;
    tmp.lock = this.lock;
    tmp.playLevel = PlayLevel.getNextMove(this.playLevel);
    tmp.ghostColor = this.ghostColor;

    return tmp;
  }

  setTmpNodeHeuristique = (tmp) => {
    if (this.ghostColor !== Color.NONE) {
      tmp.heuristic = tmp.computeScoreGhost(tmp.ghostColor);
    } else {
      tmp.heuristic = tmp.computeScoreInspector();
    }

    return tmp;
  }

  generateDirectChildPower = (depth = 0, max_depth = 0) => {
    for (let char in Object.keys(Color)) {
      if (char !== Color.NONE) {
        break;
      }

      let rooms;
      if (char === Color.PINK) {
        rooms = this.board.getLinkForRoom(this.characters[char].position, true);
      } else {
        rooms = this.board.getLinkForRoom(this.characters[char].position, false);
      }

      rooms.forEach((room, index) => {
        if (char === Color.BLUE) {
          for (let lock_room = 0; lock_room < 10; lock_room++) {
            let tmp = this.createChildNode();
            tmp.playedCharacter = char;
            tmp.setPosition(char, room);
            tmp.lock = lock_room;
            tmp = this.setTmpNodeHeuristique(tmp);
            if (depth < max_depth) {
              tmp.generateDirectChildPower(depth + 1);
            }
            this.child.append(tmp);
          }
        } else if (char === Color.GREY) {
          for (let lock_room = 0; lock_room < 10; lock_room++) {
            let tmp = this.createChildNode();
            tmp.playedCharacter = char;
            tmp.setPosition(char, room);
            tmp.lightOff = lock_room;
            tmp = this.setTmpNodeHeuristique(tmp);
            if (depth < max_depth) {
              tmp.generateDirectChildPower(depth + 1);
            }
            this.child.append(tmp);
          }
        } else if (char === Color.PURPLE) {
            let tmp = this.createChildNode();
            tmp.setPosition(char, room);
            tmp = this.setTmpNodeHeuristique(tmp);
            if (depth < max_depth) {
              tmp.generateDirectChildPower(depth + 1);
            }
            this.child.append(tmp);
            for (let swap_char in Object.keys(Color)) {
              if (char !== Color.PURPLE) {
                break;
              }

              let tmp_power = this.createChildNode();
              tmp_power.playedCharacter = char;
              let old_purple_position = this.characters[char].position;
              tmp.setPosition(char, this.characters[swap_char].position)
              tmp.setPosition(swap_char, old_purple_position);
              tmp_power = this.setTmpNodeHeuristique(tmp_power);
              if (depth < max_depth) {
                tmp_power.generateDirectChildPower(depth + 1);
              }
              this.child.append(tmp_power);
            }
        } else if (char === Color.BROWN) {
          let tmp = this.createChildNode();
          tmp.playedCharacter = char;
          tmp.setPosition(char, room);
          tmp = this.setTmpNodeHeuristique(tmp);
          if (depth < max_depth) {
            tmp.generateDirectChildPower(depth + 1);
          }
          this.child.append(tmp);
          for (let swap_char in Object.keys(Color)) {
            if (char !== Color.BROWN || this.characters[swap_char].position === this.characters[char].position) {
              break;
            }

            let tmp_power = this.createChildNode();
            tmp_power.playedCharacter = char;
            tmp.setPosition(char, room)
            tmp.setPosition(swap_char, room);
            tmp_power = this.setTmpNodeHeuristique(tmp_power);
            if (depth < max_depth) {
              tmp_power.generateDirectChildPower(depth + 1);
            }
            this.child.append(tmp_power);
          }
        } else {
          let tmp = this.createChildNode();
          tmp.playedCharacter = char;
          tmp.setPosition(char, room);
          tmp = this.setTmpNodeHeuristique(tmp);
          if (depth < max_depth) {
            tmp.generateDirectChildPower(depth + 1);
          }
          this.child.append(tmp);
        }
      })
    }
  }

  setPosition = (to_move, new_position) => {
    this.characters[to_move].position = new_position;
  }

  setCharacter = (characters) => {
    this.characters = characters;
  }

  setLightOff = (light) => this.lightOff = light;

  setLock = (lock) => {
    this.lock = lock;
    this.board.lockPath(this.lock[0], this.lock[1])
  }

  getLightOff = (self) =>  this.lightOff;

  getLock = () => this.lock;

  setParent = (parent) => {
    this.parent = parent
  }

  getParent = () =>  this.parent;

  addChildren = (child) => {
    this.child.append(child)
  }

  getCharacters = () => this.characters

}