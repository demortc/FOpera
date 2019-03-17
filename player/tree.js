const { Node, PlayLevelId } = require('./node');
const { Character } = require('./Character');

class Tree {
  constructor() {
    this.root = new Node();
    this._actual = this.root;
    this.root.playLevel = PlayLevelId.GHOST;
  }

  parent() {
    if (this._actual !== this.root) {
      this._actual = this._actual.parent
    }
  }

  generate () {
    return this._actual.generateDirectChildPower(0, 0);
  }


  getActualPos() {
    if (this._actual.playedCharacter) {
      return this._actual.characters[this._actual.playedCharacter].position;
    }
  }

  goToAdverseMove(characterMoved) {
    for (let child of this._actual.child) {
      if (child.characters[characterMoved.color].position === characterMoved.position) {
        this._actual = child;
        break;
      }
    }
  }

  goToBestChild(allowedColors) {
    let bestChild = new Node();
    for (let child of this._actual.child) {
      if (allowedColors.includes(child.playedCharacter)) {
        if (bestChild === undefined || child.heuristic > bestChild.heuristic) {
          bestChild = child;
        }
      }
    }
    this._actual = bestChild;
    return allowedColors.indexOf(this._actual.playedCharacter);
  }

  print(layer) {
    if (layer === undefined) {
      layer = this._actual;
    }
    layer.dump();
    for (let child of layer.child) {
      this.print(child);
    }
  }

  updateSuspectWorld(characters) {
    this.updateNode(this._actual, characters, this._actual.lock, this._actual.lightOff);
  }

  updateWorldInfo(lock, light) {
    this.updateNode(this._actual, this._actual.characters, lock, light);
  }

  updateNode(targetNode, characters, lock, light) {
    if (targetNode === undefined) {
      return null;
    }

    for (let char of characters) {
      targetNode.characters[char.color].suspect = char.suspect;
      targetNode.lock = lock;
      targetNode.lightOff = light;
      if (targetNode.ghostColor !== Character.Color().NONE) {
        targetNode.heuristic = targetNode.computeScoreGhost(targetNode.ghostColor)
      } else {
        targetNode.heuristic = targetNode.computeScoreInspector();
      }
      targetNode.heuristic = targetNode.computeScoreInspector();
    }

    for (let child of targetNode.child) {
      this.updateNode(child, characters, lock, light)
    }
  }
}

module.exports = Tree;

