/*jshint esversion: 6 */

import paper from 'paper';
import PaperJpeg from './paperjpeg.js';
import * as utils from './utils.js';

window.onload = function(){

    var data = utils.getBannedDataFromUrl();

    utils.getJson('config.json').then(function(config){
      initPaper(paper, config, data);
    });
};

function initPaper(paper, config, data) {

  var paperjpeg = new PaperJpeg(paper);

  paperjpeg.setBackgroundColor('#BCB3A4');
  paperjpeg.addImages(config.images).then(function(){
    if (data) {
      paperjpeg.addBannedText(config, data);
    } else {
      paperjpeg.addForm(config.formText, config.textStyle);
    }

    // animate cop
    var cop = paperjpeg.imageRasters.cop;
    setInterval(function(){
      utils.animate(function(){
        if (cop.position.x < -150) return;
        cop.position.x -= 0.5;
        paperjpeg.render();
      }, 1000);
    }, 5000);

    // animate sad kid
    var sadKid = paperjpeg.imageRasters['sad-kid'];
    var sadKidY = sadKid.position.y;
    setInterval(function(){
      utils.animate(function(){
        if (sadKid.position.y == sadKidY) {
          sadKid.position.y -= 1;
        } else {
          sadKid.position.y += 1;
        }
        paperjpeg.render();
      }, 500);
    }, 2500);

    // animate no-smoking
    var smoking = paperjpeg.imageRasters['no-smoking'];
    var rot = 0;
    setTimeout(function(){
      utils.animate(function(){
        smoking.rotate(rot);
        rot += 6;
        paperjpeg.render();
      }, 1000);
    }, 3500);

  });

  paper.view.draw();
}
