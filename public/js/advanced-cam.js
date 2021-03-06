var toolpathsInScene = [];

function initTree() {
  $('#filetree').on('keyup change','input', function() {
    var inputVal = $(this).val();
    var newval = parseFloat(inputVal, 3)
    var id = $(this).attr('id');
    var objectseq = $(this).attr('objectseq');
    // console.log('Value for ' +id+ ' changed to ' +newval+ ' for object ' +objectseq );
    if ( id.indexOf('xoffset') == 0 ) {
      objectsInScene[objectseq].position.x = objectsInScene[objectseq].userData.offsetX + newval;
      // console.log('Moving ' +objectsInScene[objectseq].name+ ' to X: '+newval);
      attachBB(objectsInScene[objectseq]);
    } else if ( id.indexOf('yoffset') == 0 ) {
      objectsInScene[objectseq].position.y = objectsInScene[objectseq].userData.offsetY + newval;
      // console.log('Moving ' +objectsInScene[objectseq].name+ ' to Y: '+newval);
      attachBB(objectsInScene[objectseq]);
    } else if ( id.indexOf('rasterDPI') == 0 ) {
      var bboxpre = new THREE.Box3().setFromObject(objectsInScene[objectseq]);
      // console.log('bbox for BEFORE SCALE: Min X: ', (bboxpre.min.x + (laserxmax / 2)), '  Max X:', (bboxpre.max.x + (laserxmax / 2)), 'Min Y: ', (bboxpre.min.y + (laserymax / 2)), '  Max Y:', (bboxpre.max.y + (laserymax / 2)));
      // console.log('Scaling ' +objectsInScene[objectseq].name+ ' to: '+scale);
      var scale = (25.4 / newval);
      objectsInScene[objectseq].scale.x = scale;
      objectsInScene[objectseq].scale.y = scale;
      objectsInScene[objectseq].scale.z = scale;
      putFileObjectAtZero(objectsInScene[objectseq]);
      attachBB(objectsInScene[objectseq]);
      $("#rasterxoffset"+objectseq).val('0')
      $("#rasteryoffset"+objectseq).val('0')
    } else if ( id.indexOf('svgresol') == 0 ) {
      var svgscale = (25.4 / newval );
      objectsInScene[objectseq].scale.x = svgscale;
      objectsInScene[objectseq].scale.y = svgscale;
      objectsInScene[objectseq].scale.z = svgscale;
      putFileObjectAtZero(objectsInScene[objectseq]);
      attachBB(objectsInScene[objectseq]);
    }
  });

  $('#statusBody2').on('keyup change','input', function() {
    var inputVal = $(this).val();
    var newval = parseFloat(inputVal, 3)
    var id = $(this).attr('id');
    var objectseq = $(this).attr('objectseq');
    console.log('Value for ' +id+ ' changed to ' +newval+ ' for object ' +objectseq );
  });

  $('#statusBody2').on('keyup change','select', function() {
    var newval = $(this).val();
    var id = $(this).attr('id');
    var objectseq = $(this).attr('objectseq');
    console.log('Value for ' +id+ ' changed to ' +newval+ ' for object ' +objectseq );
    if ( id.indexOf('operation') == 0 ) {
      if (newval == "Laser (no path offset)") {
        laserMode();
        $('#text4368').text("Laser");
      } else if (newval == "Inside") {
        cncInsideMode();
        $('#text4368').text("Inside");
      } else if (newval == "Outside") {
        cncOutsideMode();
        $('#text4368').text("Outside");
      } else if (newval == "Pocket") {
        cncPocketMode();
        $('#text4368').text("Pocket");
      } else if (newval == "Drag Knife") {
        laserMode();
        $('#text4368').text("Drag Knife");
      }

    };
  });

}

