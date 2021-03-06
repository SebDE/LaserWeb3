var dpival;
var laserRapid;
var width;
var height;
var rectWidth;
var rectHeight;
var boundingBox;
var BBmaterial;
var BBgeometry;
var intensity;
var rastermesh; // see main.js - image shown on three canvas of raster

function rasterInit() {
    // printLog('Raster module Activated', msgcolor)

    // Raster support
    var paperscript = {};
}



// add MAP function to the Numbers function
Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function drawRaster(name, data) {

    console.group('Raster File')

    var currentIdx = objectsInScene.length + 100;

    var img = document.createElement("img");
    img.style.display = "none";
    img.id = "origImage"+currentIdx;
    img.title = name;
    // All of this will happen after the image is loaded.
    // The actual load happens after this def.
    img.onload = function() {
        document.body.appendChild(img);

        var imgwidth = img.naturalWidth;
        var imgheight = img.naturalHeight;

        $('#rasterProgressShroud').hide();
        $('#rasterparams').show();
        $("body").trigger("click") // close dropdown menu

        if ($('#useRasterBlackWhiteSpeeds').prop('checked')) {
            $("#blackwhitespeedsection").show();
        } else {
            $("#blackwhitespeedsection").hide();
        }

        printLog('Bitmap Opened', msgcolor, "raster");
        //tbfleming's threejs texture code

        // console.log('Sanity Check', img, imgwidth, imgheight)

        var geometry = new THREE.PlaneBufferGeometry(imgwidth, imgheight, 1);

        var texture = new THREE.TextureLoader().load(data);
        texture.minFilter = THREE.LinearFilter

        var material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        rastermesh = new THREE.Mesh(geometry, material);

        rastermesh.position.x = -(laserxmax / 2) + (imgwidth / 2);
        rastermesh.position.y = -(laserymax / 2) + (imgheight / 2);
        rastermesh.position.z = -0.9;
        rastermesh.name = name

        scene.add(rastermesh);
        putFileObjectAtZero(rastermesh);
        calcZeroOffset(rastermesh)
        rastermesh.userData.seq = currentIdx;
        rastermesh.userData.color = rastermesh.material.color.getHex();
        objectsInScene.push(rastermesh)
        // resetView();
        // setImgDims(currentIdx);
        $('#rasterresize').modal('show')
    };
    // This actually loads the image, and fires the onload above.
    img.src = data;
    console.log("Raster Opened")
    console.groupEnd();
};

function runRaster(index) {
  // console.group("Preparing Raster..")
  var seq = objectsInScene[index].userData.seq;
  var toRaster = 'origImage'+seq;
  var spotSizeMul = parseFloat($('#spotSize').val());
  var laserRapid = parseFloat($('#rapidspeed').val()) * 60;
  // console.log("RAPIDSPEED", laserRapid)
  var imagePosition = $('#imagePosition').val()

  // var laserFeed = $('#feedRate'+index).val() * 60;
  var rasterDPI = parseFloat($('#rasterDPI'+index).val());
  var whitespeed = $("#feedRateW"+index).val() * 60;
  var blackspeed = $("#feedRateB"+index).val() * 60;
  // var useVariableSpeed = $('#useRasterBlackWhiteSpeeds'+index).prop('checked');
  var xoffset = parseFloat($('#rasterxoffset'+index).val());
  var yoffset = parseFloat($('#rasteryoffset'+index).val());
  var minpwr = $("#minpwr"+index).val();;
  var maxpwr = $("#maxpwr"+index).val();;
  rasterNow(toRaster, index, rasterDPI, spotSizeMul, laserRapid, blackspeed, whitespeed, xoffset, yoffset, imagePosition, minpwr, maxpwr )
}


function rasterNow(toRaster, objectid, rasterDPI, spotSizeMul, laserRapid, blackspeed, whitespeed, xoffset, yoffset, imagePosition, minpwr, maxpwr ) {

    dpival = rasterDPI * 0.03937007874016;
    var img = document.getElementById(toRaster);
    // console.log(toRaster)
    height = img.naturalHeight;
    width = img.naturalWidth;
    var physheight = (height / dpival)
    var physwidth = (width / dpival) ;
    var spotSize = (physwidth / width);


    // $('#rasterProgressShroud').hide();


    paper.RasterNow({
        objectid: objectid,
        completed: gcodereceived,
        minIntensity: [minpwr],
        maxIntensity: [maxpwr],
        spotSize1: [spotSize],
        beamSize1: [spotSizeMul],
        imgheight: [height],
        imgwidth: [width],
        blackRate: [blackspeed],
        whiteRate: [whitespeed],
        rapidRate: [laserRapid],
        xOffset: [xoffset],
        yOffset: [yoffset],
        imagePos: [imagePosition],
        physicalHeight: [physheight],
        physicalWidth: [physwidth],
        div: toRaster // Div Containing the image to raster
    });
};


function gcodereceived(i) {

    printLog('Raster Completed for <b>' + objectsInScene[i].name + '</b>' , msgcolor, "raster")
    var template = `
    <form class="form-horizontal">
      <label for="startgcodefinal" class="control-label">`+objectsInScene[i].name+`</label>
      <textarea id="gcode`+i+`" spellcheck="false" style="width: 100%; height: 80px;" placeholder="processing..." disabled></textarea>
    </form>`

    $('#gcodejobs').prepend(template);

    $('#gcode'+i).val(objectsInScene[i].userData.gcode);

    var startgcode = document.getElementById('startgcode').value;
    var endgcode = document.getElementById('endgcode').value;

    $('#startgcodefinal').val(startgcode)
    $('#endgcodefinal').val(endgcode);


    console.groupEnd();

    openGCodeFromText();
};
