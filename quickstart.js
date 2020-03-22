
        var device;
$(function () {
    var speakerDevices = document.getElementById('speaker-devices');
    var ringtoneDevices = document.getElementById('ringtone-devices');
    var outputVolumeBar = document.getElementById('output-volume');
    var inputVolumeBar = document.getElementById('input-volume');
    var volumeIndicators = document.getElementById('volume-indicators');



 //   log('Requesting Capability Token...');
    $.getJSON('https://turquoise-salamander-3469.twil.io/capability-token')
            .then(function (data) {
               // log('Got a token.');
                console.log('Token: ' + data.token);

                // Setup Twilio.Device
                device = new Twilio.Device(data.token);

                device.on('ready', function (device) {
                    console.log('Twilio.Device Ready!');

                });

                device.on('error', function (error) {
                    console.log('Twilio.Device Error: ' + error.message);
                });

                device.on('connect', function (conn) {
                    console.log('Successfully established call!');

                });

                device.on('disconnect', function (conn) {
                    console.log('Call ended.');
                });

                device.on('incoming', function (conn) {
                   // log('Incoming connection from ' + conn.parameters.From);
                    var archEnemyPhoneNumber = '+12093373517';

                    if (conn.parameters.From === archEnemyPhoneNumber) {
                        conn.reject();
                      //  log('It\'s your nemesis. Rejected call.');
                    } else {
                        conn.accept();
                    }
                });


            })
            .catch(function (err) {
                console.log(err);
                // log('Could not get a token from server!');
            });


});
function openDialPad() {
    $(".dial-pad-container").show();
}
function closeDialPad() {
    $(".dial-pad-container").hide();
}
function hangup() {
    if (device) {
        device.disconnectAll();
         $(".calling-panel").hide();
    }
}

function sendDigits(digit) {
    device.activeConnection().sendDigits(digit);
}

function mute(ele) {
    if ($(ele).hasClass("unmuted")) {
        $(ele).addClass("muted");
        $(ele).removeClass("unmuted");
        $(ele).find(".mute").show();
        $(ele).find(".un-mute").hide();
        device.activeConnection().mute(true);
    } else {
        $(ele).removeClass("muted");
        $(ele).addClass("unmuted");
        $(ele).find(".mute").hide();
        $(ele).find(".un-mute").show();
        device.activeConnection().mute(false);
    }


}

function makeCall(num) {
    var params = {
        To: num
    };
    if (device) {
        device.connect(params);
        $(".calling-panel").show();
    }
}