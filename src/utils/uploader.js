import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img/img-products');
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() + '-' + file.originalname;
        cb(null, newFileName);
    },
});

const uploader = multer({ storage: storage });

export default uploader;
