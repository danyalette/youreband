/*jshint esversion: 6 */

// public

export function getJson(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) {
        resolve(JSON.parse(req.response));
      }
      else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function() {
      reject(Error('Network Error'));
    };
    req.send();
  });
}

export function createJpeg(canvas_elem, image_elem) {
  return new Promise(function(resolve) {
    setTimeout(function(){
      var url = getJpegUrl(canvas_elem, 9);
      image_elem.src = url;
      resolve(url);
    }, 70);
  });
}

export function getBannedDataFromUrl() {
  var b64 = getParameterByName('q');
  if (!b64) return null;
  var data = atob(b64).split(',');
  return {
    name: decodeURIComponent(data[0]),
    target: decodeURIComponent(data[1])
  };
}


export function getAnchoredPosition(context_size, item_size, xAnchor, yAnchor, x, y) {

  // e.g. getAnchoredPosition(
  //   { height: 800, width: 800 },
  //   { height: 100, width: 120 },
  //   'left',
  //   'bottom',
  //   100,
  //   -50
  // );

  var pos = { x: 0, y: 0};
  switch(xAnchor) {
      case 'right':
          pos.x = context_size.width - item_size.width/2 - x;
          break;
      case 'center':
          pos.x = context_size.width/2 + x;
          break;
      default:
          pos.x = item_size.width/2 + x;
  }
  switch(yAnchor) {
      case 'bottom':
          pos.y = context_size.height - item_size.height/2 - y;
          break;
      case 'center':
          pos.y = context_size.height/2 + y;
          break;
      default:
          pos.y = item_size.height/2 + y;
  }
  return pos;
}

export function getScaledSize(item, scaleX, scaleY) {
  return [item.size.width*scaleX, item.size.height*scaleY];
}

export function addImageRaster(paper, src) {
  return new Promise(
    function(resolve) {
      var img = document.createElement('img');
      var raster =  new paper.Raster(img);
      img.onload = function() {
        resolve(raster);
      };
      img.src = src;
    }
  );
}

export function addTextPoint(paper, content, size, style, position) {
  var text = new paper.PointText();
  text.style = style;
  text.fontSize = size;
  text.content = content;
  text.position = getAnchoredPosition(paper.view.size, text.size, position.xAnchor, position.yAnchor, position.x, position.y);
  // fit text to container
  while (text.bounds.width > paper.view.size.width) {
    text.fontSize = (text.fontSize.replace('px','') - 1) + 'px';
  }
  return text;
}

export function animate(callback, time) {
  var start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    var progress = timestamp - start;
    callback();
    if (progress < time) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

//private

function getJpegUrl(canvas_elem, quality) {
  return canvas_elem.toDataURL('image/jpeg', quality/100);
}

function getParameterByName(name) {
  var url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

