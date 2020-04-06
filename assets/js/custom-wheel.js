$(function () {
  /**
 * This function is for fixed select2 if need keep below
 * @param {jQuery} $
 */

  var theWheel = undefined

  function drawTriangle() {
    // Get the canvas context the wheel uses.
    let ctx = theWheel.ctx;

    ctx.strokeStyle = '#000';          // Set line colour.
    ctx.fillStyle = '#FFB600';             // Set fill colour.
    ctx.lineWidth = 2;
    ctx.beginPath();                    // Begin path.
    ctx.moveTo(140, 5);                 // Move to initial position.
    ctx.lineTo(180, 5);                 // Draw lines to make the shape.
    ctx.lineTo(160, 40);
    ctx.lineTo(140, 5);
    ctx.stroke();                       // Complete the path by stroking (draw lines).
    ctx.fill();                         // Then fill.
  }

  var initWinwheel = {
    init: function () {
      $("#BtnCheckReward").click(function () {
        initWinwheel.checkReward();
      });
      this.callGetRewards();
    },
    winWheel: function (listOfRewards) {
      var segments = [];
      $.each(listOfRewards, function (index, value) {
        segments.push({ fillStyle: value.color, text: value.name, strokeStyle: 'transparent' });
      });
      theWheel = new Winwheel({
        canvasId: "spinner",
        innerRadius: 0,
        numSegments: 8,
        outerRadius: 140,
        segments: segments,
        textFillStyle: "white",
        textFontSize: 18,
        textDirection: "reversed",
        drawText: true,
        animation:
        {
          type: 'spinToStop',
          duration: 5,
          spins: 8,
          callbackAfter: 'drawTriangle()',
          callbackFinished: 'alertPrize()'
        }
      });

      //   theWheel = new Winwheel({
      //     canvasId: "spinner",
      //     'innerRadius':0,
      //     'numSegments'       : 8,                // Specify number of segments.
      //     'outerRadius'       : 140,              // Set outer radius so wheel fits inside the background.
      //     'drawText'          : true,             // Code drawn text can be used with segment images.
      //     'textFontSize'      : 16,               // Set text options as desired.
      //     'textOrientation'   : 'curved',
      //     'textAlignment'     : 'inner',
      //     'textMargin'        : 90,
      //     'textFontFamily'    : 'arial',
      //     'textLineWidth'     : 0,
      //     'textFillStyle'     : 'white',
      //     'drawMode'          : 'segmentImage',    // Must be segmentImage to draw wheel using one image per segemnt.
      //     'segments'          :                    // Define segments including image and text.
      //     [
      //        {'image' : 'umroh.png', "fillStyle":"#23c6c8", 'text' : 'Jane', strokeStyle: 'transparent'},
      //        {'image' : 'umroh.png', "fillStyle":"#23c6c8", 'text' : 'Tom', strokeStyle: 'transparent'},
      //        {'image' : 'umroh.png', "fillStyle":"#23c6c8", 'text' : 'Mary', strokeStyle: 'transparent'},
      //        {'image' : 'umroh.png', "fillStyle":"#23c6c8", 'text' : 'Alex', strokeStyle: 'transparent'},
      //        {'image' : 'umroh.png', "fillStyle":"#23c6c8", 'text' : 'Sarah', strokeStyle: 'transparent'},
      //        {'image' : 'umroh.png', "fillStyle":"#23c6c8", 'text' : 'Bruce', strokeStyle: 'transparent'},
      //        {'image' : 'umroh.png', "fillStyle":"#23c6c8", 'text' : 'Rose', strokeStyle: 'transparent'},
      //        {'image' : 'umroh.png', "fillStyle":"#23c6c8", 'text' : 'Steve', strokeStyle: 'transparent'}
      //     ],
      //     'animation' :           // Specify the animation to use.
      //     {
      //         'type'     : 'spinToStop',
      //         'duration' : 5,
      //         'spins'    : 8,
      //     }
      // });

      // Usual pointer drawing code.
      drawTriangle();


    },
    checkReward: function () {
      var url = "/Spinner/CheckReward";
      $.ajax({
        url: url,
        method: "POST",
        data: {
          voucher: $("#DecodedQ").val()
        },
        success: function (response) {
          if (response.success) {
            if (response.rewardCode === zonkCode) {
              message = "Mohon maaf anda gagal memenangkan undian ini";
              win = false;
              var segment = segmentsArray.find(function (v, i) {
                return v.id === response.rewardCode;
              });

              var segmentIndex = segment.segmentIndex;
              var stopAt = theWheel.getRandomForSegment(segmentIndex);

              // Important thing is to set the stopAngle of the animation before stating the spin.
              theWheel.animation.stopAngle = stopAt;

              // Start the spin animation here.
              theWheel.startAnimation();

            } else if (response.rewardCode === usedCode) {
              swal("Kesalahan", "Mohon maaf voucher sudah pernah digunakan sebelumnya", "error");

            } else {
              var segment = segmentsArray.find(function (v, i) {
                return v.id === response.rewardCode;
              });
              var segmentIndex = segment.segmentIndex;
              var rewardName = segment.name;
              var stopAt = theWheel.getRandomForSegment(segmentIndex);

              message = "Selamat, anda mendapatkan hadiah " + rewardName + ". Corteva akan segera menghubungi anda melalui nomor telepon yang sudah didaftarkan";
              win = true;
              // Important thing is to set the stopAngle of the animation before stating the spin.
              theWheel.animation.stopAngle = stopAt;

              // Start the spin animation here.
              theWheel.startAnimation();
            }

          } else {
            swal("Error", "Terjadi kesalahan server, mohon refresh page ini kembali", "error");
          }
        },
        error: function () {
          swal("Error", "Terjadi masalah koneksi internet", "error");
        }
      });
    },
    callGetRewards: function () {
      var url = "/Spinner/GetRewards";
      var response = {
        "rewards": [{ "id": "ffbc24ec-5b2b-4bbb-8b33-4b104baff4cf", "name": "Prize 1", "color": "#f44242" },
        { "id": "acdd0e6c-e6b8-407e-9c4c-2050de214dd4", "name": "Prize 2", "color": "#ab3434" },
        { "id": "74e36cb9-c22e-47c0-8a59-9d988fb5b54b", "name": "Prize 3", "color": "#ed5565" },
        { "id": "22c499ae-8c66-4eb3-b479-f58b5336176e", "name": "Prize 4", "color": "#fba257" },
        { "id": "d757588d-662a-45c1-a2c4-927fb74d3003", "name": "Prize 5", "color": "#f7d95c" },
        { "id": "79f95eab-bd1d-4f16-b044-90659aa12d7d", "name": "Prize 6", "color": "#23c6c8" },
        { "id": "15b854b7-b676-4513-9ce3-f83088d6c66c", "name": "Prize 7", "color": "#4874bf" },
        { "id": "00000000-0000-0000-0000-000000000000", "name": "Zonk", "color": "#0e367c" }]
      }


      segmentsArray = [];
      var iterator = 1;
      $.each(response.rewards, function (index, value) {
        value.segmentIndex = iterator++;
        segmentsArray.push(value);
      });
      initWinwheel.winWheel(segmentsArray);
    }
  };


  initWinwheel.init();
});