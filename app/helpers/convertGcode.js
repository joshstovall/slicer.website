import { CuraWASM } from 'cura-wasm';
import { resolveDefinition } from 'cura-wasm-definitions';

export async function convertGcode(stl_url) {

    return new Promise(async (resolve, reject) => {

        /* stuff using username, password */
        const slicer = new CuraWASM({
            /**
             * Specify Cura Engine launch arguments (Identical to desktop Cura Engine).
             * 
             * If you find that "-s" overrides aren't taking effect, make sure that you
             * order your arguments correctly.
             * 
             * NOTE: You CANNOT specify both this setting and overrides!
             */
            //  command: 'slice -j definitions/printer.def.json -o Model.gcode -s layer_height=0.06 -l Model.stl',

            /*
             * The 3D printer definition to slice for (See the cura-wasm-definitions
             * repository or https://github.com/cloud-cnc/cura-wasm-definitions
             * for a list of built-in definitions)
             */
            definition: resolveDefinition('ultimaker2'),

            /*
             * Overrides for the current 3D printer definition (Passed to Cura Engine
             * with the -s CLI argument)
             * 
             * NOTE: You CANNOT specify both this setting and launch arguments!
             */
            overrides: [
                {
                    /*
                     * The scope of the setting. (Passed to Cura Engine with a leading
                     * hyphen before the corresponding -s argument)
                     */
                    scope: 'e0',

                    //The override's key/name
                    key: 'mesh_position_x',

                    //The override's value
                    value: -10
                }
            ],

            /**
             * Wether or not to transfer the input STL ArrayBuffer to the worker thread
             * (Prevents duplicating large amounts of memory but empties the ArrayBuffer
             * on the main thread preventing other code from using the ArrayBuffer)
             */
            transfer: true,

            /*
             * Wether to enable verbose logging (Useful for debugging; allows Cura
             * Engine to directly log to the console)
             */
            verbose: true
        });

        //Load your STL as an ArrayBuffer
        const res = await fetch(stl_url);
        const stl = await res.arrayBuffer();

        //Progress logger (Ranges from 0 to 100)
        slicer.on('progress', percent => {
            console.log(`Progress: ${percent}%`);
        });

        //Slice (This can take multiple minutes to resolve!)
        const { gcode, metadata } = await slicer.slice(stl, 'stl');
        console.log({ gcode, metadata })

        let blob = new Blob([gcode]);
        let url = URL.createObjectURL(blob);

        //Dispose (Reccomended but not necessary to call/intended for SPAs)
        //slicer.dispose();

        if (url) {
            resolve(url);
        } else {
            reject(Error("It broke"));
        }

    });

}