function fillTree() {
  $('#filetree').empty();

  if (objectsInScene.length > 0) {

    var header = `
    <table style="width: 100%">
      <tr class="jobsetupfile">
        <td>
          <label for="filetreetable">Objects</label>
        </td>
        <td>
          <a class="btn btn-xs btn-success" onclick="addJob();"><i class="fa fa-plus" aria-hidden="true"></i> Add selection to Job</a>
        </td>
      </tr>
    </table>
    <table class="jobsetuptable" style="width: 100%" id="filetreetable">
    `

    $('#filetree').append(header);
    for (i = 0; i < objectsInScene.length; i++) {

      var xoffset = objectsInScene[i].userData.offsetX.toFixed(1);
      var yoffset = objectsInScene[i].userData.offsetY.toFixed(1);
      var xpos = objectsInScene[i].position.x.toFixed(1);
      var ypos = objectsInScene[i].position.y.toFixed(1);
      var scale = objectsInScene[i].scale.y;
      if (objectsInScene[i].name.indexOf('.svg') != -1) {
        var svgscale = objectsInScene[i].scale.x
      }

      if (objectsInScene[i].type != "Mesh") {
        var file = `
        <tr class="jobsetupfile topborder">
          <td>
            <i class="fa fa-fw fa-file-text-o" aria-hidden="true"></i>&nbsp;
            <a class="entity" href="#" onclick="attachBB(objectsInScene[`+i+`]);"><b>` + objectsInScene[i].name + `</b></a>
          </td>
          <td id="buttons`+i+`">
            <a class="btn btn-xs btn-primary" onclick="$('#move`+i+`').toggle(); $(this).toggleClass('active');"><i class="fa fa-arrows" aria-hidden="true"></i></a>
            <a class="btn btn-xs btn-danger" onclick="objectsInScene.splice('`+i+`', 1); fillTree(); fillLayerTabs();"><i class="fa fa-times" aria-hidden="true"></i></a>
          </td>
          <td>
            <input type="checkbox" value="" onclick=" $('.chkchildof`+i+`').prop('checked', $(this).prop('checked'));" id="selectall`+i+`" />
          </td>
        </tr>
        <tr class="jobsetupfile" id="move`+i+`" style="display: none;">
          <td colspan="3">
            <label >Position Offset</label>
            <table><tr><td>
            <div class="input-group">
              <span class="input-group-addon input-group-addon-xs">X:</span>
              <input type="number" class="form-control input-xs" xoffset="`+xoffset+`" value="`+ -(xoffset - xpos)+`"  id="xoffset`+i+`" objectseq="`+i+`" step="1"><br>
              <span class="input-group-addon input-group-addon-xs">mm</span>
            </div></td><td>
            <div class="input-group">
              <span class="input-group-addon input-group-addon-xs">Y:</span>
              <input type="number" class="form-control input-xs" yoffset="`+yoffset+`" value="`+ -(yoffset - ypos)+`"  id="yoffset`+i+`" objectseq="`+i+`" step="1">
              <span class="input-group-addon input-group-addon-xs">mm</span>
            </div></td></tr></table>
          </td>
        </tr>
        `
      } else {
        var file = `
        <tr class="jobsetupfile topborder">
          <td>
            <i class="fa fa-fw fa-file-photo-o" aria-hidden="true"></i>&nbsp;
            <a class="entity" href="#" onclick="attachBB(objectsInScene[`+i+`]);"><b>` + objectsInScene[i].name + `</b></a>
          </td>
          <td>
            <a class="btn btn-xs btn-primary" onclick="$('#scale`+i+`').toggle(); $(this).toggleClass('active');"><i class="fa fa-expand" aria-hidden="true"></i></a>
            <a class="btn btn-xs btn-primary" onclick="$('#move`+i+`').toggle(); $(this).toggleClass('active');"><i class="fa fa-arrows" aria-hidden="true"></i></a>
            <a class="btn btn-xs btn-danger" onclick="objectsInScene.splice('`+i+`', 1); fillTree(); fillLayerTabs();"><i class="fa fa-times" aria-hidden="true"></i></a>
          </td>
          <td>
            <input type="checkbox" value="" class="chkaddjob" id="child.`+i+`" />
          </td>
        </tr>
        <tr class="jobsetupfile" id="move`+i+`" style="display: none;">
          <td colspan="3">
            <label >Position Offset</label>
            <table><tr><td>
            <div class="input-group">
              <span class="input-group-addon input-group-addon-xs">X:</span>
              <input type="number" class="form-control input-xs" xoffset="`+xoffset+`" value="`+ -(xoffset - xpos)+`"  id="rasterxoffset`+i+`" objectseq="`+i+`" step="1"><br>
              <span class="input-group-addon input-group-addon-xs">mm</span>
            </div></td><td>
            <div class="input-group">
              <span class="input-group-addon input-group-addon-xs">Y:</span>
              <input type="number" class="form-control input-xs" yoffset="`+yoffset+`" value="`+ -(yoffset - ypos)+`"  id="rasteryoffset`+i+`" objectseq="`+i+`" step="1">
              <span class="input-group-addon input-group-addon-xs">mm</span>
            </div></td></tr></table>
          </td>
        </tr>
        <tr class="jobsetupfile" id="scale`+i+`" style="display: none;">
          <td colspan="3">
            <label>Bitmap Resolution</label>
            <div class="input-group">
              <input type="number" class="form-control input-xs" value="`+(25.4/scale)+`" id="rasterDPI`+i+`" objectseq="`+i+`">
              <span class="input-group-addon input-group-addon-xs">DPI</span>
            </div>
          </td>
        </tr>
        `
      }


      $('#filetreetable').append(file)

      if (svgscale) {
        var svgfile =`
        <tr class="jobsetupfile" id="scale`+i+`" style="display: none;">
          <td colspan="3">
            <label>SVG Resolution</label>
            <div class="input-group">
              <input type="number" class="form-control input-xs" value="`+(25.4/svgscale)+`" id="svgresol`+i+`" objectseq="`+i+`">
              <span class="input-group-addon input-group-addon-xs">DPI</span>
            </div>
          </td>
        </tr>`
        $('#filetreetable').append(svgfile)

        var scalebtn = `<a class="btn btn-xs btn-primary" onclick="$('#scale`+i+`').toggle(); $(this).toggleClass('active');"><i class="fa fa-expand" aria-hidden="true"></i></a>`
        $('#buttons'+i).prepend(scalebtn)


      }

      //  var name = objectsInScene[i].name;
       for (j = 0; j < objectsInScene[i].children.length; j++) {

         var child = `
         <tr class="jobsetupchild children`+i+`">
           <td>
            <i class="fa fa-fw fa-sm fa-object-ungroup" aria-hidden="true"></i>&nbsp;
            <a class="entity" href="#" onclick="attachBB(objectsInScene[`+i+`].children[`+j+`])" id="link`+i+`_`+j+`">`+objectsInScene[i].children[j].name+`</a>
          </td>
          <td>
            <a class="btn btn-xs btn-danger" onclick="objectsInScene[`+i+`].remove(objectsInScene[`+i+`].children[`+j+`]); fillTree();"><i class="fa fa-times" aria-hidden="true"></i></a>
          </td>
          <td>
            <input type="checkbox" value="" class="chkaddjob chkchildof`+i+`" id="child.`+i+`.`+j+`" />
          </td>
         </tr>
         `
         $('#filetreetable').append(child)
        //  var name = objectsInScene[i].children[j].name;
        objectsInScene[i].children[j].userData.link = "link"+i+"_"+j
       }
    }
    var tableend = `
    </table>
    `
    $('#filetree').append(tableend)
  } // End of if (objectsInScene.length > 0)

  if (toolpathsInScene.length > 0) {
    var toolpatheader = `
    <hr>

    <table style="width: 100%">
      <tr class="jobsetupfile">
        <td>
          <label for="toolpathstable">Toolpaths</label>
        </td>
        <td>
          <a class="btn btn-xs btn-success"><i class="fa fa-cubes" aria-hidden="true"></i> Generate G-Code</a>
        </td>
      </tr>
    </table>
    <table class="jobsetuptable" style="width: 100%" id="toolpathstable">
    `
    $('#filetree').append(toolpatheader)
    for (i = 0; i < toolpathsInScene.length; i++) {
      if (toolpathsInScene[i].type != "Mesh") {
        var toolp = `<tr class="jobsetupfile">
          <td>
            <i class="fa fa-fw fa-object-group" aria-hidden="true"></i>&nbsp;
            <a class="entity-job" href="#">`+toolpathsInScene[i].name+`</a>
          </td>
          <td>

          </td>
          <td>
            <a class="btn btn-xs btn-default" onclick="viewToolpath('`+i+`', 1);"><i class="fa fa-eye" aria-hidden="true"></i></a>
            <a class="btn btn-xs btn-danger" onclick="toolpathsInScene.splice('`+i+`', 1); fillTree(); fillLayerTabs();"><i class="fa fa-times" aria-hidden="true"></i></a>
            <a class="btn btn-xs btn-primary" onclick="setupJob(`+i+`);"><i class="fa fa-fw fa-sliders" aria-hidden="true"></i></a>
          </td>
        </tr>
        `
      } else {
        var toolp = `<tr class="jobsetupfile">
          <td>
            <i class="fa fa-fw fa-picture-o" aria-hidden="true"></i>&nbsp;
            <a class="entity-job" href="#">`+toolpathsInScene[i].name+`</a>
          </td>
          <td>

          </td>
          <td>
          <a class="btn btn-xs btn-default" onclick="viewToolpath('`+i+`', 1);"><i class="fa fa-eye" aria-hidden="true"></i></a>
            <a class="btn btn-xs btn-danger" onclick="toolpathsInScene.splice('`+i+`', 1); fillTree(); fillLayerTabs();"><i class="fa fa-times" aria-hidden="true"></i></a>
            <a class="btn btn-xs btn-primary" onclick="setupRaster(`+i+`);"><i class="fa fa-fw fa-sliders" aria-hidden="true"></i></a>
          </td>
        </tr>
        `
      }

      $('#toolpathstable').append(toolp);
    }
    var tableend = `
    </table>
    `
    $('#toolpathstable').append(tableend)
  } // End of if (toolpathsInScene.length > 0)

}



