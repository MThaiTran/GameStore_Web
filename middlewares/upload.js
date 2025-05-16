const multer = require('multer');
const path = require('path');

// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Thư mục lưu trữ file
    },
    filename: function (req, file, cb) {
        // Lấy tên file từ field name trong form-data
        const customFileName = file.originalname.split('.')[0]; // Lấy tên file không có extension
        const fileExt = path.extname(file.originalname); // Lấy extension

        if (!customFileName) {
            // Nếu không có tên, tạo tên unique
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return cb(null, file.fieldname + '-' + uniqueSuffix + fileExt);
        }

        // Sử dụng tên file gốc
        cb(null, customFileName + fileExt);
    }
});

// Kiểm tra file type
const fileFilter = (req, file, cb) => {
    // Chỉ chấp nhận các file ảnh
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Không phải file ảnh!'), false);
    }
};

// Cấu hình upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    }
});

module.exports = upload; 