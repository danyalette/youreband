/*jshint esversion: 6 */

import FormField from './formfield.js';
import * as utils from './utils.js';

export default class Form {

  constructor(paper) {
    this.paper = paper;
    this.fields = [];
    this.enter = null;
    this.onChange = function(){};
  }

  init(formText, textStyle) {
    var self = this;
    return new Promise(function(resolve) {

      // add fields
      self.addField('name', -80).then(function(field){
        field.select();
      });
      self.addField('target', 20);

      // bind events
      document.addEventListener('keydown', self.handleKeyDown.bind(self));
      document.addEventListener('click', self.handleClick.bind(self));
      self.fields.forEach(function(field){
        field.onChange = self.handleFieldChange.bind(self);
      });

      // add "is banned from" text
      utils.addTextPoint(
        self.paper,
        formText,
        '40px',
        textStyle,
        {
          'xAnchor': 'center',
          'yAnchor': 'center',
          'x': 0,
          'y': -30
        }
      );

      // add enter button
      utils.addImageRaster(self.paper, 'images/enter-key.png').then(function(raster){
        self.enter = raster;
        raster.visible = false;
        raster.size = [150, 100];
        raster.position = utils.getAnchoredPosition(self.paper.view.size, raster.size, 'center', 'center', 0, 120);
        resolve();
      });
      // create ghost element to harvest precious clicks
      var ghost = document.createElement('div');
      document.body.append(ghost);
      ghost.addEventListener('click', function(){
        if (self.enter.visible) {
          self.openResultWindow();
        }
      });
    });
  }

  handleClick() {
    this.toggleFieldSelection();
  }

  openResultWindow() {
    window.open('?q=' + this.generateQueryString());
  }

  handleKeyDown(e) {
    if (e.key == 'Enter' && this.allFieldsAreFilled()) {
      this.openResultWindow();
    }
    else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].indexOf(e.key) >= 0) {
      this.toggleFieldSelection();
      this.onChange();
      e.preventDefault();
    }
    else this.getSelectedField().input.focus();
  }

  handleFieldChange(e, field) {
    var self = this;
    if (e) {
      var textPoint = self.getSelectedField().text;
      textPoint.content = field.input.value;
      field.caret.position.x = textPoint.bounds.right + 5;
      if (self.allFieldsAreFilled()) {
        self.showEnterButton();
      } else {
        self.hideEnterButton();
      }
    }
    self.onChange();
  }

  showEnterButton() {
    if (this.enter) this.enter.visible = true;
  }

  hideEnterButton() {
    if (this.enter) this.enter.visible = false;
  }

  addField(name, yOffset) {
    var field = new FormField(this.paper, name);
    this.fields.push(field);
    return field.init(new this.paper.Size(200, 40), { y: yOffset});
  }


  generateQueryString() {
    var data = { name: '', target: ''};
    this.fields.forEach(function(field){
      data[field.name] = encodeURIComponent(field.text.content);
    });
    return btoa([data.name, data.target].join(','));
  }

  allFieldsAreFilled() {
    var allFilled = true;
    this.fields.forEach(function(field){
      if (!field.text.content) allFilled = false;
    });
    return allFilled;
  }

  getSelectedField() {
    var selectedField = null;
    this.fields.forEach(function(field){
      if (field.selected) selectedField = field;
    });
    return selectedField;
  }

  toggleFieldSelection() {
    this.fields.forEach(function(field){
      if (field.selected) {
        field.unselect();
      } else {
        field.select();
      }
    });
  }

}