function addJob() {
  var toolpath = new THREE.Group();
  $(".chkaddjob").each(function(){

    resetColors() // Set all colors back to original

      var $this = $(this);

      if($this.is(":checked")){
          // console.log($this.attr("id"));
          var id = $this.attr("id");
          var id = id.split(".");
          if (id[2]) {
            var child = objectsInScene[id[1]].children[id[2]];
            var copy = child.clone()
            copy.translateX( child.parent.position.x );
            copy.translateY( child.parent.position.y );
            toolpath.add(copy);
          } else {
            var child = objectsInScene[id[1]];
            var copy = child.clone()
            copy.translateX( child.parent.position.x );
            copy.translateY( child.parent.position.y );
            toolpathsInScene.push(copy)
          }
      }else{
          // console.log($this.attr("id")) // Is not ticked

      }
  });
  if (toolpath.children.length > 0) {
    toolpath.name = "Vector-"+(toolpathsInScene.length)
    toolpathsInScene.push(toolpath)
  }
  fillTree();
}

function viewToolpath(i) {
  clearScene()
  $(".layertab").removeClass('active');
  $('#jobView').addClass('active');
  clearScene()
  scene.add(toolpathsInScene[i]);
  var tpath = toolpathsInScene[i];
  makeRed(tpath);
  if (toolpathsInScene[i].userData) {
    if (toolpathsInScene[i].userData.inflated) {
      scene.add(toolpathsInScene[i].userData.inflated);
      toolpathsInScene[i].userData.inflated.translateX(toolpathsInScene[i].parent.position.x)
      toolpathsInScene[i].userData.inflated.translateY(toolpathsInScene[i].parent.position.y)
    }
  };
  if (typeof(boundingBox) != 'undefined') {
      scene.remove(boundingBox);
  }
}

