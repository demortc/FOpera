import Board from "./board";

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
    if (((jid === 0 && PlayLevel.isGhostTurn(level)) || (jid === 1 && PlayLevel.isInspectorTurn(level)) {
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
    this.parent = undefined;
  }
}