import path from 'path';
import { nanoid } from 'nanoid';
import multer from 'multer';
import MulterSharpResizer from 'multer-sharp-resizer';

import { UPLOADS_DIR } from '../../config/const';

const DEFAULT_SHARP_OPTIONS = {
  fit: 'inside',
  withoutEnlargement: true,
};

// Filter files with multer
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Not an image! Please upload only images.', false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5Mb
});

export const uploadMiddleware = upload.single('file');

export const getUploadAndResizeMiddleware =
  (dir, sizes, sharpOptions = DEFAULT_SHARP_OPTIONS) =>
  async (req, res, next) => {
    uploadMiddleware(req, res, async err => {
      const key = nanoid();
      const uploadPath = path.resolve(UPLOADS_DIR, dir);
      const fileUrl = '';

      const resizeObj = new MulterSharpResizer(
        req,
        key,
        sizes,
        uploadPath,
        fileUrl,
        sharpOptions
      );

      await resizeObj.resize();

      req.body.key = key;

      next();
    });
  };