function clearScene() {
  var total = scene.children.length
  for (var x = 6; x < total; x++) {
    // console.log('Removing ' + scene.children[x].name + ' from scene')
    scene.remove(scene.children[x]);
  }
  var total = scene.children.length
  for (var x = 6; x < total; x++) {
    // console.log('Removing ' + scene.children[x].name + ' from scene')
    scene.remove(scene.children[x]);
  }
}

function resetColors() {
  for (i = 0; i < objectsInScene.length; i++) {
    for (j = 0; j < objectsInScene[i].children.length; j++) {
      objectsInScene[i].children[j].material.color.setHex(objectsInScene[i].children[j].userData.color);
    }
  }
}

function makeRed(tpath) {
  tpath.traverse( function ( child ) {
    if (child.type == "Line") {
      child.material.color.setRGB(1, 0.1, 0.1);
    }
  });
}

function setupJob(toolpathid) {
  $('#statusmodal').modal('show');
  $('#statusTitle').empty();
  $('#statusTitle').html('Configure Toolpath');
  $('#statusBody').empty();
  $('#statusBody2').empty();

  $('#statusBody').html('<br>Configure the operation for the toolpath <b>' + toolpathsInScene[toolpathid].name + '</b><hr>' );
  var template2 = `
  <div class="form-group">
    <label>Operation</label>
      <div class="input-group" >
        <select class="form-control" id="operation`+toolpathid+`" objectseq="`+toolpathid+`">
          <option>Laser (no path offset)</option>
          <option>Inside</option>
          <option>Outside</option>
          <option>Pocket</option>
          <option>Drag Knife</option>
        </select>
        <div class = "input-group-btn"><button class="btn btn-success" onclick="addOperation('`+toolpathid+`', $('#operation`+i+`').val(), $('#zstep`+toolpathid+`').val(), $('#zdepth`+toolpathid+`').val())">Add</button></div>
      </div>
    </div>
    <div class="form-group">
      <label >Cut Depth per pass</label>
      <div class="input-group">
        <input type="number" class="form-control" value=""  id="zstep`+toolpathid+`" objectseq="`+toolpathid+`">
        <span class="input-group-addon">mm</span>
      </div>
      <label>Final Depth</label>
      <div class="input-group">
        <input type="number" class="form-control" value=""  id="zdepth`+i+`" objectseq="`+toolpathid+`">
        <span class="input-group-addon">mm</span>
      </div>
    </div>
    <div class="form-group">
      <label>Feedrate: Cut</label>
      <div class="input-group">
        <input type="number" class="form-control" value="" id="speed`+toolpathid+`" objectseq="`+toolpathid+`">
        <span class="input-group-addon">mm/s</span>
      </div>
      <label>Feedrate: Plunge</label>
      <div class="input-group">
        <input type="number" class="form-control" value="20" id="plungespeed`+toolpathid+`" objectseq="`+toolpathid+`">
        <span class="input-group-addon">mm/s</span>
      </div>
    </div>


  <button type="button" class="btn btn-lg btn-success" data-dismiss="modal">Preview Toolpath </button>
  `
  $('#statusBody2').html(template2);

$('#statusBody').prepend(svgcnctool);

laserMode(); // Default to laser since the Select defaults to laser.  In near future I want to update this to keep last user Operation in localstorage and default to last used on when opening modal

}


