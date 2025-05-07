const fs = require('fs');
const path = require('path');

const deleteImage = (imagePath) => {
    if (!imagePath) return;

    const relativeImagePath = imagePath.replace(/^\/?image\//, '');

    const fullPath = path.join(__dirname, '..', 'public', 'image', relativeImagePath);

    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.warn(`Ảnh không tồn tại: ${fullPath}`);
            return;
        }

        fs.unlink(fullPath, (err) => {
            if (err) {
                console.error(`Xóa ảnh thất bại: ${fullPath}`, err);
            } else {
                console.log(`Đã xóa ảnh: ${fullPath}`);
            }
        });
    });
};

module.exports = deleteImage;
