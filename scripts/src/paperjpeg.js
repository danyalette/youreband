/*jshint esversion: 6 */

import Form from './form.js';
import * as utils from './utils.js';

export default class PaperJpeg {

  constructor(paper) {
    this.paper = paper;
    this.imageRasters = [];
    // create canvas elem
    this.canvas = document.createElement('canvas');
    this.canvas.height = this.canvas.width = 400;
    document.body.append(this.canvas);
    this.paper.setup(this.canvas);
    // create img elem
    this.image = document.createElement('img');
    document.body.append(this.image);
    // add background
    this.background = new this.paper.Path.Rectangle(this.paper.view.bounds);
  }

  render() {
    return utils.createJpeg(this.canvas, this.image);
  }

  setBackgroundColor(color) {
    this.background.fillColor = color;
    return this.background;
  }

  addImage(src, scale, { xAnchor = 'left', yAnchor = 'top', x = 0, y = 0}) {
    var self = this;
    return utils.addImageRaster(this.paper, src).then(function(raster){
      raster.size = utils.getScaledSize(raster, scale, scale);
      raster.position = utils.getAnchoredPosition(self.paper.view.size, raster.size, xAnchor, yAnchor, x, y);
      return raster;
    });
  }

  addImages(images) {
    var self = this;
    return new Promise(function(resolve) {
      var rasters = [];
      images.forEach(function(image){
        self.addImage(image.src, image.scale, image.position)
          .then(function(raster){
            rasters.push(raster);
            self.imageRasters[image.name] = raster;
            if (rasters.length == images.length) {
              resolve();
            }
          });
      });
    });
  }

  addForm(formText, textStyle) {
    var self = this;
    var form = new Form(self.paper);
    form.init(formText, textStyle).then(function(){
      self.render();
    });
    form.onChange = self.render.bind(self);
  }

  addBannedText(config, data) {
    var self = this;
    config.texts.forEach(function(text){
      var content = text.content;
      if (text.config_choice_key) {
        var choices = config[text.config_choice_key];
        content = choices[Math.floor(Math.random() * choices.length)];
      }
      else if (text.data_key) {
        content = data[text.data_key];
      }
      utils.addTextPoint(
        self.paper,
        content,
        text.max_size,
        config.textStyle,
        text.position
      );
    });
    self.render();
  }
}