function setupRaster(toolpathid) {
  $('#statusmodal').modal('show');
  $('#statusTitle').empty();
  $('#statusTitle').html('Configure Toolpath');
  $('#statusBody').empty();
  $('#statusBody2').empty();

  $('#statusBody').html('Configure the operation for the toolpath <b>' + toolpathsInScene[toolpathid].name + '</b><hr>' );
  var template2 = `
  <label >Copy image to a traced vector for cutting use </label>
  <div class="btn-group btn-group-justified" role="group" aria-label="tracegcode">
      <div class="btn-group" role="group">
          <a class="btn btn-warning btn-block" href="#">Trace to Vector</a>
      </div>
  </div>
<div class="form-group">
    <label >Raster: Proportional Feedrate</label>
    <div class="input-group">
      <span class="input-group-addon">Light</span>
      <input type="number" class="form-control input-sm"  value="20" id="feedRateW`+i+`" objectseq="`+i+`">
      <span class="input-group-addon">mm/s</span>
    </div>
    <div class="input-group">
      <span class="input-group-addon">Dark</span>
      <input type="number" class="form-control input-sm"  value="20" id="feedRateB`+i+`" objectseq="`+i+`">
      <span class="input-group-addon">mm/s</span>
    </div>
  </div>
  <div class="form-group">
    <label>Laser Power Constraints</label>
    <div class="input-group">
      <span class="input-group-addon">Min</span>
      <input type="number"  min="0" max="100" class="form-control input-sm" value="0" id="minpwr`+i+`" objectseq="`+i+`">
      <span class="input-group-addon">%</span>
    </div>
    <div class="input-group">
      <span class="input-group-addon">Max</span>
      <input type="number"  min="0" max="100" class="form-control input-sm" value="100" id="maxpwr`+i+`" objectseq="`+i+`">
      <span class="input-group-addon">%</span>
    </div>
  </div>


  <button type="button" class="btn btn-lg btn-success" data-dismiss="modal">Preview Toolpath </button>
  `
  $('#statusBody2').html(template2);
}


function laserMode() {
  $('#svgPocket').hide()
  $('#svgOutside').hide()
  $('#svgInside').hide()
  $('#svgLaserGrp').show()
  $('#svgCNCGrp').hide()
};

function cncInsideMode() {
  $('#svgPocket').hide()
  $('#svgOutside').hide()
  $('#svgInside').show()
  $('#svgLaserGrp').hide()
  $('#svgCNCGrp').show()
};

