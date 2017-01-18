/*jshint esversion: 6 */

import * as utils from './utils.js';

export default class FormField {

  constructor(paper, name) {
    this.paper = paper;
    this.name = name;
    this.selected = false;
    this.onChange = function(){};
  }

  init(size, { xAnchor = 'center', yAnchor = 'center', x = 0, y = 0}) {

    var self = this;
    return new Promise(function(resolve) {

      // create html elem
      self.input = document.createElement('input');
      document.body.insertBefore(self.input, document.body.firstChild);
      self.input.addEventListener('input', function (e) {
        self.onChange(e, self);
      });

      // create input background
      self.path = new self.paper.Path.RoundRectangle(new self.paper.Rectangle(size), new self.paper.Size(10, 10));
      self.path.position = utils.getAnchoredPosition(self.paper.view.size, self.path.size, xAnchor, yAnchor, x, y );
      self.path.style = {
        fillColor: 'white',
        strokeWidth: 2,
        strokeColor: '#4f617f'
      };

      // create text element
      var textPosition = {
        'xAnchor': xAnchor,
        'yAnchor': yAnchor,
        'x': x,
        'y': y
      };
      self.text = utils.addTextPoint(self.paper, '', '20px',{ justification: 'left'}, textPosition);
      self.text.position.x = self.path.position.x - size.width/2 + 5;

      // create caret
      utils.addImageRaster(self.paper, 'images/caret.png').then(function(raster){
        self.caret = raster;
        self.caret.size = [7, 25];
        self.caret.visible = false;
        self.caret.position = { x: self.text.bounds.right + 5, y: self.path.position.y};
        self.blinkCaret();
        resolve(self);
      });
    });
  }

  blinkCaret(){
    var self = this;
    if (self.caretBlinkInterval) clearInterval(self.caretBlinkInterval);
    self.caretBlinkInterval = setInterval(function(){
      self.caret.opacity = !self.caret.opacity * 1;
      self.onChange(null, self);
    }, 500)
  }

  select() {
    this.selected = true;
    this.path.strokeColor = '#4286f4';
    this.input.focus();
    if (this.caret) {
      this.caret.opacity = 1;
      this.caret.visible = true;
    }
    this.onChange(null, this);
  }

  unselect() {
    this.selected = false;
    this.path.strokeColor = 'black';
    this.input.blur();
    if (this.caret) {
      this.caret.visible = false;
    }
    this.onChange(null, this);
  }

}