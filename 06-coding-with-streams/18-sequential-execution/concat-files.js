import { createWriteStream, createReadStream } from "fs";
import { Readable, Transform } from "stream";

export function concatFiles(dest, files) {
	return new Promise((resolve, reject) => {
		const destStream = createWriteStream(dest); // this is the destination we will be writing to
		Readable.from(files) // ①
			.pipe(
				new Transform({
					// ② handles each file in the sequence where we take the whole file and transform it
					objectMode: true,
					transform(filename, enc, done) {
						console.log("filename", filename);
						const src = createReadStream(filename); // creates a readStream for the individual file
						src.pipe(destStream, { end: false }); // takes the chunks we read from the src and pipes them into the destream where we write the chunks to the destination file
						src.on("error", done);
						src.on("end", done); // ③
					},
				})
			)
			.on("error", reject)
			.on("finish", () => {
				// ④
				destStream.end();
				resolve();
			});
	});
}
