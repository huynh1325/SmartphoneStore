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
        type: Sequelize.INTEGER
      },
      soLuong: {
        type: Sequelize.INTEGER
      },
      soLuongSuDung: {
        type: Sequelize.INTEGER
      },
      ngayBatDau: {
        type: Sequelize.DATE
      },
      ngayKetThuc: {
        type: Sequelize.DATE
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