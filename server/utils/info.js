const exiftoolBin = require("dist-exiftool");
const exiftool = require("node-exiftool");
const fs = require("fs");

async function information(path) {
    const rs = fs.createReadStream(path);
    const ep = new exiftool.ExiftoolProcess(exiftoolBin);
    try {
        await ep.open();
        const result = await ep.readMetadata(rs, ["-File:all"]);

        const lens = result.data[0]["LensID"] || "Not Found";
        const lensaf = result.data[0]["FocusMode"] || "Not Found";
        const creatdate = result.data[0]["CreateDate"] || "Not Found";
        const iso = result.data[0]["ISO"] || "Not Found";
        const shutterspeed = result.data[0]["ShutterSpeed"] || "Not Found";
        const maxaperture = result.data[0]["MaxApertureValue"] || "Not Found";
        const artist = result.data[0]["Artist"] || "Not Found";
        const imagesize = result.data[0]["FullImageSize"] || "Not Found";
        const whitebalance = result.data[0]["WhiteBalance"] || "Not Found";
        const rating = result.data[0]["Rating"] || "Not Found";
        const color = result.data[0]["ColorMode"] || "Not Found";
        const camera = result.data[0]["Model"] || "Not Found";

        return {
            lens,
            lensaf,
            creatdate,
            iso,
            shutterspeed,
            maxaperture,
            artist,
            imagesize,
            whitebalance,
            rating,
            color,
            camera,
        };
    } finally {
        await ep.close();
    }
}

module.exports = { information };
