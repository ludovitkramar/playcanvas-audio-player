import * as pc from "playcanvas"

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const start = async () => {
    const gfxOptions = {};
    const device = await pc.createGraphicsDevice(canvas, gfxOptions);
    device.maxPixelRatio = window.devicePixelRatio;

    const createOptions = new pc.AppOptions();
    createOptions.graphicsDevice = device;
    createOptions.mouse = new pc.Mouse(document.body);
    createOptions.touch = new pc.TouchDevice(document.body);
    createOptions.elementInput = new pc.ElementInput(canvas);

    createOptions.componentSystems = [
        pc.RenderComponentSystem,
        pc.CameraComponentSystem,
        pc.ScreenComponentSystem,
        pc.ButtonComponentSystem,
        pc.ElementComponentSystem
    ];
    createOptions.resourceHandlers = [pc.TextureHandler, pc.FontHandler];

    const app = new pc.AppBase(canvas);
    app.init(createOptions);


    // fill the available space at full resolution
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    // ensure canvas is resized when window changes size
    const resize = () => app.resizeCanvas();
    window.addEventListener('resize', resize);
    app.on('destroy', () => {
        window.removeEventListener('resize', resize);
    });

    // create directional light entity
    const light = new pc.Entity('light');
    light.addComponent('light');
    app.root.addChild(light);
    light.setEulerAngles(45, 0, 0);

    const assets = {
        font: new pc.Asset('font', 'font', { url: 'https://playcanvas.github.io/static/assets/fonts/arial.json' })
    };

    const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
    assetListLoader.load(() => {
        app.start();

        // Create a camera
        const camera = new pc.Entity();
        camera.addComponent('camera', {
            clearColor: new pc.Color(30 / 255, 30 / 255, 30 / 255)
        });
        app.root.addChild(camera);

        // Create a 2D screen
        const screen = new pc.Entity();
        screen.addComponent('screen', {
            referenceResolution: new pc.Vec2(1280, 720),
            scaleBlend: 0.5,
            scaleMode: pc.SCALEMODE_BLEND,
            screenSpace: true
        });
        app.root.addChild(screen);

        // Button
        const button = new pc.Entity();
        button.addComponent('button');
        button.addComponent('element', {
            anchor: [0.5, 0.5, 0.5, 0.5],
            height: 40,
            pivot: [0.5, 0.5],
            type: pc.ELEMENTTYPE_IMAGE,
            width: 175,
            useInput: true
        });
        screen.addChild(button);

        // Create a label for the button
        const label = new pc.Entity();
        label.addComponent('element', {
            anchor: [0.5, 0.5, 0.5, 0.5],
            color: new pc.Color(0, 0, 0),
            fontAsset: assets.font.id,
            fontSize: 32,
            height: 64,
            pivot: [0.5, 0.5],
            text: ' Play / Pause ',
            type: pc.ELEMENTTYPE_TEXT,
            width: 128,
            wrapLines: true
        });
        button.addChild(label);

        // Change the background color every time the button is clicked
        button.button.on('click', function () {
            camera.camera.clearColor = new pc.Color(Math.random(), Math.random(), Math.random());
        });
    });
}

start();