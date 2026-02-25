import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

let upload: multer.Multer;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Keep in memory in production
if (process.env['NODE_ENV'] === 'production') {
  upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
  });

// Save to disk in development
} else {
  const storage = multer.diskStorage({
    destination: function (_, __, cb) {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (_, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    }
  });

  upload = multer({ storage });
}

export const uploadMiddleware = upload.single('file');