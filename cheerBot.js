var five = require("johnny-five"),
    board = new five.Board(),
    keypress = require("keypress");


board.on("ready", function () {

    var botSpeed = 1;
    var cheerServoStepSize = 20; //step-size in degrees

    // SumoBot servos
    var servoRight = new five.Servo({
        pin: 12,
        type: "continuous"
    });
    var servoLeft = new five.Servo({
        pin: 11,
        type: "continuous"
    });

    //Cheering servos
    var cheerArm1 = new five.Servo({
        pin: 10,
        range: [60, 140]
    });
    var cheerArm2 = new five.Servo({
        pin: 9,
        range: [40, 120]
    });

    /**
     * This will raise both cheering arms to max height position
     */
    function cheerRaise() {
        cheerArm1.pos = 60;
        cheerArm2.pos = 120;
        cheerArm2.to(cheerArm2.pos);
        cheerArm1.to(cheerArm1.pos);
    }

    /**
     * This will lower both cheering arms to min height position
     */
    function cheerLower() {
        cheerArm1.pos = 135;
        cheerArm2.pos = 45;
        cheerArm2.to(cheerArm2.pos);
        cheerArm1.to(cheerArm1.pos);
    }

    /**
     * This will move the cheerings arms to thier set position
     * @return {[type]}
     */
    function cheerGo() {
        cheerArm2.to(cheerArm2.pos);
        cheerArm1.to(cheerArm1.pos);
    }

    /**
     * This function controlls the cheer bot. It is a callback on keypress, 
     * letting the controller use the keyboard to control the cheer bot.
     * @param  {Object} ch    character (not used in our code)
     * @param  {Object} key   pressed key, 
     */
    function keyControl(ch, key) {
        if (key) {
            console.log(ch, key);

            // controls for cheering
            if (key.name === "up") {
                cheerRaise();
            }
            if (key.name === "down") {
                cheerLower();
            }
            if (key.name === "right") {
                cheerArm2.pos -= cheerServoStepSize;
                cheerArm1.pos -= cheerServoStepSize;
                cheerGo();
            }
            if (key.name === "left") {
                cheerArm2.pos += cheerServoStepSize;
                cheerArm1.pos += cheerServoStepSize;
                cheerGo();
            }

            // controls for moving cheerBot around

            //Stop
            if (key.name === "space") {
                servoRight.center();
                servoLeft.center();
            }
            //Retired/Slow-mo mode
            if (key.name === "z") {
                botSpeed = (botSpeed === 1) ? 0.1 : 1;
            }

            // forward
            if (key.name === "w") {
                servoLeft.cw(botSpeed);
                servoRight.ccw(botSpeed);
            }

            //backwards
            if (key.name === "s") {
                servoLeft.ccw(botSpeed);
                servoRight.cw(botSpeed);
            }

            //right
            if (key.name === "d") {
                servoLeft.cw(botSpeed);
                servoRight.cw(botSpeed);
            }

            //left
            if (key.name === "a") {
                servoLeft.ccw(botSpeed);
                servoRight.ccw(botSpeed);
            }
        }
    }

    /**
     * initialize cheerBot by cheering UP and centering running servos.
     */
    function cheerUp() {
        //init sumobot
        servoRight.center();
        servoLeft.center();

        //init cheer arms
        cheerRaise();
    }

    cheerUp();

    // listen for the "keypress" event
    keypress(process.stdin);
    process.stdin.on('keypress', keyControl);
    process.stdin.setRawMode(true);
    process.stdin.resume();
});