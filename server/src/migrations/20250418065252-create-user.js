'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NguoiDung', {
      maNguoiDung: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      matKhau: {
        type: Sequelize.STRING
      },
      tenNguoiDung: {
        type: Sequelize.STRING
      },
      gioiTinh: {
        type: Sequelize.STRING
      },
      soDienThoai: {
        type: Sequelize.STRING
      },
      xacThuc: {
        type: Sequelize.BOOLEAN
      },
      maXacThuc: {
        type: Sequelize.STRING
      },
      thoiGianXacThuc: {
        type: Sequelize.DATE
      },
      vaiTro: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NguoiDung');
  }
};