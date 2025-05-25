const path = require('path');

// Upload single image
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy file ảnh'
            });
        }

        // Trả về thông tin file đã upload
        res.status(200).json({
            success: true,
            message: 'Upload ảnh thành công',
            data: {
                filename: req.file.filename,
                // path: req.file.path,
                // size: req.file.size
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
};

// Upload multiple images
exports.uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy file ảnh'
            });
        }

        // Trả về thông tin các file đã upload
        const files = req.files.map(file => ({
            filename: file.filename,
            path: file.path,
            size: file.size
        }));

        res.status(200).json({
            success: true,
            message: 'Upload nhiều ảnh thành công',
            data: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
};

// Upload game images
exports.uploadGameImages = async (req, res) => {
    try {
        // Kiểm tra xem có đủ 7 ảnh không
        const requiredFiles = ['logo', 'sp1', 'sp2', 'sp3', 'sp4', 'sp5', 'sp6'];
        const uploadedFiles = req.files || [];

        // Kiểm tra số lượng file
        if (uploadedFiles.length !== 7) {
            return res.status(400).json({
                success: false,
                message: 'Cần upload đúng 7 ảnh (1 logo và 6 ảnh screenshot)'
            });
        }

        // Kiểm tra các file bắt buộc
        const missingFiles = requiredFiles.filter(field =>
            !uploadedFiles.some(file => file.fieldname === field)
        );

        if (missingFiles.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Thiếu các file: ${missingFiles.join(', ')}`
            });
        }

        // Trả về thông tin các file đã upload
        const files = uploadedFiles.map(file => ({
            fieldname: file.fieldname,
            filename: file.filename,
            path: file.path.replace(/\\/g, '/'), // Chuyển đổi đường dẫn Windows sang URL
            size: file.size
        }));

        res.status(200).json({
            success: true,
            message: 'Upload ảnh game thành công',
            data: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
};

// Upload game image
exports.uploadGameImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy file ảnh game'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Upload ảnh game thành công',
            data: {
                filename: req.file.filename  // Chỉ trả về tên file
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh game',
            error: error.message
        });
    }
};

// Upload folder with logo and screenshots
exports.uploadFolderWithImages = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy file ảnh'
            });
        }

        // Kiểm tra các file bắt buộc
        const requiredFiles = ['logo', 'sp1', 'sp2', 'sp3', 'sp4', 'sp5', 'sp6'];
        
        // Đếm tổng số file đã upload
        const totalFiles = Object.values(req.files).reduce((total, files) => total + files.length, 0);

        // Kiểm tra số lượng file
        if (totalFiles !== 7) {
            return res.status(400).json({
                success: false,
                message: 'Cần upload đúng 7 ảnh (1 logo và 6 ảnh screenshot)'
            });
        }

        // Kiểm tra các file bắt buộc
        const missingFiles = requiredFiles.filter(field => !req.files[field]);

        if (missingFiles.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Thiếu các file: ${missingFiles.join(', ')}`
            });
        }

        const folderName = req.body.folderName || 'default';

        // Trả về thông tin các file đã upload
        const files = requiredFiles.map(field => {
            const file = req.files[field][0];
            let filename;
            if (field === 'logo') {
                filename = 'Logo.png';
            } else if (field.startsWith('sp')) {
                const number = field.replace('sp', '');
                filename = `Sp${number}.png`;
            } else {
                filename = file.filename;
            }

            return {
                fieldname: field,
                filename: filename,
                path: `frontend/assets/Images/${folderName}/${filename}`,
                size: file.size
            };
        });

        res.status(200).json({
            success: true,
            message: 'Upload ảnh thành công',
            data: {
                folderName: folderName,
                files: files
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
}; 