function cncOutsideMode() {
  $('#svgPocket').hide()
  $('#svgOutside').show()
  $('#svgInside').hide()
  $('#svgLaserGrp').hide()
  $('#svgCNCGrp').show()
};

function cncPocketMode() {
  $('#svgPocket').show()
  $('#svgOutside').hide()
  $('#svgInside').hide()
  $('#svgLaserGrp').hide()
  $('#svgCNCGrp').show()
};


var svgcnctool = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   version="1.1"
   id="svg4163"
   viewBox="0 0 425.19686 141.73229"
   height="40mm"
   width="120mm">
  <defs
     id="defs4165">
    <marker
       refY="0"
       refX="0"
       style="overflow:visible"
       id="DistanceX"
       orient="auto">
      <path
         style="stroke:#000000;stroke-width:0.5"
         d="M 3,-3 -3,3 M 0,-5 0,5"
         id="path4801" />
    </marker>
    <pattern
       height="8"
       width="8"
       patternUnits="userSpaceOnUse"
       y="0"
       x="0"
       id="Hatch">
      <path
         linecap="square"
         stroke="#000000"
         stroke-width="0.25"
         d="M8 4 l-4,4"
         id="path4804" />
      <path
         linecap="square"
         stroke="#000000"
         stroke-width="0.25"
         d="M6 2 l-4,4"
         id="path4806" />
      <path
         linecap="square"
         stroke="#000000"
         stroke-width="0.25"
         d="M4 0 l-4,4"
         id="path4808" />
    </pattern>
  </defs>
  <metadata
     id="metadata4168">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     transform="translate(0,-910.62993)"
     id="layer1">
    <g
       transform="translate(0,698.0315)"
       id="g4810" />
    <text
       id="text4893"
       y="788.29974"
       x="396.09375"
       style="font-style:normal;font-weight:normal;font-size:40px;line-height:125%;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       xml:space="preserve"><tspan
         y="788.29974"
         x="396.09375"
         id="tspan4895" /></text>
    <path
       id="path4871"
       d="m 99.345003,1034.6606 -12.08162,-0.066"
       style="fill:none;fill-rule:evenodd;stroke:#0000ff;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    <text
       id="svgZDepth"
       y="992.02704"
       x="150.9451"
       style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:13.75px;line-height:125%;font-family:sans-serif;-inkscape-font-specification:'sans-serif, Normal';text-align:start;letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;text-anchor:start;fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       xml:space="preserve"><tspan
         style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:15px;font-family:sans-serif;-inkscape-font-specification:sans-serif"
         y="992.02704"
         x="150.9451"
         id="tspan4909">5mm per pass</tspan></text>
    <text
       id="svgZFinal"
       y="1016.027"
       x="150.9451"
       style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:13.75px;line-height:125%;font-family:sans-serif;-inkscape-font-specification:'sans-serif, Normal';text-align:start;letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;text-anchor:start;fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       xml:space="preserve"><tspan
         style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:15px;font-family:sans-serif;-inkscape-font-specification:sans-serif"
         y="1016.027"
         x="150.9451"
         id="tspan4913">25mm</tspan></text>
    <path
       id="path4929"
       d="m 109.10628,1004.3752 12.94046,0 0,42.9047 -13.07959,0"
       style="fill:none;fill-rule:evenodd;stroke:#0000ff;stroke-width:2.36754084;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    <path
       id="path4931"
       d="m 99.804682,1013.8967 0,-26.95315 46.093748,0"
       style="fill:none;fill-rule:evenodd;stroke:#0000ff;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
    <path
       id="path4933"
       d="m 121.69678,1019.8967 0,-8.7891 23.82812,0"
       style="fill:none;fill-rule:evenodd;stroke:#0000ff;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
    <path
       id="path4865"
       d="m 87.263153,1046.7478 12.29132,0.068 0.26164,-47.64617 -12.29131,-0.0675"
       style="fill:none;fill-rule:evenodd;stroke:#0000ff;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    <path
       id="path4867"
       d="m 99.378473,1009.7035 -11.98059,-0.066"
       style="fill:none;fill-rule:evenodd;stroke:#0000ff;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    <path
       id="path4869"
       d="m 99.483443,1022.0244 -12.36075,0"
       style="fill:none;fill-rule:evenodd;stroke:#0000ff;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    <g
       id="svgCNCGrp">
      <path
         style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="m 7.4047955,999.22992 14.5452365,0 -0.276215,44.66938 43.934106,-0.1381 0.27621,-44.71271 16.70604,-0.20971"
         id="path4823" />
      <path
         style="fill:none;fill-rule:evenodd;stroke:#ff0000;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="m 20.42425,934.94302 0.01373,16.38768 0.05613,12.55643 49.254118,-0.0642 0,-24.83493 -0.1381,-20.66349"
         id="path4849" />
      <path
         style="fill:none;fill-rule:evenodd;stroke:#ff0000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="m 69.371456,939.46318 76.101664,-0.0809"
         id="path4851" />
      <path
         style="fill:none;fill-rule:evenodd;stroke:#008000;stroke-width:0.97431153px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         d="m 72.188343,995.2822 10.4442,0 0.0692,-42.68627 -10.30719,0"
         id="path4891" />
      <text
         xml:space="preserve"
         style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:13.75px;line-height:125%;font-family:sans-serif;-inkscape-font-specification:'sans-serif, Normal';text-align:start;letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;text-anchor:start;fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         x="151.66287"
         y="944.02698"
         id="svgToolDia"><tspan
           id="tspan4899"
           x="151.66287"
           y="944.02698"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:15px;font-family:sans-serif;-inkscape-font-specification:sans-serif">6.35mm</tspan><tspan
           x="151.66287"
           y="962.77698"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:15px;font-family:sans-serif;-inkscape-font-specification:sans-serif"
           id="tspan4182" /></text>
      <path
         style="fill:none;fill-rule:evenodd;stroke:#008000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         d="m 81.824892,963.68219 63.393468,0.0572"
         id="path4901" />
      <text
         xml:space="preserve"
         style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:13.75px;line-height:125%;font-family:sans-serif;-inkscape-font-specification:'sans-serif, Normal';text-align:start;letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;text-anchor:start;fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         x="150.9451"
         y="968.02698"
         id="svgZClear"><tspan
           id="tspan4905"
           x="150.9451"
           y="968.02698"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:15px;font-family:sans-serif;-inkscape-font-specification:sans-serif">10mm</tspan></text>
      <path
         style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1.56523514;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="m 64.250674,911.7996 0,42.99979 -38.727789,0 0.390625,-42.43636 9.07701,7.0511 5.882034,-7.07361 7.321206,7.63704 4.050223,-8.30309 4.734823,4.56964 z"
         id="path4174" />
      <path
         style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         d="M 25.275619,946.36321 63.669303,932.55253"
         id="path4176" />
      <path
         style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         d="m 40.191152,953.54477 c 2.762136,0 23.478151,-9.11505 23.478151,-9.11505"
         id="path4178" />
      <path
         style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         d="M 26.10426,931.72389 64.221733,917.91321"
         id="path4180" />
    </g>
    <rect
       ry="13.272638"
       y="925.77466"
       x="285.72006"
       height="89.590302"
       width="114.21847"
       id="svgToolpath"
       style="fill:#ff0000;fill-opacity:0;stroke:#ff0000;stroke-width:1.84457076;stroke-miterlimit:4;stroke-dasharray:none" />
    <rect
       ry="16.168264"
       y="916.33368"
       x="274.19955"
       height="109.13578"
       width="138.17609"
       id="svgOutside"
       style="fill:#ff0000;fill-opacity:0;stroke:#0000ff;stroke-width:2.23900015;stroke-miterlimit:4;stroke-dasharray:2.23900015,2.23900015;stroke-dashoffset:0" />
    <rect
       ry="10.74533"
       y="933.82745"
       x="295.30536"
       height="72.530975"
       width="95.214546"
       id="svgInside"
       style="fill:#ff0000;fill-opacity:0;stroke:#0000ff;stroke-width:1.51533978;stroke-miterlimit:4;stroke-dasharray:1.51533978,1.51533978;stroke-dashoffset:0" />
    <g
       transform="matrix(1.0013674,0,0,0.84944881,-299.34691,57.634685)"
       id="svgPocket">
      <g
         transform="translate(-4.9096098,90.563331)"
         id="g4380">
        <rect
           ry="12.649768"
           y="940.52863"
           x="598.74683"
           height="85.385933"
           width="95.084534"
           id="rect4184-5-0"
           style="fill:#ff0000;fill-opacity:0;stroke:#0000ff;stroke-width:1.78147352;stroke-miterlimit:4;stroke-dasharray:1.78147351, 1.78147351;stroke-dashoffset:0" />
        <rect
           ry="11.260077"
           y="944.92584"
           x="604.51123"
           height="76.005516"
           width="83.555679"
           id="rect4184-5-0-9"
           style="fill:#ff0000;fill-opacity:0;stroke:#0000ff;stroke-width:1.57558465;stroke-miterlimit:4;stroke-dasharray:1.5755847, 1.5755847;stroke-dashoffset:0" />
        <rect
           ry="9.612421"
           y="950.19373"
           x="610.46271"
           height="64.883835"
           width="72.043373"
           id="rect4184-5-0-9-7"
           style="fill:#ff0000;fill-opacity:0;stroke:#0000ff;stroke-width:1.35175025;stroke-miterlimit:4;stroke-dasharray:1.35175022, 1.35175022;stroke-dashoffset:0" />
        <rect
           ry="8.0327358"
           y="956.07275"
           x="616.49939"
           height="54.220955"
           width="61.027447"
           id="rect4184-5-0-9-7-6"
           style="fill:#ff0000;fill-opacity:0;stroke:#0000ff;stroke-width:1.13730586;stroke-miterlimit:4;stroke-dasharray:1.13730582, 1.13730582;stroke-dashoffset:0" />
        <rect
           ry="6.4051967"
           y="961.41504"
           x="622.76917"
           height="43.235065"
           width="50.041553"
           id="rect4184-5-0-9-7-6-7"
           style="fill:#ff0000;fill-opacity:0;stroke:#0000ff;stroke-width:0.91963297;stroke-miterlimit:4;stroke-dasharray:0.91963296, 0.91963296;stroke-dashoffset:0" />
        <rect
           ry="2.0477226"
           y="975.91437"
           x="639.06384"
           height="13.822125"
           width="18.543131"
           id="rect4184-5-0-9-7-6-8"
           style="fill:#ff0000;fill-opacity:0;stroke:#0000ff;stroke-width:0.31652647;stroke-miterlimit:4;stroke-dasharray:0.31652647, 0.31652647;stroke-dashoffset:0" />
        <rect
           ry="3.1671915"
           y="971.84332"
           x="635.04993"
           height="21.378538"
           width="26.244591"
           id="rect4184-5-0-9-7-6-8-7"
           style="fill:#ff0000;fill-opacity:0;stroke:#0000ff;stroke-width:0.46831697;stroke-miterlimit:4;stroke-dasharray:0.46831698, 0.46831698;stroke-dashoffset:0" />
        <rect
           ry="4.0918531"
           y="968.73926"
           x="631.41028"
           height="27.620003"
           width="33.32164"
           id="rect4184-5-0-9-7-6-8-7-2"
           style="fill:#ff0000;fill-opacity:0;stroke:#0000ff;stroke-width:0.59979939;stroke-miterlimit:4;stroke-dasharray:0.59979937, 0.59979937;stroke-dashoffset:0" />
        <rect
           ry="5.1395249"
           y="965.41052"
           x="627.10986"
           height="34.691788"
           width="41.360172"
           id="rect4184-5-0-9-7-6-8-7-2-1"
           style="fill:#ff0000;fill-opacity:0;stroke:#0000ff;stroke-width:0.74892002;stroke-miterlimit:4;stroke-dasharray:0.74892005, 0.74892005;stroke-dashoffset:0" />
      </g>
    </g>
    <text
       id="text4368"
       y="1044.9403"
       x="320.36798"
       xml:space="preserve"><tspan
         style="font-size:15.00000095px"
         y="1044.9403"
         x="320.36798"
         id="tspan4370">Pocket</tspan></text>
    <g
       id="svgLaserGrp">
      <path
         style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="m 2.8724818,999.21352 108.0078182,0"
         id="path4418" />
      <path
         style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="m 25.390625,912.51846 0,43.94532 19.335941,17.96874 19.140625,-17.87109 0.195313,-43.65234"
         id="path4420" />
      <path
         style="fill:none;fill-rule:evenodd;stroke:#ff0000;stroke-width:0.99999997;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:0.99999997, 0.99999996999999996;stroke-dashoffset:0"
         d="m 44.628907,977.06925 0,19.33594"
         id="path4424" />
    </g>
  </g>
</svg>

`
