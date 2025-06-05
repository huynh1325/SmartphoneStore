'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('KhuyenMai', {
      maKhuyenMai: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      maNhap: {
        type: Sequelize.STRING
      },
      tenKhuyenMai: {
        type: Sequelize.STRING
      },
      moTa: {
        type: Sequelize.STRING
      },
      giaTriGiam: {
        type: Sequelize.DECIMAL(15, 2)
      },
      kieuGiamGia: {
        type: Sequelize.STRING
      },
      giaTriGiamToiDa: {
        type: Sequelize.DECIMAL(15, 2)
      },
      soLuong: {
        type: Sequelize.INTEGER
      },
      soLuongDaDung: {
        type: Sequelize.INTEGER
      },
      ngayBatDau: {
        type: Sequelize.DATE
      },
      ngayKetThuc: {
        type: Sequelize.DATE
      },
      trangThai: {
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
    await queryInterface.dropTable('KhuyenMai');
  }
};