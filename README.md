# Ghost Zap
Interactive halloween game display for 2023.

Display game on a projector or similar and give players red laser pointers to zap the ghosts. Just something fun I made for the trick-or-treaters on Halloween 2023.

Made with TypeScript, Pixi.js, tracking.js and love.

# Setup
You'll need a projector, a camera that can view the projector, laser pointers, and a computer, of course.

- Install modules with npm
- Run `npm run dev` for webpack dev or `npm run build.release` to generate the release files
  + Release files will need to be served via a webserver like `http-server` because they use webgl
- The out directory needs a copy of trackingjs (tracking-min.js) in it. You'll need to add that manually
- To calibrate the screen, click on the video feed on all four corners of the screen. Go in this order: upper left, upper right, lower left, lower right. This tells the game where the edges of the game screen are within the camera feed so that the laser points can be mapped onto game coordinates.
- Click on the game display canvas to enter full screen
- Have fun!

# Note
In Tracker.ts, you'll see a few variations of the `laser-red` detection function. This can be tricky to get right and will probably need some tweaking based on the lighting in your environment. Take a screenshot with your laser on the screen against a black background and look at the rgb values. Identify thresholds or ratios that will work for the color of your laser, but not the white objects or possible other lights in your environment.
