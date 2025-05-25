const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Tạo thư mục dựa trên folder name từ request
        const folderName = req.body.folderName || 'default';
        const uploadPath = path.join('frontend', 'assets', 'Images', folderName);
        
        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Sử dụng tên file cố định dựa trên fieldname
        const fieldName = file.fieldname;
        let fileName;
        
        if (fieldName === 'logo') {
            fileName = 'Logo.png';
        } else if (fieldName.startsWith('sp')) {
            const spNumber = fieldName.replace('sp', '');
            fileName = `Sp${spNumber}.png`;
        } else {
            fileName = file.originalname;
        }
        
        cb(null, fileName);
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